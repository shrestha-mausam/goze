'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
    PlaidLinkError,
    PlaidLinkOnExitMetadata,
    PlaidLinkOnSuccessMetadata,
    PlaidLinkOptions,
    usePlaidLink,
} from 'react-plaid-link';
import { createPlaidLinkToken, exchangePlaidPublicToken } from '@/lib/api.client';
import { PlaidLinkTokenResponse, Account } from '@/lib/types';

interface FinancialAccountsProps {
    accounts: Account[];
    loading: boolean;
    error: string | null;
}

const FinancialAccounts: React.FC<FinancialAccountsProps> = ({ accounts, loading: accountsLoading, error: accountsError }) => {
    console.log('FinancialAccounts');
    const { themeType } = useTheme();
    const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
    const [shouldOpenPlaidLink, setShouldOpenPlaidLink] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const linkTokenExpiration = useRef<string | null>(null);


    const config: PlaidLinkOptions = {
        token: plaidLinkToken,
        onSuccess: (
            publicToken: string,
            metadata: PlaidLinkOnSuccessMetadata
        ) => {
            // Handle successful link here
            // You can send the public token to your backend
            exchangePlaidPublicToken(publicToken);
        },
        onExit: (
            err: PlaidLinkError | null,
            metadata: PlaidLinkOnExitMetadata
        ) => {
            // Handle link exit here
        },
    };

    const { open, ready } = usePlaidLink(config);


    const generatePlaidLinkToken = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Generating Plaid Link Token');
            const response = await createPlaidLinkToken();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPlaidLinkToken(data.data.link_token);
            linkTokenExpiration.current = data.expiration;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to generate link token';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const isLinkTokenExpired = (): boolean => {
        if (!linkTokenExpiration || linkTokenExpiration.current === null) return false;
        
        const expirationDate = new Date(linkTokenExpiration.current);
        const now = new Date();
        
        return now.getUTCMilliseconds() >= expirationDate.getUTCMilliseconds();
    };

    const handleAddAccount = async (): Promise<void> => {
        if (!plaidLinkToken || isLinkTokenExpired()) {
            await generatePlaidLinkToken();
        }
        setShouldOpenPlaidLink(true);
    };

    useEffect(() => {
        if (shouldOpenPlaidLink && ready) {
            open();
        }
    }, [shouldOpenPlaidLink, ready, open]);

    // Helper function to get the appropriate icon for each account type
    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'depository':
                return 'pi-building';
            case 'credit':
                return 'pi-credit-card';
            case 'investment':
                return 'pi-chart-line';
            case 'loan':
                return 'pi-money-bill';
            default:
                return 'pi-wallet';
        }
    };

    // Get header divider class based on theme
    const getHeaderDividerClass = () => {
        return themeType === 'dark'
            ? 'border-bottom-1 border-gray-700' // Slightly lighter border for dark mode
            : 'border-bottom-1 border-300'; // Light border for light mode
    };

    // Format currency
    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) {
            return '$0.00';
        }
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    return (
        <div className="p-3 flex flex-column h-full">
            <div
                className={`flex justify-content-between align-items-center pb-2 mb-3 ${getHeaderDividerClass()}`}
            >
                <div className="flex align-items-center">
                    <i className="pi pi-wallet text-primary mr-2"></i>
                    <h3 className="text-lg font-bold m-0">Accounts</h3>
                </div>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-sm p-button-text"
                    tooltip="Add Account"
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={handleAddAccount}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="p-2 mb-2 bg-red-100 border border-red-300 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {accountsError && (
                <div className="p-2 mb-2 bg-red-100 border border-red-300 text-red-700 rounded">
                    Error: {accountsError}
                </div>
            )}

            {accountsLoading && (
                <div className="flex justify-content-center align-items-center p-4">
                    <i className="pi pi-spin pi-spinner text-2xl"></i>
                    <span className="ml-2">Loading accounts...</span>
                </div>
            )}

            {!accountsLoading && !accountsError && (
                <div className="accounts-list flex-grow-1 overflow-auto">
                    {accounts.length === 0 ? (
                        <div className="flex justify-content-center align-items-center p-4 text-500">
                            <i className="pi pi-info-circle mr-2"></i>
                            <span>No accounts found. Add an account to get started.</span>
                        </div>
                    ) : (
                        accounts.map((account) => (
                            <div
                                key={account.accountId}
                                className="p-2 flex justify-content-between align-items-center"
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <div className="flex align-items-center">
                                    <i
                                        className={`pi ${getAccountIcon(account.type)} mr-2 ${(account.currentBalance || 0) >= 0 ? 'text-blue-500' : 'text-pink-500'}`}
                                    ></i>
                                    <div>
                                        <div className="font-medium">{account.name}</div>
                                        {account.mask && (
                                            <div className="text-sm text-500">****{account.mask}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`font-medium ${(account.currentBalance || 0) >= 0 ? 'text-blue-500' : 'text-pink-500'}`}
                                    >
                                        {formatCurrency(account.currentBalance)}
                                    </div>
                                    {account.availableBalance !== undefined && account.availableBalance !== account.currentBalance && (
                                        <div className="text-sm text-500">
                                            Available: {formatCurrency(account.availableBalance)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default FinancialAccounts;

'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Transaction } from '@/lib/types';
import { getPlaidCategoryIcon } from '@/lib/utils';

interface ExpenseTransactionsListProps {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
}

const ExpenseTransactionsList: React.FC<ExpenseTransactionsListProps> = ({ transactions, loading, error }) => {
    const { themeType } = useTheme();


    // Get header divider class based on theme
    const getHeaderDividerClass = () => {
        return themeType === 'dark'
            ? 'border-bottom-1 border-gray-700' // Slightly lighter border for dark mode
            : 'border-bottom-1 border-300'; // Light border for light mode
    };

    // Format currency
    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };


    return (
        <div className="p-3 flex flex-column h-full">
            <div
                className={`flex justify-content-between align-items-center pb-2 mb-3 ${getHeaderDividerClass()}`}
            >
                <div className="flex align-items-center">
                    <i className="pi pi-list text-primary mr-2"></i>
                    <h2 className="text-xl font-bold m-0">
                        Recent Expenses
                    </h2>
                </div>
                <Button icon="pi pi-plus" label="New" className="p-button-sm" />
            </div>

            {loading && (
                <div className="flex justify-content-center align-items-center p-4">
                    <i className="pi pi-spin pi-spinner text-2xl"></i>
                    <span className="ml-2">Loading expenses...</span>
                </div>
            )}

            {error && (
                <div className="p-3 mb-2 bg-red-100 border border-red-300 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <div className="transactions-list flex-grow-1 overflow-auto">
                    {transactions.length === 0 ? (
                        <div className="flex justify-content-center align-items-center p-4 text-500">
                            <i className="pi pi-info-circle mr-2"></i>
                            <span>No expense transactions found</span>
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <div
                                key={transaction.plaidTransactionId}
                                className={`p-3 mb-2 border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
                            >
                                <div className="flex justify-content-between align-items-center">
                                    <div className="flex align-items-center">
                                        <i
                                            className={`pi ${getPlaidCategoryIcon(transaction.plaidCategory || 'Other')} p-2 border-circle mr-3 ${transaction.amount >= 0 ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}
                                        ></i>
                                        <div>
                                            <div className="font-medium">
                                                {transaction.name}
                                            </div>
                                            <div
                                                className={`text-sm ${themeType === 'dark' ? 'text-400' : 'text-500'}`}
                                            >
                                                {transaction.plaidCategory || 'Uncategorized'} •{' '}
                                                {formatDate(transaction.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-medium text-pink-500">
                                        {formatCurrency(Math.abs(transaction.amount))}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpenseTransactionsList;

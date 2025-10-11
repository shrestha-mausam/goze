'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import CategoryManagement from '@/components/home/CategoryManagement';
import ChartOverview from '@/components/home/ChartOverview';
import FinancialAccounts from '@/components/home/FinancialAccounts';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import ExpenseTransactionsList from '@/components/home/ExpenseTransactionsList';
import { useTheme } from '@/contexts/ThemeContext';
import { getAllTransactions, getAllAccounts, getExpenseTransactions } from '@/lib/api.client';
import { Transaction, Account } from '@/lib/types';

interface HomeData {
    allTransactions: Transaction[];
    expenseTransactions: Transaction[];
    accounts: Account[];
    loading: boolean;
    error: string | null;
}

export default function Home() {
    const { themeType } = useTheme();
    const [data, setData] = useState<HomeData>({
        allTransactions: [],
        expenseTransactions: [],
        accounts: [],
        loading: true,
        error: null,
    });

    // Centralized data fetching
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setData(prev => ({ ...prev, loading: true, error: null }));

                // Fetch all data in parallel
                const [allTransactionsResponse, expenseTransactionsResponse, accountsResponse] = await Promise.all([
                    getAllTransactions(),
                    getExpenseTransactions(),
                    getAllAccounts(),
                ]);

                // Check if all requests were successful
                if (!allTransactionsResponse.ok || !expenseTransactionsResponse.ok || !accountsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [allTransactionsData, expenseTransactionsData, accountsData] = await Promise.all([
                    allTransactionsResponse.json(),
                    expenseTransactionsResponse.json(),
                    accountsResponse.json(),
                ]);

                setData({
                    allTransactions: allTransactionsData.data?.transactions || [],
                    expenseTransactions: expenseTransactionsData.data?.transactions || [],
                    accounts: accountsData.data?.accounts || [],
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: error instanceof Error ? error.message : 'Failed to load data',
                }));
            }
        };

        fetchAllData();
    }, []);

    return (
        <AppLayout title="Home | Goze">
            {/* Include the Sidebar component */}
            <Sidebar />

            {/* Include the Topbar component */}
            <Topbar />

            <div className="grid h-full p-3 overflow-auto">
                {/* Left Section (60%) */}
                <div className="col-7 p-2">
                    {/* Top Section - Chart Overview */}
                    <div
                        className={`mb-3 border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                        style={{ height: '400px' }}
                    >
                        <ChartOverview 
                            themeType={themeType} 
                            transactions={data.allTransactions}
                            loading={data.loading}
                            error={data.error}
                        />
                    </div>

                    {/* Bottom Section - Categories and Accounts */}
                    <div className="grid">
                        {/* Categories */}
                        <div className="col-6 pr-1">
                            <div
                                className={`h-full border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                                style={{
                                    maxHeight: 'calc(100vh - 500px)',
                                    overflow: 'auto',
                                }}
                            >
                                <CategoryManagement 
                                    transactions={data.expenseTransactions}
                                    loading={data.loading}
                                    error={data.error}
                                />
                            </div>
                        </div>

                        {/* Accounts */}
                        <div className="col-6 pl-1">
                            <div
                                className={`h-full border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                                style={{
                                    maxHeight: 'calc(100vh - 500px)',
                                    overflow: 'auto',
                                }}
                            >
                                <FinancialAccounts 
                                    accounts={data.accounts}
                                    loading={data.loading}
                                    error={data.error}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section (40%) - Transactions */}
                <div className="col-5 p-2">
                    <div
                        className={`h-full border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                        style={{
                            maxHeight: 'calc(100vh - 100px)',
                            overflow: 'auto',
                        }}
                    >
                        <ExpenseTransactionsList 
                            transactions={data.expenseTransactions}
                            loading={data.loading}
                            error={data.error}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

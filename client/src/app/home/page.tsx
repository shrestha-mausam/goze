'use client';

import AppLayout from '@/components/AppLayout';
import CategoryManagement from '@/components/home/CategoryManagement';
import ChartOverview from '@/components/home/ChartOverview';
import FinancialAccounts from '@/components/home/FinancialAccounts';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import ExpenseTransactionsList from '@/components/home/ExpenseTransactionsList';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';

export default function Home() {
    const { themeType } = useTheme();
    const { allTransactions, expenseTransactions, accounts, loading, error } = useData();

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
                            transactions={allTransactions}
                            loading={loading}
                            error={error}
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
                                    transactions={expenseTransactions}
                                    loading={loading}
                                    error={error}
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
                                    accounts={accounts}
                                    loading={loading}
                                    error={error}
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
                            transactions={expenseTransactions}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

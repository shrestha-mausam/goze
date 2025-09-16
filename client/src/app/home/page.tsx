'use client';

import AppLayout from '@/components/AppLayout';
import CategoryManagement from '@/components/CategoryManagement';
import ChartOverview from '@/components/ChartOverview';
import FinancialAccounts from '@/components/FinancialAccounts';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Transactions from '@/components/Transactions';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
    const { themeType } = useTheme();

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
                        style={{ maxHeight: '400px', overflow: 'auto' }}
                    >
                        <ChartOverview themeType={themeType} />
                    </div>

                    {/* Bottom Section - Categories and Accounts */}
                    <div className="grid">
                        {/* Categories */}
                        <div className="col-6 pr-2">
                            <div
                                className={`h-full border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                                style={{
                                    maxHeight: 'calc(100vh - 500px)',
                                    overflow: 'auto',
                                }}
                            >
                                <CategoryManagement />
                            </div>
                        </div>

                        {/* Accounts */}
                        <div className="col-6 pl-2">
                            <div
                                className={`h-full border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                                style={{
                                    maxHeight: 'calc(100vh - 500px)',
                                    overflow: 'auto',
                                }}
                            >
                                <FinancialAccounts />
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
                        <Transactions />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

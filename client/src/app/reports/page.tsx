'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import AppLayout from '@/components/AppLayout';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Transaction, Account } from '@/lib/types';
import { getAllTransactions, getAllAccounts } from '@/lib/api.client';
import { Toast } from 'primereact/toast';

// Report components
import ReportTabs from '@/components/reports/ReportTabs';
import ReportControls from '@/components/reports/ReportControls';
import ReportChart from '@/components/reports/ReportChart';
import ReportSummary from '@/components/reports/ReportSummary';
import TransactionsTable from '@/components/reports/TransactionsTable';
import { ReportTab, DateRange, MonthRange, TabOption, DateRangeOption, MonthOption } from '@/components/reports/types';

interface ReportsData {
    transactions: Transaction[];
    accounts: Account[];
    loading: boolean;
    error: string | null;
}

export default function Reports() {
    const { themeType } = useTheme();
    const toast = useRef<Toast>(null);
    
    // State management
    const [activeTab, setActiveTab] = useState<ReportTab>('netIncome');
    const [dateRange, setDateRange] = useState<DateRange>('thisMonth');
    const [comparisonRange1, setComparisonRange1] = useState<MonthRange>('thisMonth');
    const [comparisonRange2, setComparisonRange2] = useState<MonthRange>('lastMonth');
    const [data, setData] = useState<ReportsData>({
        transactions: [],
        accounts: [],
        loading: true,
        error: null,
    });

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, loading: true, error: null }));

                const [transactionsResponse, accountsResponse] = await Promise.all([
                    getAllTransactions(),
                    getAllAccounts(),
                ]);

                if (!transactionsResponse.ok || !accountsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [transactionsData, accountsData] = await Promise.all([
                    transactionsResponse.json(),
                    accountsResponse.json(),
                ]);

                setData({
                    transactions: transactionsData.data?.transactions || [],
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

        fetchData();
    }, []);

    // Date range options
    const dateRangeOptions: DateRangeOption[] = [
        { label: 'This Week', value: 'thisWeek' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last 6 Months', value: 'last6Months' },
        { label: 'Last Year', value: 'lastYear' },
    ];

    // Month options for comparison (12 months back)
    const monthOptions: MonthOption[] = [
        { label: 'February 2024', value: 'thisMonth' },
        { label: 'January 2024', value: 'lastMonth' },
        { label: 'December 2023', value: 'twoMonthsAgo' },
        { label: 'November 2023', value: 'threeMonthsAgo' },
        { label: 'October 2023', value: 'fourMonthsAgo' },
        { label: 'September 2023', value: 'fiveMonthsAgo' },
        { label: 'August 2023', value: 'sixMonthsAgo' },
        { label: 'July 2023', value: 'sevenMonthsAgo' },
        { label: 'June 2023', value: 'eightMonthsAgo' },
        { label: 'May 2023', value: 'nineMonthsAgo' },
        { label: 'April 2023', value: 'tenMonthsAgo' },
        { label: 'March 2023', value: 'elevenMonthsAgo' },
        { label: 'February 2023', value: 'twelveMonthsAgo' },
    ];

    // Tab options
    const tabOptions: TabOption[] = [
        { label: 'Net Income', value: 'netIncome' },
        { label: 'Spending', value: 'spending' },
        { label: 'Income', value: 'income' },
        { label: 'Savings', value: 'savings' },
        { label: 'Comparison', value: 'comparison' },
    ];

    // Handler functions for component callbacks
    const handleTabChange = (tab: ReportTab) => {
        setActiveTab(tab);
    };

    const handleDateRangeChange = (range: DateRange) => {
        setDateRange(range);
    };

    const handleComparisonChange = (range1: MonthRange, range2: MonthRange) => {
        setComparisonRange1(range1);
        setComparisonRange2(range2);
    };

    return (
        <AppLayout title="Reports | Goze">
            <Toast ref={toast} />
            <Sidebar />
            <Topbar />

            <div className="h-full overflow-auto px-5">
                {/* Page Title */}
                <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white pt-2 reports-header">Reports</h1>

                {/* Tab Navigation */}
                <ReportTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    tabs={tabOptions}
                />
                        
                {/* Main Content Card */}
                <div className={`border-round p-6 ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-1 mb-3`}>
                    {/* Controls Row */}
                    <ReportControls
                        activeTab={activeTab}
                        dateRange={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                        comparisonRange1={comparisonRange1}
                        comparisonRange2={comparisonRange2}
                        onComparisonChange={handleComparisonChange}
                        monthOptions={monthOptions}
                        dateRangeOptions={dateRangeOptions}
                        themeType={themeType}
                    />

                    {/* Chart and Summary Row */}
                    <div className="grid">
                        {/* Chart Section */}
                        <ReportChart
                            activeTab={activeTab}
                            dateRange={dateRange}
                            comparisonRange1={comparisonRange1}
                            comparisonRange2={comparisonRange2}
                            themeType={themeType}
                        />

                        {/* Summary Card */}
                        <ReportSummary
                            activeTab={activeTab}
                            comparisonRange1={comparisonRange1}
                            comparisonRange2={comparisonRange2}
                            monthOptions={monthOptions}
                            themeType={themeType}
                        />
                    </div>
                </div>

                {/* Transaction Activities Card */}
                <TransactionsTable
                    transactions={data.transactions}
                    accounts={data.accounts}
                    themeType={themeType}
                    toast={toast}
                />
            </div>
        </AppLayout>
    );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import AppLayout from '@/components/AppLayout';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Transaction, Account } from '@/lib/types';
import { getAllTransactions, getAllAccounts } from '@/lib/api.client';
import { getPlaidCategoryIcon } from '@/lib/utils';

// PrimeReact components
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
// import { Checkbox } from 'primereact/checkbox'; // Removed unused import


type ReportTab = 'spending' | 'income' | 'netIncome' | 'savings' | 'comparison';
type DateRange = 'thisWeek' | 'thisMonth' | 'last6Months' | 'lastYear';
type MonthRange = 'thisMonth' | 'lastMonth' | 'twoMonthsAgo' | 'threeMonthsAgo' | 'fourMonthsAgo' | 'fiveMonthsAgo' | 'sixMonthsAgo' | 'sevenMonthsAgo' | 'eightMonthsAgo' | 'nineMonthsAgo' | 'tenMonthsAgo' | 'elevenMonthsAgo' | 'twelveMonthsAgo';

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
    
    // Transaction table state
    const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    
    // Filter state
    const [filterDateRange, setFilterDateRange] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterAmountRange, setFilterAmountRange] = useState<string>('all');

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
    const dateRangeOptions = [
        { label: 'This Week', value: 'thisWeek' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last 6 Months', value: 'last6Months' },
        { label: 'Last Year', value: 'lastYear' },
    ];

    // Month options for comparison (12 months back)
    const monthOptions = [
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

    // Filtered options for compare with dropdown (excludes currently selected period)
    const filteredMonthOptions = monthOptions.filter(option => option.value !== comparisonRange1);

    // Tab options
    const tabOptions = [
        { label: 'Net Income', value: 'netIncome' },
        { label: 'Spending', value: 'spending' },
        { label: 'Income', value: 'income' },
        { label: 'Savings', value: 'savings' },
        { label: 'Comparison', value: 'comparison' },
    ];

    // Generate labels based on date range
    const getLabelsForDateRange = (): string[] => {
        switch (dateRange) {
            case 'thisWeek':
                // Daily labels for this week
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'thisMonth':
                // Weekly labels for this month
                return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            case 'last6Months':
                // Monthly labels for last 6 months
                const months6 = [];
                const now = new Date();
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    months6.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
                }
                return months6;
            case 'lastYear':
                // Monthly labels for last year
                const months12 = [];
                const today = new Date();
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    months12.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
                }
                return months12;
            default:
                return [];
        }
    };

    // Generate sample data based on date range length
    const generateSampleData = (length: number, min: number, max: number): number[] => {
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));
    };

    // Generate chart data based on active tab
    const generateChartData = () => {
        const labels = getLabelsForDateRange();
        const dataLength = labels.length;
        
        switch (activeTab) {
            case 'netIncome': {
                const incomeData = generateSampleData(dataLength, 2000, 5000);
                const expenseData = generateSampleData(dataLength, 1000, 4000);
                const netIncomeData = incomeData.map((income, i) => income - expenseData[i]);

                return { 
                    labels,
                    datasets: [
                        {
                            type: 'bar' as const,
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(147, 51, 234, 0.6)', // Light Purple
                            borderColor: '#9333ea',
                            borderWidth: 0,
                            order: 2,
                        },
                        {
                            type: 'bar' as const,
                            label: 'Expenses',
                            data: expenseData,
                            backgroundColor: 'rgba(59, 130, 246, 0.6)', // Light Blue
                            borderColor: '#3b82f6',
                            borderWidth: 0,
                            order: 2,
                        },
                        {
                            type: 'line' as const,
                            label: 'Net Income',
                            data: netIncomeData,
                            borderColor: themeType === 'dark' ? '#f97316' : '#f97316', // Orange
                            backgroundColor: 'transparent',
                            borderWidth: themeType === 'dark' ? 2 : 3,
                            borderDash: [8, 8],
                            fill: false,
                            tension: 0.1,
                            pointBackgroundColor: themeType === 'dark' ? '#f97316' : '#f97316',
                            pointBorderColor: themeType === 'dark' ? '#374151' : '#ffffff',
                            pointBorderWidth: themeType === 'dark' ? 1 : 2,
                            pointRadius: themeType === 'dark' ? 3 : 4,
                            order: 1,
                        },
                    ],
                };
            }
            
            case 'spending': {
                const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare'];
                const spendingData = [1200, 800, 1500, 600, 400, 300];
                
                return { 
                    labels: categories,
                    datasets: [
                        {
                            label: 'Spending by Category',
                            data: spendingData,
                            backgroundColor: [
                                'rgba(239, 68, 68, 0.8)', // Red
                                'rgba(245, 158, 11, 0.8)', // Amber
                                'rgba(59, 130, 246, 0.8)', // Blue
                                'rgba(16, 185, 129, 0.8)', // Green
                                'rgba(147, 51, 234, 0.8)', // Purple
                                'rgba(236, 72, 153, 0.8)', // Pink
                            ],
                            borderWidth: 1,
                        },
                    ],
                };
            }
            
            case 'income': {
                const incomeData = generateSampleData(dataLength, 3500, 5500);
                    return { 
                    labels,
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: themeType === 'dark' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.8)', // Green
                            borderColor: '#10b981',
                            borderWidth: themeType === 'dark' ? 1 : 2,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: themeType === 'dark' ? '#10b981' : '#10b981',
                            pointBorderColor: themeType === 'dark' ? '#374151' : '#ffffff',
                            pointBorderWidth: themeType === 'dark' ? 1 : 2,
                            pointRadius: themeType === 'dark' ? 2 : 3,
                        },
                    ],
                };
            }
            
            case 'savings': {
                const savingsData = generateSampleData(dataLength, 500, 2000);
                const goalAmount = 1000;
                const goalData = Array(dataLength).fill(goalAmount);
                
                return {
                    labels,
                    datasets: [
                        {
                            label: 'Actual Savings',
                            data: savingsData,
                            backgroundColor: 'rgba(34, 197, 94, 0.8)', // Green
                            borderColor: '#22c55e',
                            borderWidth: themeType === 'dark' ? 1 : 2,
                            fill: false,
                            pointBackgroundColor: themeType === 'dark' ? '#22c55e' : '#22c55e',
                            pointBorderColor: themeType === 'dark' ? '#374151' : '#ffffff',
                            pointBorderWidth: themeType === 'dark' ? 1 : 2,
                            pointRadius: themeType === 'dark' ? 2 : 3,
                        },
                        {
                            label: 'Savings Goal',
                            data: goalData,
                            backgroundColor: 'rgba(156, 163, 175, 0.8)', // Gray
                            borderColor: '#9ca3af',
                            borderWidth: themeType === 'dark' ? 1 : 2,
                            borderDash: [5, 5],
                            fill: false,
                            pointBackgroundColor: themeType === 'dark' ? '#9ca3af' : '#9ca3af',
                            pointBorderColor: themeType === 'dark' ? '#374151' : '#ffffff',
                            pointBorderWidth: themeType === 'dark' ? 1 : 2,
                            pointRadius: themeType === 'dark' ? 2 : 3,
                        },
                    ],
                };
            }
            
            case 'comparison': {
                const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare'];
                
                // Generate month-specific comparison data
                const getMonthData = (monthRange: MonthRange) => {
                    switch (monthRange) {
                        case 'thisMonth':
                            return [1200, 800, 1500, 600, 400, 300];
                        case 'lastMonth':
                            return [1000, 750, 1300, 500, 450, 280];
                        case 'twoMonthsAgo':
                            return [1100, 850, 1400, 550, 420, 290];
                        case 'threeMonthsAgo':
                            return [1050, 900, 1350, 580, 400, 310];
                        case 'fourMonthsAgo':
                            return [1150, 820, 1450, 620, 380, 270];
                        case 'fiveMonthsAgo':
                            return [1080, 880, 1380, 590, 410, 295];
                        case 'sixMonthsAgo':
                            return [1120, 780, 1420, 610, 390, 285];
                        case 'sevenMonthsAgo':
                            return [980, 920, 1320, 570, 430, 320];
                        case 'eightMonthsAgo':
                            return [1040, 860, 1280, 540, 440, 260];
                        case 'nineMonthsAgo':
                            return [1180, 790, 1520, 640, 370, 310];
                        case 'tenMonthsAgo':
                            return [1060, 870, 1340, 590, 420, 300];
                        case 'elevenMonthsAgo':
                            return [1090, 830, 1360, 560, 400, 290];
                        case 'twelveMonthsAgo':
                            return [1020, 890, 1290, 520, 460, 275];
                        default:
                            return [1200, 800, 1500, 600, 400, 300];
                    }
                };
                
                const currentPeriodData = getMonthData(comparisonRange1);
                const comparePeriodData = getMonthData(comparisonRange2);
                
                return {
                    labels: categories,
                    datasets: [
                        {
                            label: `Period (${monthOptions.find(opt => opt.value === comparisonRange1)?.label})`,
                            data: currentPeriodData,
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: '#3b82f6',
                            borderWidth: themeType === 'dark' ? 1 : 1,
                        },
                        {
                            label: `Compare With (${monthOptions.find(opt => opt.value === comparisonRange2)?.label})`,
                            data: comparePeriodData,
                            backgroundColor: 'rgba(239, 68, 68, 0.8)',
                            borderColor: '#ef4444',
                            borderWidth: themeType === 'dark' ? 1 : 1,
                        },
                    ],
                };
            }
            
            default:
                return {
                    labels,
                    datasets: [
                        {
                            label: 'Sample Data',
                            data: [1200, 1900, 3000, 5000, 2000, 3000],
                            backgroundColor: themeType === 'dark' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(79, 70, 229, 0.8)',
                            borderColor: themeType === 'dark' ? '#6366F1' : '#4F46E5',
                            borderWidth: 1,
                        },
                    ],
                };
        }
    };

    // Get chart type based on active tab
    const getChartType = () => {
        switch (activeTab) {
            case 'netIncome':
                return 'bar';
            case 'spending':
                return 'doughnut';
            case 'comparison':
                return 'bar';
            default:
                return 'bar';
        }
    };

    // Chart options
    const getChartOptions = () => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false, // Hide default legend - we have custom overlay
                },
                tooltip: {
                    backgroundColor: themeType === 'dark' ? 'rgba(55, 65, 81, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                    titleColor: themeType === 'dark' ? '#f9fafb' : '#ffffff',
                    bodyColor: themeType === 'dark' ? '#f9fafb' : '#ffffff',
                    borderColor: themeType === 'dark' ? '#8066FF' : 'transparent',
                    borderWidth: themeType === 'dark' ? 1 : 0,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context: any) {
                            return `${context.dataset.label}: $${context.parsed.y?.toLocaleString() || context.parsed.toLocaleString()}`;
                        }
                    }
                },
            },
        };

        // For pie/doughnut charts, hide legend (we'll show it in the summary section)
        if (getChartType() === 'doughnut') {
            return {
                ...baseOptions,
                cutout: '60%', // Creates the doughnut hole
                plugins: {
                    ...baseOptions.plugins,
                    legend: {
                        display: false, // Hide legend - we'll show it in the summary section
                    },
                },
                elements: {
                    arc: {
                        borderWidth: 2,
                        borderColor: '#ffffff',
                    },
                },
            };
        }

        // For bar charts, include scales
        return {
            ...baseOptions,
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: themeType === 'dark' ? '#9ca3af' : '#6B7280',
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    beginAtZero: false,
                    min: -2000,
                    max: 5000,
                    grid: {
                        color: themeType === 'dark' ? '#374151' : '#F3F4F6',
                        drawBorder: false,
                    },
                    ticks: {
                        color: themeType === 'dark' ? '#9ca3af' : '#6B7280',
                        font: {
                            size: 12,
                        },
                        callback: function(value: number) {
                            if (value < 0) {
                                return '-$' + Math.abs(value).toLocaleString();
                            }
                            return '$' + value.toLocaleString();
                        }
                    },
                },
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                },
            },
            elements: {
                bar: {
                    borderRadius: 2,
                },
            },
        };
    };

    // Get current totals for legend
    const getCurrentTotals = () => {
        if (activeTab === 'netIncome') {
            return {
                income: 635.00,
                expenses: 53.40,
                netIncome: 43.04,
            };
        }
        return { income: 0, expenses: 0, netIncome: 0 };
    };

    const totals = getCurrentTotals();

    // Table columns

    const accountBodyTemplate = (rowData: Transaction) => {
        const account = data.accounts.find(acc => acc.accountId === rowData.accountId);
        return account?.name || 'Unknown Account';
    };

    const dateBodyTemplate = (rowData: Transaction) => {
        return new Date(rowData.date).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: '2-digit' 
        });
    };

    const amountBodyTemplate = (rowData: Transaction) => {
        const amount = Math.abs(rowData.amount);
        return (
            <span className="font-semibold" style={{ color: '#9ca3af' }}>
                ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
        );
    };

    // Filter options
    const filterDateOptions = [
        { label: 'All Time', value: 'all' },
        { label: 'Last 7 Days', value: 'week' },
        { label: 'Last 30 Days', value: 'month' },
        { label: 'Last 3 Months', value: 'quarter' },
        { label: 'Last Year', value: 'year' },
    ];

    const filterCategoryOptions = [
        { label: 'All Categories', value: 'all' },
        { label: 'Food & Dining', value: 'Food and Drink' },
        { label: 'Transportation', value: 'Transportation' },
        { label: 'Shopping', value: 'Shops' },
        { label: 'Entertainment', value: 'Recreation' },
        { label: 'Utilities', value: 'Service' },
        { label: 'Healthcare', value: 'Healthcare Services' },
    ];

    const filterAmountOptions = [
        { label: 'All Amounts', value: 'all' },
        { label: 'Under $10', value: 'under10' },
        { label: '$10 - $50', value: '10to50' },
        { label: '$50 - $100', value: '50to100' },
        { label: '$100 - $500', value: '100to500' },
        { label: 'Over $500', value: 'over500' },
    ];

    // Filter transactions for table
    const filteredTransactions = data.transactions.filter(transaction => {
        const matchesGlobalFilter = !globalFilter || 
            transaction.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
            (transaction.plaidCategory && transaction.plaidCategory.toLowerCase().includes(globalFilter.toLowerCase()));
        
        // Date filter
        const matchesDateFilter = (() => {
            if (filterDateRange === 'all') return true;
            
            const now = new Date();
            const transactionDate = new Date(transaction.date);
            const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
            
            switch (filterDateRange) {
                case 'week': return daysDiff <= 7;
                case 'month': return daysDiff <= 30;
                case 'quarter': return daysDiff <= 90;
                case 'year': return daysDiff <= 365;
                default: return true;
            }
        })();
        
        // Category filter
        const matchesCategoryFilter = filterCategory === 'all' || 
            transaction.plaidCategory === filterCategory;
        
        // Amount filter
        const matchesAmountFilter = (() => {
            if (filterAmountRange === 'all') return true;
            
            const amount = Math.abs(transaction.amount);
            switch (filterAmountRange) {
                case 'under10': return amount < 10;
                case '10to50': return amount >= 10 && amount < 50;
                case '50to100': return amount >= 50 && amount < 100;
                case '100to500': return amount >= 100 && amount < 500;
                case 'over500': return amount >= 500;
                default: return true;
            }
        })();
        
        return matchesGlobalFilter && matchesDateFilter && matchesCategoryFilter && matchesAmountFilter;
    });

    return (
        <AppLayout title="Reports | Goze">
            <Toast ref={toast} />
            <Sidebar />
            <Topbar />

            <div className="h-full overflow-auto px-5">
                {/* Page Title */}
                <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white pt-2 reports-header">Reports</h1>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                    {tabOptions.map((tab) => (
                        <Button
                            key={tab.value}
                            label={tab.label}
                            className={classNames('p-button-text p-button-sm', {
                                'p-button-plain': activeTab !== tab.value,
                            })}
                            onClick={() => setActiveTab(tab.value as ReportTab)}
                        />
                            ))}
                        </div>
                        
                {/* Main Content Card */}
                <div className={`border-round p-6 ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-1 mb-3`}>
                    {/* Controls Row */}
                    <div className="flex justify-content-between align-items-center mb-6">
                        <div className="flex align-items-center gap-4">
                            {activeTab === 'comparison' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Period</label>
                                        <Dropdown
                                            value={comparisonRange1}
                                            options={monthOptions}
                                            onChange={(e) => setComparisonRange1(e.value)}
                                            placeholder="Select Period"
                                            className="w-40"
                                            panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Compare With</label>
                                        <Dropdown
                                            value={comparisonRange2}
                                            options={filteredMonthOptions}
                                            onChange={(e) => setComparisonRange2(e.value)}
                                            placeholder="Select Period"
                                            className="w-40"
                                            panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Date Range</label>
                                        <Dropdown
                                            value={dateRange}
                                            options={dateRangeOptions}
                                            onChange={(e) => setDateRange(e.value)}
                                            placeholder="Select Range"
                                            className="w-40"
                                            panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Chart and Summary Row */}
                    <div className="grid">
                        {/* Chart Section */}
                        <div className="col-8 pr-4">
                            <div className="relative" style={{ height: '400px' }}>
                                <Chart
                                    key={`${activeTab}-${dateRange}`}
                                    type={getChartType()}
                                    data={generateChartData()}
                                    options={getChartOptions()}
                                    style={{ width: '100%', height: '100%' }}
                                />
                                
                        </div>
                        </div>

                        {/* Summary Card */}
                        <div className="col-4 pl-4">
                            <div className={`border-round p-4 ${themeType === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} shadow-1 h-full summary-card`}>
                                <div className="flex justify-content-between align-items-center mb-3">
                                    <h3 className="text-lg font-semibold m-0 text-gray-900 dark:text-white">
                                        {activeTab === 'netIncome' && 'Net Income'}
                                        {activeTab === 'spending' && 'Total spending'}
                                        {activeTab === 'income' && 'Total income'}
                                        {activeTab === 'savings' && 'Total savings'}
                                        {activeTab === 'comparison' && 'Expense Comparison'}
                                    </h3>
                                </div>
                                <div className={`text-3xl font-bold mb-3 ${
                                    activeTab === 'netIncome' ? 'text-green-600' :
                                    activeTab === 'income' ? 'text-green-600' :
                                    activeTab === 'savings' ? 'text-blue-600' :
                                    activeTab === 'comparison' ? 'text-purple-600' :
                                    'text-red-600'
                                }`}>
                                    {activeTab === 'netIncome' && '+$709.89'}
                                    {activeTab === 'spending' && '$4,800'}
                                    {activeTab === 'income' && '$27,100'}
                                    {activeTab === 'savings' && '$6,800'}
                                    {activeTab === 'comparison' && '+$1,200'}
                    </div>
                                <div className="flex align-items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mb-4 date-text">
                                    <i className="pi pi-calendar"></i>
                                    <span>Feb 01, 2024 - Feb 05, 2024</span>
                                </div>
                                <div className="border-top pt-3 legend-section">
                                    <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Legend</h4>
                                    <div className="flex flex-column gap-2">
                                        {activeTab === 'netIncome' && (
                                            <>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#9333ea', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">Income</span>
                                                </div>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#3b82f6', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">Expenses</span>
                                                </div>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#f97316', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">Net Income</span>
                                                </div>
                                            </>
                                        )}
                                        {activeTab === 'spending' && (() => {
                                            const spendingData = [1200, 800, 1500, 600, 400, 300];
                                            const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare'];
                                            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#9333ea', '#ec4899'];
                                            const total = spendingData.reduce((a, b) => a + b, 0);
                                            
                                            return categories.map((category, i) => {
                                                const value = spendingData[i];
                                                const percentage = ((value / total) * 100).toFixed(1);
                                                return (
                                                    <div key={i} className="flex align-items-center gap-2">
                                                        <i className="pi pi-circle-fill" style={{ color: colors[i], fontSize: '12px' }}></i>
                                                        <span className="text-sm text-gray-700 dark:text-white">{category}</span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">${value.toLocaleString()} ({percentage}%)</span>
                                                    </div>
                                                );
                                            });
                                        })()}
                                        {activeTab === 'income' && (
                                            <div className="flex align-items-center gap-2">
                                                <i className="pi pi-circle-fill" style={{ color: '#10b981', fontSize: '12px' }}></i>
                                                <span className="text-sm text-gray-700 dark:text-white">Monthly Income</span>
                                            </div>
                                        )}
                                        {activeTab === 'savings' && (
                                            <>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#22c55e', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">Actual Savings</span>
                                                </div>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#9ca3af', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">Savings Goal</span>
                                                </div>
                                            </>
                                        )}
                                        {activeTab === 'comparison' && (
                                            <>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#3b82f6', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">
                                                        {monthOptions.find(opt => opt.value === comparisonRange1)?.label}
                                                    </span>
                                                </div>
                                                <div className="flex align-items-center gap-2">
                                                    <i className="pi pi-circle-fill" style={{ color: '#ef4444', fontSize: '12px' }}></i>
                                                    <span className="text-sm text-gray-700 dark:text-white">
                                                        {monthOptions.find(opt => opt.value === comparisonRange2)?.label}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Transaction Activities Card */}
                    <div className={`border-round p-6 ${themeType === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-1`}>
                        <div className="flex justify-content-between align-items-center mb-4">
                            <h3 className="text-lg font-semibold m-0" style={{ color: themeType === 'dark' ? '#ffffff' : '#111827' }}>Transactions</h3>
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-filter"
                                    className="p-button-sm p-button-outlined"
                                    onClick={() => {
                                        toast.current?.show({ severity: 'info', summary: 'Filter', detail: 'Filter feature coming soon!' });
                                    }}
                                />
                                <Button
                                    label="Add"
                                    icon="pi pi-plus"
                                    className="p-button-sm"
                                    onClick={() => {
                                        // TODO: Implement add transaction functionality
                                        toast.current?.show({ severity: 'info', summary: 'Add Transaction', detail: 'Feature coming soon!' });
                                    }}
                                />
                            </div>
                        </div>

                    {/* Search and Filters Row */}
                    <div className="grid mb-4">
                        <div className="col-12 md:col-6">
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-search" />
                                <InputText
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search transactions..."
                                    className={`w-full ${themeType === 'dark' ? 'dark-input' : ''}`}
                                />
                            </IconField>
                        </div>
                        <div className="col-12 md:col-2">
                            <Dropdown
                                value={filterDateRange}
                                options={filterDateOptions}
                                onChange={(e) => setFilterDateRange(e.value)}
                                placeholder="Date Range"
                                className={`w-full ${themeType === 'dark' ? 'dark-dropdown' : ''}`}
                                panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                            />
                        </div>
                        <div className="col-12 md:col-2">
                            <Dropdown
                                value={filterCategory}
                                options={filterCategoryOptions}
                                onChange={(e) => setFilterCategory(e.value)}
                                placeholder="Category"
                                className={`w-full ${themeType === 'dark' ? 'dark-dropdown' : ''}`}
                                panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                            />
                        </div>
                        <div className="col-12 md:col-2">
                            <Dropdown
                                value={filterAmountRange}
                                options={filterAmountOptions}
                                onChange={(e) => setFilterAmountRange(e.value)}
                                placeholder="Amount"
                                className={`w-full ${themeType === 'dark' ? 'dark-dropdown' : ''}`}
                                panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                            />
                        </div>
                    </div>
                    
                    {/* Clear Filters Button */}
                    {(filterDateRange !== 'all' || filterCategory !== 'all' || filterAmountRange !== 'all') && (
                        <div className="mb-3">
                            <Button
                                label="Clear Filters"
                                icon="pi pi-filter-slash"
                                className="p-button-text p-button-sm"
                                onClick={() => {
                                    setFilterDateRange('all');
                                    setFilterCategory('all');
                                    setFilterAmountRange('all');
                                }}
                            />
                        </div>
                    )}

                        {data.loading ? (
                            <div className="flex justify-content-center align-items-center p-4">
                                <i className="pi pi-spin pi-spinner text-2xl mr-2"></i>
                                <span>Loading transactions...</span>
                            </div>
                        ) : (
                            <DataTable
                                    value={filteredTransactions}
                                    selection={selectedTransactions}
                                    onSelectionChange={(e) => setSelectedTransactions(e.value as Transaction[])}
                                    selectionMode="multiple"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                emptyMessage="No transactions found"
                                    className={`p-datatable-sm ${themeType === 'dark' ? 'dark-datatable' : ''}`}
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: '3rem' }}
                                />
                                <Column
                                        field="accountId"
                                        header="Account"
                                        body={accountBodyTemplate}
                                    sortable
                                    bodyStyle={{ color: '#9ca3af' }}
                                />
                                <Column
                                    field="date"
                                    header="Date"
                                        body={dateBodyTemplate}
                                        sortable
                                    bodyStyle={{ color: '#9ca3af' }}
                                    />
                                    <Column
                                        field="pending"
                                        header="Status"
                                        body={(rowData: Transaction) => <span style={{ color: '#9ca3af' }}>{rowData.pending ? 'Pending' : '-'}</span>}
                                        sortable
                                    />
                                    <Column
                                        field="name"
                                        header="Payee"
                                        sortable
                                    bodyStyle={{ color: '#9ca3af' }}
                                    />
                                    <Column
                                        field="plaidCategory"
                                        header="Category"
                                        body={(rowData: Transaction) => (
                                            <div className="flex align-items-center" style={{ color: '#9ca3af' }}>
                                                <i className={`pi ${getPlaidCategoryIcon(rowData.plaidCategory || 'Other')} mr-2 text-primary`}></i>
                                                {rowData.plaidCategory || 'Other'}
                                            </div>
                                        )}
                                    sortable
                                    />
                                <Column
                                        field="amount"
                                    header="Amount"
                                    body={amountBodyTemplate}
                                    sortable
                                    sortField="amount"
                                        headerStyle={{ textAlign: 'right' }}
                                        bodyStyle={{ textAlign: 'right', color: '#9ca3af' }}
                                />
                                <Column
                                        header=""
                                        body={() => (
                                            <Button
                                                icon="pi pi-cog"
                                                className="p-button-text p-button-sm"
                                                tooltip="Settings"
                                            />
                                        )}
                                        headerStyle={{ width: '3rem' }}
                                        bodyStyle={{ textAlign: 'center' }}
                                />
                            </DataTable>
                        )}
                </div>
            </div>
        </AppLayout>
    );
}
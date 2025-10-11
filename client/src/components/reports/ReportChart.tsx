'use client';

import { Chart } from 'primereact/chart';
import { ReportChartProps } from './types';

const ReportChart: React.FC<ReportChartProps> = ({
    activeTab,
    dateRange,
    comparisonRange1,
    comparisonRange2,
    themeType
}) => {
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
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(147, 51, 234, 0.6)', // Light Purple
                            borderColor: '#9333ea',
                            borderWidth: 0,
                            order: 2,
                        },
                        {
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
                const getMonthData = (monthRange: any) => {
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
                            return [1030, 810, 1290, 520, 430, 275];
                        default:
                            return [1000, 800, 1300, 500, 400, 300];
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
                return { labels: [], datasets: [] };
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
                },
            },
        };
    };

    // Month options for comparison
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

    return (
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
    );
};

export default ReportChart;

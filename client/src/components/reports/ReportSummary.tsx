'use client';

import { ReportSummaryProps } from './types';

const ReportSummary: React.FC<ReportSummaryProps> = ({
    activeTab,
    comparisonRange1,
    comparisonRange2,
    monthOptions,
    themeType
}) => {
    const getTitle = () => {
        switch (activeTab) {
            case 'netIncome': return 'Net Income';
            case 'spending': return 'Total spending';
            case 'income': return 'Total income';
            case 'savings': return 'Total savings';
            case 'comparison': return 'Expense Comparison';
            default: return '';
        }
    };

    const getAmount = () => {
        switch (activeTab) {
            case 'netIncome': return '+$709.89';
            case 'spending': return '$4,800';
            case 'income': return '$27,100';
            case 'savings': return '$6,800';
            case 'comparison': return '+$1,200';
            default: return '';
        }
    };

    const getAmountColor = () => {
        switch (activeTab) {
            case 'netIncome': return 'text-green-600';
            case 'income': return 'text-green-600';
            case 'savings': return 'text-blue-600';
            case 'comparison': return 'text-purple-600';
            default: return 'text-red-600';
        }
    };

    const renderLegend = () => {
        switch (activeTab) {
            case 'netIncome':
                return (
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
                );

            case 'spending':
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

            case 'income':
                return (
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-circle-fill" style={{ color: '#10b981', fontSize: '12px' }}></i>
                        <span className="text-sm text-gray-700 dark:text-white">Monthly Income</span>
                    </div>
                );

            case 'savings':
                return (
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
                );

            case 'comparison':
                return (
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
                );

            default:
                return null;
        }
    };

    return (
        <div className="col-4 pl-4">
            <div className={`border-round p-4 ${themeType === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} shadow-1 h-full summary-card`}>
                <div className="flex justify-content-between align-items-center mb-3">
                    <h3 className="text-lg font-semibold m-0 text-gray-900 dark:text-white">
                        {getTitle()}
                    </h3>
                </div>
                <div className={`text-3xl font-bold mb-3 ${getAmountColor()}`}>
                    {getAmount()}
                </div>
                <div className="flex align-items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mb-4 date-text">
                    <i className="pi pi-calendar"></i>
                    <span>Feb 01, 2024 - Feb 05, 2024</span>
                </div>
                <div className="border-top pt-3 legend-section">
                    <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Legend</h4>
                    <div className="flex flex-column gap-2">
                        {renderLegend()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportSummary;

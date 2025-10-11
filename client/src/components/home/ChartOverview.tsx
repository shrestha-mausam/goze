'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { classNames } from 'primereact/utils';
import { Transaction } from '@/lib/types';

// Generate chart data from real transactions
const generateChartData = (transactions: Transaction[], timeframe: string) => {
    let labels: string[] = [];
    let expenseData: number[] = [];
    let incomeData: number[] = [];

    if (timeframe === 'weekly') {
        // Generate weekly data for the last 7 days
        const weeklyExpenses: { [key: string]: number } = {};
        const weeklyIncome: { [key: string]: number } = {};

        transactions.forEach(transaction => {
            const amount = transaction.amount;
            const date = new Date(transaction.date);
            const dayKey = date.toISOString().split('T')[0];
            
            if (amount < 0) {
                weeklyExpenses[dayKey] = (weeklyExpenses[dayKey] || 0) + Math.abs(amount);
            } else {
                weeklyIncome[dayKey] = (weeklyIncome[dayKey] || 0) + amount;
            }
        });

        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayKey = date.toISOString().split('T')[0];
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            labels.push(dayLabel);
            expenseData.push(weeklyExpenses[dayKey] || 0);
            incomeData.push(weeklyIncome[dayKey] || 0);
        }
    } else {
        // Generate monthly data for the last 12 months
        const monthlyExpenses: { [key: string]: number } = {};
        const monthlyIncome: { [key: string]: number } = {};

        transactions.forEach(transaction => {
            const amount = transaction.amount;
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (amount < 0) {
                monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + Math.abs(amount);
            } else {
                monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + amount;
            }
        });

        // Generate last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
            
            labels.push(monthLabel);
            expenseData.push(monthlyExpenses[monthKey] || 0);
            incomeData.push(monthlyIncome[monthKey] || 0);
        }
    }

    // Calculate totals for the selected timeframe only
    const totalIncome = incomeData.reduce((sum, amount) => sum + amount, 0);
    const totalExpenses = expenseData.reduce((sum, amount) => sum + amount, 0);

    // Line chart data
    const lineChartData = {
        labels: labels,
        datasets: [
            {
                label: 'Expenses',
                data: expenseData,
                fill: false,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#4F46E5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
            {
                label: 'Income',
                data: incomeData,
                fill: false,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    // Bar chart data
    const barChartData = {
        labels: labels,
        datasets: [
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: '#4F46E5',
                borderWidth: 1,
            },
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10B981',
                borderWidth: 1,
            },
        ],
    };

    // Pie chart data for income vs expenses
    const pieChartData = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                data: [totalIncome, totalExpenses],
                backgroundColor: [
                    '#10B981', // Green for Income
                    '#EF4444', // Red for Expenses
                ],
            },
        ],
    };

    return { lineChartData, barChartData, pieChartData, totalIncome, totalExpenses };
};

interface ChartOverviewProps {
    themeType: string;
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
}

const ChartOverview: React.FC<ChartOverviewProps> = ({ themeType, transactions, loading, error }) => {
    const [chartType, setChartType] = useState('line');
    const [timeframe, setTimeframe] = useState('weekly');

    const chartData = generateChartData(transactions, timeframe);

    // Format currency
    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: themeType === 'dark' ? '#1f2937' : '#ffffff',
                titleColor: themeType === 'dark' ? '#ffffff' : '#495057',
                bodyColor: themeType === 'dark' ? '#ffffff' : '#495057',
                borderColor: themeType === 'dark' ? '#374151' : '#e5e7eb',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: themeType === 'dark' ? '#ffffff' : '#495057',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: themeType === 'dark' ? '#ffffff' : '#495057',
                },
            },
        },
        layout: {
            padding: 0,
        },
    };

    // Pie chart options
    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: themeType === 'dark' ? '#ffffff' : '#495057',
                    usePointStyle: true,
                    padding: 20,
                },
            },
        },
    };

    return (
        <div
            className={`h-full p-3 ${themeType === 'dark' ? 'text-white' : ''}`}
        >
            <div className="flex justify-content-between align-items-start mb-3">
                <div>
                    <h2 className="text-xl font-bold m-0">
                        {timeframe === 'weekly'
                            ? 'Weekly Overview'
                            : 'Monthly Overview'}
                    </h2>
                    <div className="flex mt-2">
                        <div className="mr-4 flex align-items-center">
                            <span
                                className="w-1rem h-1rem border-circle mr-2"
                                style={{ backgroundColor: '#10B981' }}
                            ></span>
                            <span className="text-500 text-sm">Income: </span>
                            <span className="font-medium text-green-500 ml-1">
                                {formatCurrency(chartData.totalIncome)}
                            </span>
                        </div>
                        <div className="flex align-items-center">
                            <span
                                className="w-1rem h-1rem border-circle mr-2"
                                style={{ backgroundColor: '#4F46E5' }}
                            ></span>
                            <span className="text-500 text-sm">Expenses: </span>
                            <span className="font-medium text-red-500 ml-1">
                                {formatCurrency(chartData.totalExpenses)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-1">
                    <Button
                        label="Weekly"
                        className={classNames('p-button-text p-button-sm', {
                            'p-button-plain': timeframe !== 'weekly',
                        })}
                        onClick={() => setTimeframe('weekly')}
                    />
                    <Button
                        label="Monthly"
                        className={classNames('p-button-text p-button-sm', {
                            'p-button-plain': timeframe !== 'monthly',
                        })}
                        onClick={() => setTimeframe('monthly')}
                    />
                    <Button
                        icon="pi pi-chart-line"
                        className={classNames('p-button-text p-button-sm', {
                            'p-button-plain': chartType !== 'line',
                        })}
                        onClick={() => setChartType('line')}
                        tooltip="Line Chart"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                    <Button
                        icon="pi pi-chart-bar"
                        className={classNames('p-button-text p-button-sm', {
                            'p-button-plain': chartType !== 'bar',
                        })}
                        onClick={() => setChartType('bar')}
                        tooltip="Bar Chart"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                    <Button
                        icon="pi pi-chart-pie"
                        className={classNames('p-button-text p-button-sm', {
                            'p-button-plain': chartType !== 'pie',
                        })}
                        onClick={() => setChartType('pie')}
                        tooltip="Pie Chart"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                </div>
            </div>

            {loading && (
                <div className="flex justify-content-center align-items-center" style={{ height: '250px' }}>
                    <i className="pi pi-spin pi-spinner text-2xl"></i>
                    <span className="ml-2">Loading chart data...</span>
                </div>
            )}

            {error && (
                <div className="p-3 mb-2 bg-red-100 border border-red-300 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <div style={{ height: '250px', width: '100%' }}>
                    {chartType === 'line' ? (
                        <Chart
                            type="line"
                            data={chartData.lineChartData}
                            options={chartOptions}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : chartType === 'bar' ? (
                        <Chart
                            type="bar"
                            data={chartData.barChartData}
                            options={chartOptions}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        <Chart
                            type="pie"
                            data={chartData.pieChartData}
                            options={pieChartOptions}
                            style={{ width: '100%', height: '100%' }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChartOverview;

'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { classNames } from 'primereact/utils';

// Sample data for charts
const generateSampleData = () => {
    // Weekly data
    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Expenses',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#4F46E5',
                tension: 0.4,
            },
            {
                label: 'Income',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: '#10B981',
                tension: 0.4,
            },
        ],
    };

    // Monthly data
    const monthlyData = {
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        datasets: [
            {
                label: 'Expenses',
                data: [65, 59, 80, 81, 56, 55, 40, 55, 60, 70, 65, 75],
                fill: false,
                borderColor: '#4F46E5',
                tension: 0.4,
            },
            {
                label: 'Income',
                data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56],
                fill: false,
                borderColor: '#10B981',
                tension: 0.4,
            },
        ],
    };

    // Pie chart data
    const pieData = {
        labels: [
            'Housing',
            'Food',
            'Transportation',
            'Entertainment',
            'Utilities',
            'Other',
        ],
        datasets: [
            {
                data: [30, 20, 15, 10, 15, 10],
                backgroundColor: [
                    '#4F46E5',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#EC4899',
                ],
            },
        ],
    };

    return { weeklyData, monthlyData, pieData };
};

interface ChartOverviewProps {
    themeType: string;
}

const ChartOverview: React.FC<ChartOverviewProps> = ({ themeType }) => {
    const [chartData] = useState(generateSampleData());
    const [chartType, setChartType] = useState('line');
    const [timeframe, setTimeframe] = useState('weekly');

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
                mode: 'index',
                intersect: false,
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
                position: 'bottom',
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
                                {formatCurrency(
                                    timeframe === 'weekly' ? 3500 : 12500
                                )}
                            </span>
                        </div>
                        <div className="flex align-items-center">
                            <span
                                className="w-1rem h-1rem border-circle mr-2"
                                style={{ backgroundColor: '#4F46E5' }}
                            ></span>
                            <span className="text-500 text-sm">Expenses: </span>
                            <span className="font-medium text-red-500 ml-1">
                                {formatCurrency(
                                    timeframe === 'weekly' ? 1800 : 7200
                                )}
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

            <div style={{ height: '300px', width: '100%' }}>
                {chartType === 'line' ? (
                    <Chart
                        type="line"
                        data={
                            timeframe === 'weekly'
                                ? chartData.weeklyData
                                : chartData.monthlyData
                        }
                        options={chartOptions}
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <Chart
                        type="pie"
                        data={chartData.pieData}
                        options={pieChartOptions}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </div>
        </div>
    );
};

export default ChartOverview;

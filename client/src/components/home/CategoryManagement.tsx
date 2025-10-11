'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Transaction } from '@/lib/types';
import { getPlaidCategoryIcon } from '@/lib/utils';


interface CategoryManagementProps {
    transactions: Transaction[];
    loading?: boolean;
    error?: string | null;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ 
    transactions, 
    loading = false, 
    error = null 
}) => {
    const { themeType } = useTheme();

    // Calculate category percentages from expense transactions using Plaid categories directly
    const calculateCategoryPercentages = () => {
        if (!transactions || transactions.length === 0) {
            return {};
        }

        // Calculate total expenses (absolute values since amounts are negative for expenses)
        const totalExpenses = transactions.reduce((sum, transaction) => {
            return sum + Math.abs(transaction.amount);
        }, 0);

        if (totalExpenses === 0) {
            return {};
        }

        // Calculate expenses by Plaid category
        const categoryTotals: { [key: string]: number } = {};
        
        transactions.forEach(transaction => {
            const plaidCategory = transaction.plaidCategory || 'Other';
            const amount = Math.abs(transaction.amount);
            categoryTotals[plaidCategory] = (categoryTotals[plaidCategory] || 0) + amount;
        });

        // Calculate percentages
        const categoryPercentages: { [key: string]: number } = {};
        Object.entries(categoryTotals).forEach(([category, total]) => {
            categoryPercentages[category] = Math.round((total / totalExpenses) * 100);
        });

        return categoryPercentages;
    };

    const categoryPercentages = calculateCategoryPercentages();

    // Get unique categories from the calculated percentages, sorted by percentage (highest first)
    const sortedCategories = Object.keys(categoryPercentages)
        .sort((a, b) => categoryPercentages[b] - categoryPercentages[a]);

    // Helper function to get color classes for each category
    const getCategoryColor = (index: number) => {
        const colors = [
            'indigo-500',
            'green-500',
            'yellow-500',
            'red-500',
            'purple-500',
            'pink-500',
            'cyan-500',
            'blue-500',
            'orange-500',
            'teal-500',
        ];
        return colors[index % colors.length];
    };

    // Get header divider class based on theme
    const getHeaderDividerClass = () => {
        return themeType === 'dark'
            ? 'border-bottom-1 border-gray-700' // Slightly lighter border for dark mode
            : 'border-bottom-1 border-300'; // Light border for light mode
    };

    return (
        <div className="p-3 flex flex-column h-full">
            <div
                className={`flex justify-content-between align-items-center pb-2 mb-3 ${getHeaderDividerClass()}`}
            >
                <div className="flex align-items-center">
                    <i className="pi pi-tags text-primary mr-2"></i>
                    <h3 className="text-lg font-bold m-0">
                        Spending Categories
                    </h3>
                </div>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-sm p-button-text"
                    style={{ visibility: 'hidden' }}
                    disabled
                />
            </div>

            {error && (
                <div className="p-2 mb-2 bg-red-100 border border-red-300 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            <div className="category-list flex-grow-1 overflow-auto">
                {loading ? (
                    <div className="p-4 text-center">
                        <i className="pi pi-spin pi-spinner text-primary text-xl"></i>
                        <p className="mt-2 text-sm">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center">
                        <i className="pi pi-exclamation-triangle text-red-500 text-xl"></i>
                        <p className="mt-2 text-sm text-red-500">Error loading categories</p>
                    </div>
                ) : sortedCategories.length > 0 ? (
                    sortedCategories.map((category, index) => {
                        const percentage = categoryPercentages[category];
                        return (
                            <div
                                key={category}
                                className="p-2 flex justify-content-between align-items-center"
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <div className="flex align-items-center">
                                    <i
                                        className={`pi ${getPlaidCategoryIcon(category)} mr-2 text-${getCategoryColor(index)}`}
                                    ></i>
                                    <span className="font-medium">{category}</span>
                                </div>
                                <span
                                    className={`text-sm font-semibold ${
                                        themeType === 'dark' ? 'text-white' : 'text-900'
                                    }`}
                                >
                                    {percentage}%
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 text-center">
                        <i className="pi pi-info-circle text-blue-500 text-xl"></i>
                        <p className="mt-2 text-sm">No expense transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;

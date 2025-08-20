'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';

// Sample transactions data
const transactions = [
  { description: 'Grocery Store', amount: -85.45, category: 'Food', date: '2023-10-15' },
  { description: 'Salary Deposit', amount: 2500.00, category: 'Income', date: '2023-10-14' },
  { description: 'Electric Bill', amount: -125.30, category: 'Utilities', date: '2023-10-13' },
  { description: 'Restaurant', amount: -65.80, category: 'Food', date: '2023-10-12' },
  { description: 'Gas Station', amount: -45.20, category: 'Transportation', date: '2023-10-11' },
  { description: 'Online Shopping', amount: -120.99, category: 'Shopping', date: '2023-10-10' },
  { description: 'Rent Payment', amount: -1200.00, category: 'Housing', date: '2023-10-01' },
  { description: 'Freelance Work', amount: 350.00, category: 'Income', date: '2023-10-05' }
];

const Transactions: React.FC = () => {
  const { themeType } = useTheme();
  
  // Get header divider class based on theme
  const getHeaderDividerClass = () => {
    return themeType === 'dark' 
      ? 'border-bottom-1 border-gray-700' // Slightly lighter border for dark mode
      : 'border-bottom-1 border-300';     // Light border for light mode
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Housing':
        return 'pi-home';
      case 'Food':
        return 'pi-shopping-bag';
      case 'Transportation':
        return 'pi-car';
      case 'Entertainment':
        return 'pi-ticket';
      case 'Utilities':
        return 'pi-bolt';
      case 'Income':
        return 'pi-wallet';
      case 'Shopping':
        return 'pi-shopping-cart';
      default:
        return 'pi-tag';
    }
  };

  return (
    <div className="p-3 flex flex-column h-full">
      <div className={`flex justify-content-between align-items-center pb-2 mb-3 ${getHeaderDividerClass()}`}>
        <div className="flex align-items-center">
          <i className="pi pi-list text-primary mr-2"></i>
          <h2 className="text-xl font-bold m-0">Recent Transactions</h2>
        </div>
        <Button 
          icon="pi pi-plus" 
          label="New"
          className="p-button-sm" 
        />
      </div>
      
      <div className="transactions-list flex-grow-1 overflow-auto">
        {transactions.map((transaction, index) => (
          <div 
            key={index}
            className={`p-3 mb-2 border-round ${themeType === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
          >
            <div className="flex justify-content-between align-items-center">
              <div className="flex align-items-center">
                <i className={`pi ${getCategoryIcon(transaction.category)} p-2 border-circle mr-3 ${transaction.amount >= 0 ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}></i>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className={`text-sm ${themeType === 'dark' ? 'text-400' : 'text-500'}`}>{transaction.category} • {formatDate(transaction.date)}</div>
                </div>
              </div>
              <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-blue-500'}`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions; 
'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';

// Sample accounts data
const accounts = [
  { name: 'Checking Account', balance: 2450.65, type: 'bank' },
  { name: 'Savings Account', balance: 8750.42, type: 'bank' },
  { name: 'Credit Card', balance: -450.25, type: 'credit' },
  { name: 'Investment', balance: 15320.75, type: 'investment' }
];

const FinancialAccounts: React.FC = () => {
  const { themeType } = useTheme();
  
  // Helper function to get the appropriate icon for each account type
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return 'pi-building';
      case 'credit':
        return 'pi-credit-card';
      case 'investment':
        return 'pi-chart-line';
      default:
        return 'pi-wallet';
    }
  };

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

  return (
    <div className="p-0 flex flex-column h-full">
      <div className={`flex justify-content-between align-items-center pb-2 mb-2 ${getHeaderDividerClass()}`}>
        <div className="flex align-items-center">
          <i className="pi pi-wallet text-primary mr-2"></i>
          <h3 className="text-lg font-bold m-0">Accounts</h3>
        </div>
        <Button 
          icon="pi pi-plus" 
          className="p-button-rounded p-button-sm p-button-text" 
          tooltip="Add Account"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
      
      <div className="accounts-list flex-grow-1 overflow-auto">
        {accounts.map((account, index) => (
          <div 
            key={index}
            className="p-2 flex justify-content-between align-items-center"
            style={{ backgroundColor: 'transparent' }}
          >
            <div className="flex align-items-center">
              <i className={`pi ${getAccountIcon(account.type)} mr-2 ${account.balance >= 0 ? 'text-blue-500' : 'text-pink-500'}`}></i>
              <span className="font-medium">{account.name}</span>
            </div>
            <span className={`font-medium ${account.balance >= 0 ? 'text-blue-500' : 'text-pink-500'}`}>
              {formatCurrency(account.balance)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialAccounts; 
'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';

// Categories for display
const categories = [
  { name: 'Housing', code: 'housing' },
  { name: 'Food', code: 'food' },
  { name: 'Transportation', code: 'transportation' },
  { name: 'Entertainment', code: 'entertainment' },
  { name: 'Utilities', code: 'utilities' },
  { name: 'Income', code: 'income' },
  { name: 'Shopping', code: 'shopping' },
  { name: 'Other', code: 'other' }
];

const CategoryManagement: React.FC = () => {
  const { themeType } = useTheme();
  
  // Helper function to get the appropriate icon for each category
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
      case 'Other':
        return 'pi-tag';
      default:
        return 'pi-circle';
    }
  };

  // Helper function to get color classes for each category
  const getCategoryColor = (index: number) => {
    const colors = ['indigo-500', 'green-500', 'yellow-500', 'red-500', 'purple-500', 'pink-500', 'cyan-500', 'green-600'];
    return colors[index % colors.length];
  };

  // Get header divider class based on theme
  const getHeaderDividerClass = () => {
    return themeType === 'dark' 
      ? 'border-bottom-1 border-gray-700' // Slightly lighter border for dark mode
      : 'border-bottom-1 border-300';     // Light border for light mode
  };

  return (
    <div className="p-0 flex flex-column h-full">
      <div className={`flex justify-content-between align-items-center pb-2 mb-2 ${getHeaderDividerClass()}`}>
        <div className="flex align-items-center">
          <i className="pi pi-tags text-primary mr-2"></i>
          <h3 className="text-lg font-bold m-0">Spending Categories</h3>
        </div>
        <Button 
          icon="pi pi-plus" 
          className="p-button-rounded p-button-sm p-button-text" 
          tooltip="Add Category"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
      
      <div className="category-list flex-grow-1 overflow-auto">
        {categories.map((category, index) => (
          <div 
            key={index}
            className="p-2 flex justify-content-between align-items-center"
            style={{ backgroundColor: 'transparent' }}
          >
            <div className="flex align-items-center">
              <i className={`pi ${getCategoryIcon(category.name)} mr-2 text-${getCategoryColor(index)}`}></i>
              <span className="font-medium">{category.name}</span>
            </div>
            <span className={`text-sm ${themeType === 'dark' ? 'text-400' : 'text-500'}`}>
              {Math.floor(Math.random() * 30) + 5}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement; 
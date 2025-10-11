'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { getPlaidCategoryIcon } from '@/lib/utils';
import { TransactionsTableProps } from './types';

const TransactionsTable: React.FC<TransactionsTableProps> = ({
    transactions,
    accounts,
    themeType,
    toast
}) => {
    // Transaction table state
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    
    // Filter state
    const [filterDateRange, setFilterDateRange] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterAmountRange, setFilterAmountRange] = useState<string>('all');

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

    // Amount body template
    const amountBodyTemplate = (rowData: any) => {
        const amount = Math.abs(rowData.amount);
        const isNegative = rowData.amount < 0;
        const sign = isNegative ? '-' : '+';
        const color = isNegative ? 'text-red-600' : 'text-green-600';
        
        return (
            <span className={`font-semibold ${color}`} style={{ color: '#9ca3af' }}>
                {sign}${amount.toLocaleString()}
            </span>
        );
    };

    // Filter transactions for table
    const filteredTransactions = transactions.filter(transaction => {
        const matchesGlobalFilter = !globalFilter || 
            transaction.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
            transaction.plaidCategory?.[0]?.toLowerCase().includes(globalFilter.toLowerCase()) ||
            transaction.accountId?.toLowerCase().includes(globalFilter.toLowerCase());

        const matchesDateFilter = (() => {
            if (filterDateRange === 'all') return true;
            const transactionDate = new Date(transaction.date);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            switch (filterDateRange) {
                case 'week': return diffDays <= 7;
                case 'month': return diffDays <= 30;
                case 'quarter': return diffDays <= 90;
                case 'year': return diffDays <= 365;
                default: return true;
            }
        })();

        const matchesCategoryFilter = filterCategory === 'all' || 
            transaction.plaidCategory?.[0] === filterCategory;

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

            <DataTable
                value={filteredTransactions}
                selection={selectedTransactions}
                onSelectionChange={(e) => setSelectedTransactions(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className={`datatable-responsive ${themeType === 'dark' ? 'dark-datatable' : ''}`}
                globalFilter={globalFilter}
                emptyMessage="No transactions found."
                header={
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <span className="text-xl text-900 font-medium">Transactions</span>
                    </div>
                }
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                />
                <Column
                    header="Account"
                    body={(rowData: any) => (
                        <span style={{ color: '#9ca3af' }}>
                            {accounts.find(acc => acc.id === rowData.accountId)?.name || rowData.accountId}
                        </span>
                    )}
                />
                <Column
                    header="Date"
                    body={(rowData: any) => (
                        <span style={{ color: '#9ca3af' }}>
                            {new Date(rowData.date).toLocaleDateString()}
                        </span>
                    )}
                />
                <Column
                    header="Name"
                    body={(rowData: any) => (
                        <span style={{ color: '#9ca3af' }}>
                            {rowData.name}
                        </span>
                    )}
                />
                <Column
                    header="Amount"
                    body={amountBodyTemplate}
                />
                <Column
                    header="Pending"
                    body={(rowData: any) => (
                        <span style={{ color: '#9ca3af' }}>
                            {rowData.pending ? 'Pending' : '-'}
                        </span>
                    )}
                />
                <Column
                    header="Category"
                    body={(rowData: any) => (
                        <div className="flex align-items-center" style={{ color: '#9ca3af' }}>
                            <i className={`pi ${getPlaidCategoryIcon(rowData.plaidCategory?.[0])} mr-2`}></i>
                            <span>{rowData.plaidCategory?.[0] || 'Uncategorized'}</span>
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
};

export default TransactionsTable;

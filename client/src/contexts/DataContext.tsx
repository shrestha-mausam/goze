'use client';

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { Transaction, Account } from '@/lib/types';
import { getAllTransactions, getAllAccounts, getExpenseTransactions } from '@/lib/api.client';

type DataContextType = {
    allTransactions: Transaction[];
    expenseTransactions: Transaction[];
    accounts: Account[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all data in parallel
    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [allTransactionsResponse, expenseTransactionsResponse, accountsResponse] = await Promise.all([
                getAllTransactions(),
                getExpenseTransactions(),
                getAllAccounts(),
            ]);

            // Check if all requests were successful
            if (!allTransactionsResponse.ok || !expenseTransactionsResponse.ok || !accountsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const [allTransactionsData, expenseTransactionsData, accountsData] = await Promise.all([
                allTransactionsResponse.json(),
                expenseTransactionsResponse.json(),
                accountsResponse.json(),
            ]);

            setAllTransactions(allTransactionsData.data?.transactions || []);
            setExpenseTransactions(expenseTransactionsData.data?.transactions || []);
            setAccounts(accountsData.data?.accounts || []);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to load data';
            setError(errorMessage);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider
            value={{
                allTransactions,
                expenseTransactions,
                accounts,
                loading,
                error,
                refetch: fetchData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};


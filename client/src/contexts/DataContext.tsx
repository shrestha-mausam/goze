'use client';

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Check if we're on a public route (login page)
    const isPublicRoute = pathname === '/login' || pathname === '/';

    // Fetch all data in parallel
    const fetchData = async (): Promise<void> => {
        // Don't fetch if on public routes
        if (isPublicRoute) {
            return;
        }

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

    // Fetch data on mount or when pathname changes (e.g., after login)
    useEffect(() => {
        fetchData();
    }, [pathname]); // Re-fetch when route changes

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


export type ReportTab = 'spending' | 'income' | 'netIncome' | 'savings' | 'comparison';
export type DateRange = 'thisWeek' | 'thisMonth' | 'last6Months' | 'lastYear';
export type MonthRange = 'thisMonth' | 'lastMonth' | 'twoMonthsAgo' | 'threeMonthsAgo' | 'fourMonthsAgo' | 'fiveMonthsAgo' | 'sixMonthsAgo' | 'sevenMonthsAgo' | 'eightMonthsAgo' | 'nineMonthsAgo' | 'tenMonthsAgo' | 'elevenMonthsAgo' | 'twelveMonthsAgo';

export interface TabOption {
    label: string;
    value: ReportTab;
}

export interface DateRangeOption {
    label: string;
    value: DateRange;
}

export interface MonthOption {
    label: string;
    value: MonthRange;
}

// Component prop interfaces
export interface ReportTabsProps {
    activeTab: ReportTab;
    onTabChange: (tab: ReportTab) => void;
    tabs: TabOption[];
}

export interface ReportControlsProps {
    activeTab: ReportTab;
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
    comparisonRange1: MonthRange;
    comparisonRange2: MonthRange;
    onComparisonChange: (range1: MonthRange, range2: MonthRange) => void;
    monthOptions: MonthOption[];
    dateRangeOptions: DateRangeOption[];
    themeType: 'light' | 'dark';
}

export interface ReportChartProps {
    activeTab: ReportTab;
    dateRange: DateRange;
    comparisonRange1: MonthRange;
    comparisonRange2: MonthRange;
    themeType: 'light' | 'dark';
}

export interface ReportSummaryProps {
    activeTab: ReportTab;
    comparisonRange1: MonthRange;
    comparisonRange2: MonthRange;
    monthOptions: MonthOption[];
    themeType: 'light' | 'dark';
}

export interface TransactionsTableProps {
    transactions: any[];
    accounts: any[];
    themeType: 'light' | 'dark';
    toast: React.RefObject<any>;
}

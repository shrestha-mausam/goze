'use client';

import { Dropdown } from 'primereact/dropdown';
import { ReportControlsProps } from './types';

const ReportControls: React.FC<ReportControlsProps> = ({
    activeTab,
    dateRange,
    onDateRangeChange,
    comparisonRange1,
    comparisonRange2,
    onComparisonChange,
    monthOptions,
    dateRangeOptions,
    themeType
}) => {
    const filteredMonthOptions = monthOptions.filter(option => option.value !== comparisonRange1);

    return (
        <div className="flex justify-content-between align-items-center mb-6">
            <div className="flex align-items-center gap-4">
                {activeTab === 'comparison' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Period</label>
                            <Dropdown
                                value={comparisonRange1}
                                options={monthOptions}
                                onChange={(e) => onComparisonChange(e.value, comparisonRange2)}
                                placeholder="Select Period"
                                className="w-40"
                                panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Compare With</label>
                            <Dropdown
                                value={comparisonRange2}
                                options={filteredMonthOptions}
                                onChange={(e) => onComparisonChange(comparisonRange1, e.value)}
                                placeholder="Select Period"
                                className="w-40"
                                panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Date Range</label>
                            <Dropdown
                                value={dateRange}
                                options={dateRangeOptions}
                                onChange={(e) => onDateRangeChange(e.value)}
                                placeholder="Select Range"
                                className="w-40"
                                panelClassName={themeType === 'dark' ? 'dark-dropdown' : ''}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportControls;

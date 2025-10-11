'use client';

import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { ReportTabsProps } from './types';

const ReportTabs: React.FC<ReportTabsProps> = ({
    activeTab,
    onTabChange,
    tabs
}) => {
    return (
        <div className="flex gap-2 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
            {tabs.map((tab) => (
                <Button
                    key={tab.value}
                    label={tab.label}
                    className={classNames('p-button-text p-button-sm', {
                        'p-button-plain': activeTab !== tab.value,
                    })}
                    onClick={() => onTabChange(tab.value)}
                />
            ))}
        </div>
    );
};

export default ReportTabs;

'use client';

import React from 'react';

interface AppInfoProps {
    appName?: string;
    tagline?: string;
    features?: string[];
}

export default function AppInfo({
    appName = 'Goze',
    tagline = 'Your Personal Finance Manager',
    features = [
        'Track your income and expenses in one place',
        'Create and manage multiple budgets',
        'Visualize your spending with detailed reports',
        'Set financial goals and track your progress',
        'Secure and private - your data stays yours',
    ],
}: AppInfoProps) {
    return (
        <div>
            <div className="text-center mb-5 mt-6">
                <i className="pi pi-wallet text-6xl text-primary mb-3"></i>
                <h1 className="text-4xl font-bold mb-2">{appName}</h1>
                <h2 className="text-xl font-normal text-600 mt-0">{tagline}</h2>
            </div>

            <ul className="list-none p-0 m-0 text-gray-600">
                {features.map((feature, index) => (
                    <li
                        key={index}
                        className={`flex align-items-center ${index < features.length - 1 ? 'mb-3' : ''}`}
                    >
                        <i className="pi pi-check-circle mr-2 text-primary"></i>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

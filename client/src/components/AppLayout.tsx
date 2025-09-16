'use client';

import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useTheme } from '@/contexts/ThemeContext';
import { Toast } from 'primereact/toast';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    title = 'Goze Finance App',
}) => {
    const { themeType } = useTheme();
    const toast = React.useRef<Toast>(null);

    const currentYear = new Date().getFullYear();

    return (
        <div
            className={`app-container ${themeType === 'dark' ? 'dark-mode' : ''}`}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content="Personal finance management application"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Toast ref={toast} />

            {/* Main Content - Add left margin and top padding to account for sidebar and topbar */}
            <div
                className="layout-content"
                style={{
                    marginLeft: '80px',
                    width: 'calc(100% - 80px)',
                    paddingTop: '60px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Content area that grows to fill available space */}
                <div style={{ flex: 1 }}>{children}</div>

                {/* Copyright footer - always at bottom */}
                <footer
                    className={`text-center py-2 text-xs ${themeType === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                    style={{ marginTop: 'auto' }}
                >
                    <p className="m-0">
                        © {currentYear} Goze Finance. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AppLayout;

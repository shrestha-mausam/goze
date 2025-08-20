'use client';

import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useTheme } from '@/contexts/ThemeContext';
import { Toast } from 'primereact/toast';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title = 'Goze Finance App' }) => {
  const { themeType } = useTheme();
  const toast = React.useRef<Toast>(null);
  
  const currentYear = new Date().getFullYear();
  
  return (
    <div className={`app-container ${themeType === 'dark' ? 'dark-mode' : ''}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Personal finance management application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toast ref={toast} />

      {/* Main Content - Add left margin and top padding to account for sidebar and topbar */}
      <div className="layout-content" style={{ marginLeft: '80px', width: 'calc(100% - 80px)', paddingTop: '60px' }}>
        {children}
        
        {/* Copyright footer */}
        <div className={`text-center py-2 text-xs mt-3 ${themeType === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
          <p className="m-0">© {currentYear} Goze Finance. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 
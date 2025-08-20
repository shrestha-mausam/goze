'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@/contexts/ThemeContext';

const Topbar: React.FC = () => {
  const { themeType, toggleTheme } = useTheme();

  return (
    <div className="fixed top-0 right-0 p-3 z-5" style={{ height: '60px' }}>
      {/* Theme toggle button */}
      <Button 
        icon={themeType === 'dark' ? 'pi pi-sun' : 'pi pi-moon'} 
        onClick={toggleTheme}
        className="p-button-rounded p-button-text" 
        tooltip={themeType === 'dark' ? 'Light Mode' : 'Dark Mode'} 
        tooltipOptions={{ position: 'left' }}
        aria-label="Toggle theme"
      />
    </div>
  );
};

export default Topbar; 
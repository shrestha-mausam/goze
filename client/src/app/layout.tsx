import React from 'react';
import type { Metadata } from 'next';
import { PrimeReactProvider } from 'primereact/api';
import { ThemeProvider } from '../contexts/ThemeContext';

// Import PrimeReact theme CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css';

// Import global styles
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Goze',
  description: 'Your Personal Finance Manager',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <PrimeReactProvider>
            {children}
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
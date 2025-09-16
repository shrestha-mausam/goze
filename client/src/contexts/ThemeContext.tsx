'use client';

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { ThemeType, getTheme } from '@/styles/theme';

type ThemeContextType = {
    themeType: ThemeType;
    toggleTheme: () => void;
    theme: ReturnType<typeof getTheme>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [themeType, setThemeType] = useState<ThemeType>('light');

    // Get the current theme object
    const theme = getTheme(themeType);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setThemeType((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Apply theme to document when it changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeType);

        // Apply theme colors to CSS variables
        document.documentElement.style.setProperty(
            '--primary-color',
            theme.primaryColor
        );
        document.documentElement.style.setProperty(
            '--background-color',
            theme.backgroundColor
        );
        document.documentElement.style.setProperty(
            '--text-color',
            theme.textColor
        );
        document.documentElement.style.setProperty(
            '--secondary-text-color',
            theme.secondaryTextColor
        );
        document.documentElement.style.setProperty(
            '--surface-color',
            theme.surfaceColor
        );
        document.documentElement.style.setProperty(
            '--border-color',
            theme.borderColor
        );

        // Set body background and text color
        document.body.style.backgroundColor = theme.backgroundColor;
        document.body.style.color = theme.textColor;
    }, [themeType, theme]);

    return (
        <ThemeContext.Provider value={{ themeType, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

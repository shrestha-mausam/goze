'use client';

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { ThemeType, getTheme } from '@/styles/theme';
import { FontFamily, FONT_CONFIGS, DEFAULT_FONT, applyFontFamily, loadFont } from '@/lib/fonts';

type ThemeContextType = {
    themeType: ThemeType;
    toggleTheme: () => void;
    theme: ReturnType<typeof getTheme>;
    fontFamily: FontFamily;
    setFontFamily: (font: FontFamily) => void;
    availableFonts: typeof FONT_CONFIGS;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [themeType, setThemeType] = useState<ThemeType>('light');
    const [fontFamily, setFontFamilyState] = useState<FontFamily>(DEFAULT_FONT);

    // Get the current theme object
    const theme = getTheme(themeType);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setThemeType((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Set font family
    const setFontFamily = async (font: FontFamily) => {
        try {
            await loadFont(font);
            applyFontFamily(font);
            setFontFamilyState(font);
            localStorage.setItem('goze-font-family', font);
        } catch (error) {
            console.error('Failed to load font:', error);
        }
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

    // Initialize font from localStorage and apply default font
    useEffect(() => {
        const savedFont = localStorage.getItem('goze-font-family') as FontFamily;
        if (savedFont && FONT_CONFIGS[savedFont]) {
            setFontFamily(savedFont);
        } else {
            // Apply default font on first load
            applyFontFamily(DEFAULT_FONT);
        }
    }, []);

    // Apply font when fontFamily changes
    useEffect(() => {
        applyFontFamily(fontFamily);
    }, [fontFamily]);

    return (
        <ThemeContext.Provider 
            value={{ 
                themeType, 
                toggleTheme, 
                theme, 
                fontFamily, 
                setFontFamily, 
                availableFonts: FONT_CONFIGS 
            }}
        >
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

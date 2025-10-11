/**
 * Font configuration for the Goze application
 * 
 * This file provides easy font switching functionality.
 * To switch fonts, simply change the DEFAULT_FONT value below.
 */

export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'system';

export interface FontConfig {
    id: FontFamily;
    name: string;
    cssVariable: string;
    description: string;
    importUrl?: string;
}

export const FONT_CONFIGS: Record<FontFamily, FontConfig> = {
    inter: {
        id: 'inter',
        name: 'Inter',
        cssVariable: '--font-family-inter',
        description: 'Designed for computer screens, excellent readability',
        importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    },
    roboto: {
        id: 'roboto',
        name: 'Roboto',
        cssVariable: '--font-family-roboto',
        description: 'Google\'s clean, friendly font with excellent web performance',
        importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
    },
    poppins: {
        id: 'poppins',
        name: 'Poppins',
        cssVariable: '--font-family-poppins',
        description: 'Geometric sans-serif, very clean and modern',
        importUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
    },
    system: {
        id: 'system',
        name: 'System Font',
        cssVariable: '--font-family-system',
        description: 'Uses the operating system\'s default font stack'
    }
};

// Default font for the application
export const DEFAULT_FONT: FontFamily = 'poppins';

/**
 * Apply a font family to the document
 * @param fontFamily - The font family to apply
 */
export const applyFontFamily = (fontFamily: FontFamily): void => {
    const config = FONT_CONFIGS[fontFamily];
    if (config) {
        document.documentElement.style.setProperty('--font-family', `var(${config.cssVariable})`);
    }
};

/**
 * Load a font from Google Fonts
 * @param fontFamily - The font family to load
 */
export const loadFont = (fontFamily: FontFamily): Promise<void> => {
    return new Promise((resolve, reject) => {
        const config = FONT_CONFIGS[fontFamily];
        if (!config?.importUrl) {
            resolve();
            return;
        }

        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href="${config.importUrl}"]`);
        if (existingLink) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = config.importUrl;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load font: ${config.name}`));
        
        document.head.appendChild(link);
    });
};

/**
 * Get the current font family
 */
export const getCurrentFont = (): FontFamily => {
    const currentFont = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family');
    
    // Check which font is currently active
    for (const [fontId, config] of Object.entries(FONT_CONFIGS)) {
        if (currentFont.includes(config.name)) {
            return fontId as FontFamily;
        }
    }
    
    return DEFAULT_FONT;
};
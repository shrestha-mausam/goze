export type ThemeType = 'light' | 'dark';

export const themes = {
  light: {
    name: 'light',
    primaryColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    secondaryTextColor: '#6B7280',
    surfaceColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  dark: {
    name: 'dark',
    primaryColor: '#6366F1',
    backgroundColor: '#111827',
    textColor: '#F9FAFB',
    secondaryTextColor: '#9CA3AF',
    surfaceColor: '#1F2937',
    borderColor: '#374151',
  },
};

export const getTheme = (themeType: ThemeType) => {
  return themes[themeType];
}; 
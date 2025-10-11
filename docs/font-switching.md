# Font Switching System

This document explains how to use and customize the font switching system in the Goze application.

## Overview

The Goze application includes a flexible font switching system that allows you to easily change the typography across the entire application. The system supports multiple fonts and provides a clean API for switching between them.

## Available Fonts

### Inter (Default)
- **Description**: Designed specifically for computer screens with excellent readability
- **Best For**: Financial dashboards, data-heavy interfaces, professional applications
- **Weights**: 300, 400, 500, 600, 700

### Roboto
- **Description**: Google's clean, friendly font with excellent web performance
- **Best For**: Modern web applications, user interfaces
- **Weights**: 300, 400, 500, 700

### Poppins
- **Description**: Geometric sans-serif, very clean and modern
- **Best For**: Creative applications, modern designs
- **Weights**: 300, 400, 500, 600, 700

### System Font
- **Description**: Uses the operating system's default font stack
- **Best For**: Native app-like experience, maximum performance
- **Weights**: Varies by system

## Usage

### Basic Font Switching

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
    const { setFontFamily, fontFamily, availableFonts } = useTheme();

    return (
        <div>
            <p>Current font: {fontFamily}</p>
            <button onClick={() => setFontFamily('roboto')}>
                Switch to Roboto
            </button>
            <button onClick={() => setFontFamily('inter')}>
                Switch to Inter
            </button>
        </div>
    );
}
```

### Available Font Options

```typescript
import { FontFamily, FONT_CONFIGS } from '@/lib/fonts';

// Available font IDs
type FontFamily = 'inter' | 'roboto' | 'poppins' | 'system';

// Access font configurations
console.log(FONT_CONFIGS.inter.name); // "Inter"
console.log(FONT_CONFIGS.inter.description); // "Designed for computer screens..."
```

### Programmatic Font Loading

```typescript
import { loadFont, applyFontFamily } from '@/lib/fonts';

// Load a font from Google Fonts
await loadFont('roboto');

// Apply font immediately
applyFontFamily('roboto');
```

## Configuration

### Changing the Default Font

To change the default font for new users, edit `/lib/fonts.ts`:

```typescript
// Change this line to set a new default
export const DEFAULT_FONT: FontFamily = 'roboto'; // was 'inter'
```

### Adding New Fonts

1. **Add the font configuration** in `/lib/fonts.ts`:

```typescript
export const FONT_CONFIGS: Record<FontFamily, FontConfig> = {
    // ... existing fonts
    'open-sans': {
        id: 'open-sans',
        name: 'Open Sans',
        cssVariable: '--font-family-open-sans',
        description: 'Humanist sans-serif typeface',
        importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap'
    }
};
```

2. **Update the FontFamily type**:

```typescript
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'system' | 'open-sans';
```

3. **Add CSS variable** in `/styles/globals.css`:

```css
:root {
    /* ... existing variables */
    --font-family-open-sans: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
```

4. **Import the font** in `/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
```

## Implementation Details

### CSS Variables System

The font system uses CSS custom properties for easy switching:

```css
:root {
    /* Default font */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    
    /* Individual font variables */
    --font-family-inter: 'Inter', ...;
    --font-family-roboto: 'Roboto', ...;
    --font-family-poppins: 'Poppins', ...;
    --font-family-system: -apple-system, ...;
}
```

### ThemeContext Integration

The font system is integrated with the ThemeContext for centralized management:

```typescript
const { 
    fontFamily,           // Current font
    setFontFamily,        // Function to change font
    availableFonts        // All available fonts
} = useTheme();
```

### LocalStorage Persistence

Font choices are automatically saved to localStorage and restored on app load:

```typescript
// Font choice is saved as 'goze-font-family' in localStorage
localStorage.setItem('goze-font-family', 'roboto');
```

## Performance Considerations

### Font Loading Strategy

- **Lazy Loading**: Fonts are only loaded when first requested
- **Caching**: Loaded fonts are cached to prevent re-downloading
- **Fallbacks**: System fonts provide immediate fallback during loading

### Best Practices

1. **Preload Critical Fonts**: Add preload links for the default font in `layout.tsx`
2. **Limit Font Weights**: Only load necessary font weights to reduce bundle size
3. **Use System Fonts**: Consider system fonts for maximum performance

## Troubleshooting

### Font Not Loading

```typescript
// Check if font loaded successfully
loadFont('roboto')
    .then(() => console.log('Font loaded'))
    .catch(error => console.error('Font failed to load:', error));
```

### Font Not Applying

```typescript
// Check current font
const currentFont = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-family');
console.log('Current font:', currentFont);
```

### Debugging Font Issues

1. Check browser developer tools Network tab for font loading
2. Verify CSS variables are being set correctly
3. Ensure font URLs are accessible
4. Check for CORS issues with Google Fonts

## Examples

### Font Selector Component

```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { FontFamily } from '@/lib/fonts';

function FontSelector() {
    const { fontFamily, setFontFamily, availableFonts } = useTheme();

    return (
        <select 
            value={fontFamily} 
            onChange={(e) => setFontFamily(e.target.value as FontFamily)}
        >
            {Object.values(availableFonts).map(font => (
                <option key={font.id} value={font.id}>
                    {font.name} - {font.description}
                </option>
            ))}
        </select>
    );
}
```

### Conditional Font Styling

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function StyledComponent() {
    const { fontFamily } = useTheme();

    return (
        <div style={{ 
            fontFamily: fontFamily === 'poppins' ? 'Poppins' : 'Inter',
            fontSize: fontFamily === 'system' ? '14px' : '16px'
        }}>
            Adaptive styling based on current font
        </div>
    );
}
```

## Migration Guide

### From Hardcoded Fonts

**Before:**
```css
.my-component {
    font-family: 'Roboto', sans-serif;
}
```

**After:**
```css
.my-component {
    font-family: var(--font-family);
}
```

### From Inline Styles

**Before:**
```typescript
<div style={{ fontFamily: 'Inter' }}>
    Content
</div>
```

**After:**
```typescript
<div style={{ fontFamily: 'var(--font-family)' }}>
    Content
</div>
```

## Future Enhancements

- **Font Preview**: Show font samples in selector
- **Custom Font Upload**: Allow users to upload their own fonts
- **Font Pairing**: Suggest complementary font combinations
- **Performance Metrics**: Track font loading performance
- **A/B Testing**: Test different fonts for user engagement

---

For more information, see the [ThemeContext documentation](./theme-context.md) or the [font configuration file](../client/src/lib/fonts.ts).
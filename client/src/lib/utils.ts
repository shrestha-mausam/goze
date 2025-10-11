/**
 * Utility functions for the Goze application
 */

/**
 * Get appropriate PrimeReact icon for Plaid primary categories
 * @param category - The Plaid primary category name
 * @returns PrimeReact icon class name
 */
export const getPlaidCategoryIcon = (category: string): string => {
    switch (category.toLowerCase()) {
        // Transportation
        case 'transportation':
            return 'pi-car';
        case 'gas stations':
            return 'pi-car';
        case 'public transportation':
            return 'pi-bus';
        
        // Food and Dining
        case 'food and drink':
            return 'pi-shopping-bag';
        case 'restaurants':
            return 'pi-utensils';
        case 'fast food':
            return 'pi-shopping-bag';
        
        // Shopping
        case 'shops':
            return 'pi-shopping-cart';
        case 'general merchandise':
            return 'pi-shopping-cart';
        case 'clothing and accessories':
            return 'pi-shopping-cart';
        
        // Entertainment
        case 'entertainment':
            return 'pi-ticket';
        case 'recreation':
            return 'pi-ticket';
        case 'sports and outdoors':
            return 'pi-ticket';
        
        // Bills and Utilities
        case 'bills and utilities':
            return 'pi-bolt';
        case 'utilities':
            return 'pi-bolt';
        case 'telecommunication services':
            return 'pi-wifi';
        
        // Healthcare
        case 'healthcare':
            return 'pi-heart';
        case 'healthcare services':
            return 'pi-heart';
        
        // Financial
        case 'financial':
            return 'pi-dollar';
        case 'banking':
            return 'pi-dollar';
        case 'credit card':
            return 'pi-credit-card';
        
        // Travel
        case 'travel':
            return 'pi-map';
        case 'lodging':
            return 'pi-home';
        
        // Education
        case 'education':
            return 'pi-book';
        
        // Business
        case 'business services':
            return 'pi-briefcase';
        
        // Personal Care
        case 'personal care':
            return 'pi-user';
        
        // Insurance
        case 'insurance':
            return 'pi-shield';
        
        // Government
        case 'government and nonprofit':
            return 'pi-building';
        
        // Other
        case 'other':
        default:
            return 'pi-tag';
    }
};
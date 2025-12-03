// src/constants/initialData.js

export const DEFAULT_TAX_RATE = 0.15; // 15%

export const INITIAL_COMPANY_PROFILE = {
    name: "NUVOORA IT SOLUTIONS",
    contactMail: "info@nuvoora.com",
    contactMobile: "+94 75 5111 360",
    website: "www.nuvoora.com",
    tagline: "Shaping Tomorrow with a Fresh Vision.",
};

export const INITIAL_SERVICES = {
    WordPress: [
        { id: 'wp-basic', name: 'Basic', description: 'Ideal for small businesses & startups.', rate: 15000, details: ['1 Landing page with 6 sections', 'Responsive Design', 'Basic SEO', '1 Revision'] },
        { id: 'wp-standard', name: 'Standard', description: 'Best for businesses needing a complete WordPress solution.', rate: 25000, details: ['Up to 5 pages', 'Custom Theme & Plugins', 'Speed Optimization', '1 Revision'] },
        { id: 'wp-premium', name: 'Premium', description: 'Perfect for businesses requiring advanced functionality.', rate: 60000, details: ['6-10 pages', 'E-Commerce Setup', 'Security Optimization', '2 Revisions'] },
    ],
    Websites: [
        { id: 'web-small', name: 'Small Business Site', description: 'Static marketing site (up to 5 pages).', rate: 45000, details: ['Tailwind CSS', 'Fast Hosting Setup', 'Basic Contact Form'] },
    ],
    MobileApps: [
        { id: 'app-mvp', name: 'Mobile App MVP', description: 'Cross-platform minimal viable product.', rate: 120000, details: ['React Native or Flutter', '3 Core Screens', 'Basic Authentication'] },
    ],
    UIUX: [
        { id: 'ui-wire', name: 'Wireframing & Prototyping', description: 'Figma wireframes and interactive prototype.', rate: 30000, details: ['5 Page Screens', 'Design System Basic', 'User Flow Documentation'] },
    ],
};

/**
 * Default data structure used when a new user logs in for the first time.
 */
export const INITIAL_FIRESTORE_DATA = {
    services: INITIAL_SERVICES,
    taxRate: DEFAULT_TAX_RATE,
    companyProfile: INITIAL_COMPANY_PROFILE,
};
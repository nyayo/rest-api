export const BUSINESS_CATEGORIES = [
  { id: 'technology', label: 'Technology', icon: 'cpu' },
  { id: 'finance', label: 'Finance', icon: 'trending-up' },
  { id: 'healthcare', label: 'Healthcare', icon: 'heart' },
  { id: 'real-estate', label: 'Real Estate', icon: 'home' },
  { id: 'creative', label: 'Creative', icon: 'pen-tool' },
  { id: 'education', label: 'Education', icon: 'book-open' },
  { id: 'hospitality', label: 'Hospitality', icon: 'coffee' },
  { id: 'legal', label: 'Legal', icon: 'briefcase' },
  { id: 'marketing', label: 'Marketing', icon: 'target' },
  { id: 'consulting', label: 'Consulting', icon: 'users' },
  { id: 'manufacturing', label: 'Manufacturing', icon: 'tool' },
  { id: 'retail', label: 'Retail', icon: 'shopping-bag' },
  { id: 'other', label: 'Other', icon: 'more-horizontal' },
];

export const CATEGORY_IDS = BUSINESS_CATEGORIES.map((category) => category.id);

const CATEGORY_THEME_IDS = {
  technology: 'a1000000-0000-4000-8000-000000000001',
  finance: 'a1000000-0000-4000-8000-000000000002',
  healthcare: 'a1000000-0000-4000-8000-000000000003',
  'real-estate': 'a1000000-0000-4000-8000-000000000004',
  creative: 'a1000000-0000-4000-8000-000000000005',
  education: 'a1000000-0000-4000-8000-000000000006',
  hospitality: 'a1000000-0000-4000-8000-000000000007',
  legal: 'a1000000-0000-4000-8000-000000000008',
  marketing: 'a1000000-0000-4000-8000-000000000009',
  consulting: 'a1000000-0000-4000-8000-000000000010',
  manufacturing: 'a1000000-0000-4000-8000-000000000011',
  retail: 'a1000000-0000-4000-8000-000000000012',
  other: 'a1000000-0000-4000-8000-000000000013',
};

export const CATEGORY_PALETTES = {
  technology: {
    primary: '#0f172a',
    secondary: '#334155',
    background: '#1e293b',
    contactIconFont: '#e2e8f0',
    contactIconBackground: '#0f172a',
    socialIconFont: '#e2e8f0',
    socialIconBackground: '#334155',
    vCardBtnFont: '#e2e8f0',
    vCardBtnBackground: '#2563eb',
  },
  finance: {
    primary: '#1e3a8a',
    secondary: '#1e40af',
    background: '#f1f5f9',
    contactIconFont: '#ffffff',
    contactIconBackground: '#1e3a8a',
    socialIconFont: '#1e3a8a',
    socialIconBackground: '#dbeafe',
    vCardBtnFont: '#f8fafc',
    vCardBtnBackground: '#1e3a8a',
  },
  healthcare: {
    primary: '#0e7490',
    secondary: '#155e75',
    background: '#ecfeff',
    contactIconFont: '#ffffff',
    contactIconBackground: '#0e7490',
    socialIconFont: '#0e7490',
    socialIconBackground: '#cffafe',
    vCardBtnFont: '#ecfeff',
    vCardBtnBackground: '#0e7490',
  },
  'real-estate': {
    primary: '#7c2d12',
    secondary: '#9a3412',
    background: '#fef3c7',
    contactIconFont: '#fffbeb',
    contactIconBackground: '#7c2d12',
    socialIconFont: '#7c2d12',
    socialIconBackground: '#fde68a',
    vCardBtnFont: '#fffbeb',
    vCardBtnBackground: '#7c2d12',
  },
  creative: {
    primary: '#7c3aed',
    secondary: '#6d28d9',
    background: '#fdf4ff',
    contactIconFont: '#ffffff',
    contactIconBackground: '#7c3aed',
    socialIconFont: '#7c3aed',
    socialIconBackground: '#f5d0fe',
    vCardBtnFont: '#fdf4ff',
    vCardBtnBackground: '#7c3aed',
  },
  education: {
    primary: '#15803d',
    secondary: '#166534',
    background: '#f0fdf4',
    contactIconFont: '#ffffff',
    contactIconBackground: '#15803d',
    socialIconFont: '#15803d',
    socialIconBackground: '#bbf7d0',
    vCardBtnFont: '#f0fdf4',
    vCardBtnBackground: '#15803d',
  },
  hospitality: {
    primary: '#b45309',
    secondary: '#92400e',
    background: '#fff7ed',
    contactIconFont: '#ffffff',
    contactIconBackground: '#b45309',
    socialIconFont: '#b45309',
    socialIconBackground: '#fed7aa',
    vCardBtnFont: '#fff7ed',
    vCardBtnBackground: '#b45309',
  },
  legal: {
    primary: '#1c1917',
    secondary: '#44403c',
    background: '#f5f5f4',
    contactIconFont: '#fafaf9',
    contactIconBackground: '#1c1917',
    socialIconFont: '#1c1917',
    socialIconBackground: '#e7e5e4',
    vCardBtnFont: '#fafaf9',
    vCardBtnBackground: '#1c1917',
  },
  marketing: {
    primary: '#c2410c',
    secondary: '#9a3412',
    background: '#fff1f2',
    contactIconFont: '#ffffff',
    contactIconBackground: '#c2410c',
    socialIconFont: '#c2410c',
    socialIconBackground: '#fecdd3',
    vCardBtnFont: '#fff1f2',
    vCardBtnBackground: '#c2410c',
  },
  consulting: {
    primary: '#1e293b',
    secondary: '#334155',
    background: '#f8fafc',
    contactIconFont: '#ffffff',
    contactIconBackground: '#1e293b',
    socialIconFont: '#1e293b',
    socialIconBackground: '#e2e8f0',
    vCardBtnFont: '#f8fafc',
    vCardBtnBackground: '#1e293b',
  },
  manufacturing: {
    primary: '#3f3f46',
    secondary: '#52525b',
    background: '#f4f4f5',
    contactIconFont: '#ffffff',
    contactIconBackground: '#3f3f46',
    socialIconFont: '#3f3f46',
    socialIconBackground: '#e4e4e7',
    vCardBtnFont: '#f4f4f5',
    vCardBtnBackground: '#3f3f46',
  },
  retail: {
    primary: '#be123c',
    secondary: '#9f1239',
    background: '#fff1f2',
    contactIconFont: '#ffffff',
    contactIconBackground: '#be123c',
    socialIconFont: '#be123c',
    socialIconBackground: '#fecdd3',
    vCardBtnFont: '#fff1f2',
    vCardBtnBackground: '#be123c',
  },
  other: {
    primary: '#182d30',
    secondary: '#2f575d',
    background: '#dee1dd',
    contactIconFont: '#ffffff',
    contactIconBackground: '#182d30',
    socialIconFont: '#182d30',
    socialIconBackground: '#c5cdc8',
    vCardBtnFont: '#dee1dd',
    vCardBtnBackground: '#182d30',
  },
};

export const isValidCategory = (id) => CATEGORY_IDS.includes(id);

export const getCategory = (id) => BUSINESS_CATEGORIES.find((category) => category.id === id)
  || BUSINESS_CATEGORIES.find((category) => category.id === 'other');

export const paletteToThemeColor = (palette) => ({
  font: {
    primary: palette.primary,
    secondary: palette.secondary,
  },
  background: palette.background,
  contactIcons: {
    font: palette.contactIconFont,
    background: palette.contactIconBackground,
  },
  socialIcons: {
    font: palette.socialIconFont,
    background: palette.socialIconBackground,
  },
  vCardBtn: {
    font: palette.vCardBtnFont,
    background: palette.vCardBtnBackground,
  },
});

export const getCategoryDefaults = (id) => {
  const category = getCategory(id);
  const palette = CATEGORY_PALETTES[category.id] || CATEGORY_PALETTES.other;

  return {
    themeId: CATEGORY_THEME_IDS[category.id],
    palette,
  };
};

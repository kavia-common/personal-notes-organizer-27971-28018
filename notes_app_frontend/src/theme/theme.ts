export const OceanTheme = {
  colors: {
    primary: '#2563EB',
    secondary: '#F59E0B',
    success: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    mutedText: '#4B5563',
    border: '#E5E7EB',
    shadow: 'rgba(0,0,0,0.1)',
  },
  spacing: (n: number) => n * 8,
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },
  elevation: {
    sm: 2,
    md: 4,
    lg: 8,
  },
};

export type ThemeType = typeof OceanTheme;

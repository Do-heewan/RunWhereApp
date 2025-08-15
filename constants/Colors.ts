/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorDark = '#54F895';

export const Colors = {
  dark: {
    // Text colors
    text: '#FAFAF8',
    textSecondary: '#D9D9D9',
    textMuted: '#7C7C7C',
    
    // Background colors
    background: '#15151C',
    surface: '#303034',
    
    // Primary colors
    primary: '#54F895',
    primaryGradient: '#2AFBEA',
    
    // UI element colors
    tint: tintColorDark,
    icon: '#FAFAF8',
    tabIconDefault: '#7C7C7C',
    tabIconSelected: tintColorDark,
    
    // Status colors
    success: '#54F895',
    error: '#E77C7C',
    warning: '#ADADB2',
    
    // Border and divider
    border: '#303034',
    divider: '#7C7C7C',
  },
};

// RunWhere color palettes for easier access
export const ColorPalette = {
  primary: '#54F895',
  gradient: '#2AFBEA',
  black: '#090909',
  blackgray: '#15151C',
  white: '#FAFAF8',
  red: '#E77C7C',
  
  // Grayscale
  gray1: '#303034',
  gray2: '#7C7C7C',
  gray3: '#ADADB2',
  gray4: '#D9D9D9',
};

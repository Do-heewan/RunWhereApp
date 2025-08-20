import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Determine the current theme using the useColorScheme hook
  const theme = useColorScheme() ?? 'light'; 
  
  // Get the color for the currently active theme
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Return the color from the active theme's color set
    return Colors[theme][colorName];
  }
}

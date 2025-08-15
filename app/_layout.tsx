import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Eclipse from '../components/EclipseSVG';

function LayoutContent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Eclipse />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#15151C',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>

        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor="#15151C"
        />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Pretendard: require('../assets/fonts/Pretendard-SemiBold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LayoutContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15151C',
  },
});
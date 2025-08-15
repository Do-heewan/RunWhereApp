import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="h1">This screen does not exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>

        <Link href="/login" style={styles.link}>
          <ThemedText type="link">Go to login screen!</ThemedText>
        </Link>

        <Link href="/signUp" style={styles.link}>
          <ThemedText type="link">Go to signUp screen!</ThemedText>
        </Link>

        <Link href="/signUpLocation" style={styles.link}>
          <ThemedText type="link">Go to signUpLocation screen!</ThemedText>
        </Link>

        <Link href="/signUpRunning" style={styles.link}>
          <ThemedText type="link">Go to signUpRunning screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
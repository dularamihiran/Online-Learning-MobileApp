// Add authentication redirect logic using AuthContext.
// Requirements:
// - On app load, check token & role.
// - If logged in:
//     student -> /(student)
//     instructor -> /(instructor)
// - If not logged in -> /(auth)/login.
// - Prevent screen flicker using loading screen.

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, AuthContext } from '@/context/AuthContext';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { token, user, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inStudentGroup = segments[0] === '(student)';
    const inInstructorGroup = segments[0] === '(instructor)';

    if (!token) {
      // Not logged in - allow landing page and auth pages only
      if (inStudentGroup || inInstructorGroup) {
        router.replace('/');
      }
    } else {
      // Logged in, redirect based on role
      if (user?.role === 'student' && !inStudentGroup) {
        router.replace('/(student)');
      } else if (user?.role === 'instructor' && !inInstructorGroup) {
        router.replace('/(instructor)');
      }
    }
  }, [token, user, loading, segments, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
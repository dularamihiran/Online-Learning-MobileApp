import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

export default function StudentDashboard() {
  const { logout, user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // No need to manually navigate, _layout.tsx will handle the redirect
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎓</Text>
        <Text style={styles.title}>Student Dashboard</Text>
        <Text style={styles.welcome}>Welcome back, {user?.name || 'Student'}!</Text>
        <Text style={styles.description}>
          Your learning journey starts here. Access your courses, track progress, and achieve your goals.
        </Text>

        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push('/(student)/course-list' as any)}
          >
            <Text style={styles.navButtonText}>📚 All Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push('/(student)/my-courses' as any)}
          >
            <Text style={styles.navButtonText}>📖 My Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push('/(student)/chatgpt-suggestions' as any)}
          >
            <Text style={styles.navButtonText}>✨ Course Suggestions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 400,
    marginBottom: 32,
  },
  navigationContainer: {
    width: '100%',
    maxWidth: 400,
  },
  navButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 24,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

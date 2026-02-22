import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

export default function InstructorDashboard() {
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
        <Text style={styles.emoji}>👨‍🏫</Text>

        <Text style={styles.title}>Instructor Dashboard</Text>

        <Text style={styles.welcome}>
          Welcome back, {user?.name || 'Instructor'}!
        </Text>

        <Text style={styles.description}>
          Manage your courses, create new lessons, track student progress,
          and build impactful learning experiences.
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(instructor)/create-course' as any)}
        >
          <Text style={styles.primaryButtonText}>Create Course</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(instructor)/my-courses' as any)}
        >
          <Text style={styles.secondaryButtonText}>My Courses</Text>
        </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },

  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 14,
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },

  primaryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 14,
    width: '80%',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },

  secondaryButtonText: {
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
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
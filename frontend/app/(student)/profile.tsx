import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function StudentProfile() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name || 'Student'}</Text>
        <Text style={styles.email}>{user?.email || 'student@example.com'}</Text>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎓 Student</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>Student</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>2024</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileIconText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  badgeText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  footer: {
    padding: 24,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

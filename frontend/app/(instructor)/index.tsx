import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';

export default function InstructorDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const quickActions = [
    {
      icon: 'library-outline',
      title: 'My Courses',
      subtitle: 'View & manage your courses',
      color: '#0ea5e9',
      route: '/(instructor)/my-courses' as any,
    },
    {
      icon: 'add-circle-outline',
      title: 'Create Course',
      subtitle: 'Add a new course',
      color: '#10b981',
      route: '/(instructor)/create-course' as any,
    },
    {
      icon: 'people-outline',
      title: 'Students',
      subtitle: 'View enrolled students',
      color: '#f59e0b',
      route: '/(instructor)/my-courses' as any,
    },
    {
      icon: 'person-outline',
      title: 'My Profile',
      subtitle: 'View profile & settings',
      color: '#8b5cf6',
      route: '/(instructor)/profile' as any,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="#0ea5e9" />
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeSubtitle}>Welcome back,</Text>
            <Text style={styles.welcomeTitle}>{user?.name || 'Instructor'}!</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={() => router.push(action.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teaching Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="library" size={24} color="#0ea5e9" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="people" size={24} color="#10b981" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="star" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import API from '@/api/api';

type Course = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  instructor: {
    _id: string;
    name: string;
  };
};

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyCourses = useCallback(async () => {
    try {
      const res = await API.get('/enrollments/my');
      console.log('My enrollments:', res.data);
      // Backend returns enrollments array with course populated
      const coursesData = res.data.map((enrollment: any) => enrollment.course);
      setCourses(coursesData);
    } catch (err: any) {
      console.log('Fetch error:', err);
      console.log('Error response:', err.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMyCourses();
    }, [fetchMyCourses])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyCourses();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading your courses...</Text>
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>📚</Text>
        <Text style={styles.emptyTitle}>No Enrolled Courses</Text>
        <Text style={styles.emptyText}>
          You haven&apos;t enrolled in any courses yet.{"\n"}
          Start learning by browsing available courses!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.subtitle}>{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</Text>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7c3aed"]} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.enrolledBadge}>
              <Text style={styles.enrolledBadgeText}>✓ Enrolled</Text>
            </View>
            <View style={styles.courseHeader}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseInstructor}>by {item.instructor.name}</Text>
            </View>
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
            {item.content && (
              <View style={styles.contentContainer}>
                <Text style={styles.contentLabel}>📖 Content:</Text>
                <Text style={styles.contentText} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  enrolledBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  enrolledBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  courseHeader: {
    marginBottom: 8,
    paddingRight: 70,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 13,
    color: '#7c3aed',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  contentContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

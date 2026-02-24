import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import API from '@/api/api';

type Course = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
  level?: string;
  duration?: string;
  price?: string;
  instructor: {
    _id: string;
    name: string;
  };
};

export default function MyCourses() {
  const router = useRouter();
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
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading your courses...</Text>
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View style={styles.centerContainer}>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0ea5e9"]} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
              pathname: '/course-details',
              params: { course: JSON.stringify(item), isEnrolled: 'true' }
            } as any)}
            activeOpacity={0.7}
          >
            <View style={styles.enrolledBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#fff" />
              <Text style={styles.enrolledBadgeText}>Enrolled</Text>
            </View>
            {item.level && (
              <View style={[styles.levelBadge, 
                item.level === 'Beginner' && styles.badgeBeginner,
                item.level === 'Intermediate' && styles.badgeIntermediate,
                item.level === 'Advanced' && styles.badgeAdvanced
              ]}>
                <Text style={styles.badgeText}>{item.level}</Text>
              </View>
            )}
            <View style={styles.courseHeader}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <View style={styles.instructorRow}>
                <Ionicons name="person" size={14} color="#0ea5e9" />
                <Text style={styles.courseInstructor}>{item.instructor.name}</Text>
              </View>
            </View>
            
            {(item.category || item.duration || item.price) && (
              <View style={styles.metaContainer}>
                {item.category && (
                  <View style={styles.metaItem}>
                    <Ionicons name="folder-outline" size={12} color="#0ea5e9" />
                    <Text style={styles.metaText}>{item.category}</Text>
                  </View>
                )}
                {item.duration && (
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="#0ea5e9" />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                )}
                {item.price && (
                  <View style={styles.metaItem}>
                    <Ionicons name="pricetag-outline" size={12} color="#0ea5e9" />
                    <Text style={styles.metaText}>{item.price}</Text>
                  </View>
                )}
              </View>
            )}
            
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
            {item.content && (
              <View style={styles.contentContainer}>
                <View style={styles.contentLabel}>
                  <Ionicons name="document-text-outline" size={14} color="#0ea5e9" />
                  <Text style={styles.contentLabelText}>Content Preview</Text>
                </View>
                <Text style={styles.contentText} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
            )}
            
            <View style={styles.viewDetailsHint}>
              <Text style={styles.viewDetailsText}>Tap to view full details</Text>
              <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  enrolledBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  levelBadge: {
    position: 'absolute',
    top: 50,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeBeginner: {
    backgroundColor: '#d1fae5',
  },
  badgeIntermediate: {
    backgroundColor: '#fed7aa',
  },
  badgeAdvanced: {
    backgroundColor: '#fecaca',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
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
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  courseInstructor: {
    fontSize: 13,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  contentContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  contentLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  contentLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  contentText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    marginBottom: 8,
    paddingLeft: 20,
  },
  viewDetailsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#0ea5e9',
    fontWeight: '600',
  },
});

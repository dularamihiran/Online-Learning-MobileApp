import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
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

export default function AllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch courses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const res = await API.get('/enrollments/my');
      const enrolledIds = res.data.map((enrollment: any) => enrollment.course._id);
      setEnrolledCourseIds(enrolledIds);
    } catch (err) {
      console.log('Fetch enrolled courses error:', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
    fetchEnrolledCourses();
  };

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await API.post('/enrollments/enroll', { courseId });
      Alert.alert('Success', 'Enrolled successfully!');
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Enrollment failed';
      Alert.alert('Error', errorMsg);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  // Filter out enrolled courses
  const availableCourses = courses.filter(course => !enrolledCourseIds.includes(course._id));

  if (availableCourses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="book-outline" size={64} color="#cbd5e1" />
        </View>
        <Text style={styles.emptyTitle}>No Available Courses</Text>
        <Text style={styles.emptyText}>
          {courses.length > 0 
            ? "You're enrolled in all available courses!" 
            : "Check back later for new courses!"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={availableCourses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0ea5e9"]} />
        }
        renderItem={({ item }) => {
          const isEnrolling = enrolling === item._id;

          return (
            <View style={styles.card}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                {item.level && (
                  <View style={[styles.levelBadge, 
                    item.level === 'Beginner' && styles.badgeBeginner,
                    item.level === 'Intermediate' && styles.badgeIntermediate,
                    item.level === 'Advanced' && styles.badgeAdvanced
                  ]}>
                    <Text style={styles.badgeText}>{item.level}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.instructorBadge}>
                <Ionicons name="person" size={12} color="#0ea5e9" />
                <Text style={styles.courseInstructor}>{item.instructor.name}</Text>
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
                      <Ionicons name="time-outline" size={12} color="#10b981" />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                  )}
                  {item.price && (
                    <View style={styles.metaItem}>
                      <Ionicons name="pricetag-outline" size={12} color="#f59e0b" />
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
              <TouchableOpacity
                style={[
                  styles.enrollButton,
                  isEnrolling && styles.enrollingButton,
                ]}
                onPress={() => handleEnroll(item._id)}
                disabled={isEnrolling}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isEnrolling ? "hourglass-outline" : "checkmark-circle"} 
                  size={18} 
                  color="#fff" 
                />
                <Text style={styles.enrollButtonText}>
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  courseHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
  instructorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
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
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    lineHeight: 21,
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
    marginBottom: 12,
    paddingLeft: 20,
  },
  enrollButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  enrollingButton: {
    backgroundColor: '#7dd3fc',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

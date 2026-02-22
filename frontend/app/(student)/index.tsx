import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
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
      console.log('Courses fetched:', res.data);
      setCourses(res.data);
    } catch (err) {
      console.log('Fetch error:', err);
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
      // Add to enrolled list
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch (err: any) {
      console.log('Enroll error:', err);
      console.log('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'Enrollment failed';
      Alert.alert('Error', errorMsg);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  // Filter out enrolled courses
  const availableCourses = courses.filter(course => !enrolledCourseIds.includes(course._id));

  if (availableCourses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>📚</Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7c3aed"]} />
        }
        renderItem={({ item }) => {
          const isEnrolling = enrolling === item._id;

          return (
            <View style={styles.card}>
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
              <TouchableOpacity
                style={[
                  styles.enrollButton,
                  isEnrolling && styles.enrollingButton,
                ]}
                onPress={() => handleEnroll(item._id)}
                disabled={isEnrolling}
              >
                <Text style={styles.enrollButtonText}>
                  {isEnrolling ? '⏳ Enrolling...' : '✓ Enroll Now'}
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
  },
  courseHeader: {
    marginBottom: 8,
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
    marginBottom: 12,
    lineHeight: 18,
  },
  enrollButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  enrolledButton: {
    backgroundColor: '#6366f1',
  },
  enrollingButton: {
    backgroundColor: '#86efac',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

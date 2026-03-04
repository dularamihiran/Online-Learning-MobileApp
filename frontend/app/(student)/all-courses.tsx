import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import API from '@/api/api';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/types/course';

export default function AllCourses() {
  const router = useRouter();
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
    } catch {
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
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            isEnrolled={false}
            isEnrolling={enrolling === item._id}
            onPress={() => router.push({
              pathname: '/course-details',
              params: { course: JSON.stringify(item), isEnrolled: 'false' }
            } as any)}
            onEnroll={() => handleEnroll(item._id)}
          />
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
});

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import API from '@/api/api';

type Course = {
  _id: string;
  title: string;
  description: string;
  content?: string;
};

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
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
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await API.post('/enrollments/enroll', { courseId });
      Alert.alert('Success', 'Enrolled successfully!');
    } catch (err: any) {
      console.log('Enroll error:', err);
      console.log('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'Enrollment failed';
      Alert.alert('Error', errorMsg);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseDesc}>{item.description}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleEnroll(item._id)}>
              <Text style={styles.buttonText}>Enroll</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, marginBottom: 10 },
  courseTitle: { fontSize: 18, fontWeight: 'bold' },
  courseDesc: { color: '#475569', marginBottom: 10 },
  button: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

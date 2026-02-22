import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Alert
} from "react-native";
import { useEffect, useState, useContext, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

type Course = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  createdAt?: string;
};

type Student = {
  _id: string;
  name: string;
  email: string;
};

export default function MyCourses() {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      console.log("Fetching instructor's courses...");
      const res = await axios.get(
        "https://online-learning-mobileapp.onrender.com/api/courses/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Courses fetched:", res.data);
      setCourses(res.data);
    } catch (error: any) {
      console.log("Error fetching courses:", error);
      console.log("Error response:", error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [fetchCourses])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const fetchEnrolledStudents = async (courseId: string) => {
    setLoadingStudents(true);
    try {
      console.log('Fetching students for course:', courseId);
      const res = await axios.get(
        `https://online-learning-mobileapp.onrender.com/api/enrollments/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Students fetched:', res.data);
      // Backend returns enrollments with student populated
      const studentsData = res.data.map((enrollment: any) => enrollment.student);
      setStudents(studentsData);
      setSelectedCourse(courseId);
      setModalVisible(true);
    } catch (err: any) {
      console.log('Fetch students error:', err);
      console.log('Error response:', err.response?.data);
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoadingStudents(false);
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

  if (courses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>📚</Text>
        <Text style={styles.emptyTitle}>No Courses Yet</Text>
        <Text style={styles.emptyText}>
          You haven&apos;t created any courses yet.{"\n"}
          Start by creating your first course!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.subtitle}>{courses.length} course{courses.length !== 1 ? 's' : ''}</Text>
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
            <View style={styles.cardHeader}>
              <Text style={styles.courseTitle}>{item.title}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            {item.content && (
              <View style={styles.contentContainer}>
                <Text style={styles.contentLabel}>Content:</Text>
                <Text style={styles.contentText} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.viewStudentsButton}
              onPress={() => fetchEnrolledStudents(item._id)}
              disabled={loadingStudents}
            >
              <Text style={styles.viewStudentsButtonText}>
                {loadingStudents ? 'Loading...' : '👥 View Students'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal for showing enrolled students */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enrolled Students</Text>
            <Text style={styles.modalSubtitle}>
              {students.length} {students.length === 1 ? 'student' : 'students'} enrolled
            </Text>
          </View>

          {students.length === 0 ? (
            <View style={styles.emptyStudentsContainer}>
              <Text style={styles.emptyStudentsText}>No students enrolled yet</Text>
            </View>
          ) : (
            <FlatList
              data={students}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.studentsList}
              renderItem={({ item }) => (
                <View style={styles.studentCard}>
                  <View style={styles.studentIcon}>
                    <Text style={styles.studentIconText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentEmail}>{item.email}</Text>
                  </View>
                </View>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748b",
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  description: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 8,
  },
  contentContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 4,
  },
  contentText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  viewStudentsButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  viewStudentsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  studentsList: {
    padding: 16,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  studentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentIconText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyStudentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStudentsText: {
    fontSize: 16,
    color: "#64748b",
  },
  closeButton: {
    backgroundColor: "#ef4444",
    margin: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
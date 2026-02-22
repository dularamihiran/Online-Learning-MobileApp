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
import { useFocusEffect, useRouter } from "expo-router";
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

export default function InstructorMyCourses() {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

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
      setModalVisible(true);
    } catch (err: any) {
      console.log('Fetch students error:', err);
      console.log('Error response:', err.response?.data);
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEdit = (courseId: string) => {
    router.push(`/(instructor)/edit-course?id=${courseId}`);
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(courseId);
            try {
              await axios.delete(
                `https://online-learning-mobileapp.onrender.com/api/courses/${courseId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              Alert.alert('Success', 'Course deleted successfully');
              // Remove from local state
              setCourses(prev => prev.filter(c => c._id !== courseId));
            } catch (err: any) {
              console.log('Delete error:', err);
              console.log('Error response:', err.response?.data);
              Alert.alert('Error', err.response?.data?.message || 'Failed to delete course');
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
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
          Tap the Create tab to add your first course!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            
            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.viewStudentsButton}
                onPress={() => fetchEnrolledStudents(item._id)}
                disabled={loadingStudents}
              >
                <Text style={styles.viewStudentsButtonText}>
                  {loadingStudents ? '...' : '👥'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item._id)}
                disabled={deleting === item._id}
              >
                <Text style={styles.editButtonText}>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, deleting === item._id && styles.deleteButtonDisabled]}
                onPress={() => handleDelete(item._id, item.title)}
                disabled={deleting === item._id}
              >
                <Text style={styles.deleteButtonText}>
                  {deleting === item._id ? '...' : '🗑️'}
                </Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  viewStudentsButton: {
    flex: 1,
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: 'center',
  },
  viewStudentsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: 'center',
    minWidth: 50,
  },
  deleteButtonDisabled: {
    backgroundColor: "#fca5a5",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
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
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  prerequisites?: string;
  learningOutcomes?: string;
  instructor: {
    _id: string;
    name: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export default function CourseDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    // Parse course data from params
    if (params.course) {
      try {
        const courseData = JSON.parse(params.course as string);
        setCourse(courseData);
        setIsEnrolled(params.isEnrolled === 'true');
        setLoading(false);
      } catch (err) {
        console.error('Error parsing course data:', err);
        Alert.alert('Error', 'Invalid course data', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Course data not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnroll = async () => {
    if (!course) return;
    
    setEnrolling(true);
    try {
      await API.post('/enrollments/enroll', { courseId: course._id });
      Alert.alert('Success', 'Enrolled successfully!', [
        { text: 'OK', onPress: () => {
          setIsEnrolled(true);
        }}
      ]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Enrollment failed';
      Alert.alert('Error', errorMsg);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{course.title}</Text>
            {course.level && (
              <View style={[styles.levelBadge, 
                course.level === 'Beginner' && styles.badgeBeginner,
                course.level === 'Intermediate' && styles.badgeIntermediate,
                course.level === 'Advanced' && styles.badgeAdvanced
              ]}>
                <Text style={styles.badgeText}>{course.level}</Text>
              </View>
            )}
          </View>

          {/* Instructor Info */}
          <View style={styles.instructorContainer}>
            <Ionicons name="person-circle" size={40} color="#0ea5e9" />
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorLabel}>Instructor</Text>
              <Text style={styles.instructorName}>{course.instructor.name}</Text>
              {course.instructor.email && (
                <Text style={styles.instructorEmail}>{course.instructor.email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          {course.category && (
            <View style={styles.infoCard}>
              <Ionicons name="folder-outline" size={24} color="#0ea5e9" />
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{course.category}</Text>
            </View>
          )}
          {course.duration && (
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={24} color="#0ea5e9" />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{course.duration}</Text>
            </View>
          )}
          {course.price && (
            <View style={styles.infoCard}>
              <Ionicons name="pricetag-outline" size={24} color="#0ea5e9" />
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>{course.price}</Text>
            </View>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#0ea5e9" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.sectionContent}>{course.description}</Text>
        </View>

        {/* Prerequisites Section */}
        {course.prerequisites && course.prerequisites !== 'None' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-circle" size={20} color="#0ea5e9" />
              <Text style={styles.sectionTitle}>Prerequisites</Text>
            </View>
            <Text style={styles.sectionContent}>{course.prerequisites}</Text>
          </View>
        )}

        {/* Learning Outcomes Section */}
        {course.learningOutcomes && course.learningOutcomes.trim() !== '' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy" size={20} color="#0ea5e9" />
              <Text style={styles.sectionTitle}>What You&apos;ll Learn</Text>
            </View>
            <Text style={styles.sectionContent}>{course.learningOutcomes}</Text>
          </View>
        )}

        {/* Course Content Section */}
        {course.content && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color="#0ea5e9" />
              <Text style={styles.sectionTitle}>Course Content</Text>
            </View>
            <Text style={styles.sectionContent}>{course.content}</Text>
          </View>
        )}

        {/* Enrollment Status Badge */}
        {isEnrolled && (
          <View style={styles.enrolledBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#0ea5e9" />
            <Text style={styles.enrolledText}>You are enrolled in this course</Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Sticky Enroll Button (only if not enrolled) */}
      {!isEnrolled && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.enrollButton, enrolling && styles.enrollingButton]}
            onPress={handleEnroll}
            disabled={enrolling}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={enrolling ? "hourglass-outline" : "checkmark-circle"} 
              size={22} 
              color="#fff" 
            />
            <Text style={styles.enrollButtonText}>
              {enrolling ? 'Enrolling...' : 'Enroll in This Course'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
    lineHeight: 32,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instructorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  instructorLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  instructorEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionContent: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  enrolledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    gap: 10,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  enrolledText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c4a6e',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  enrollButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
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
    fontSize: 16,
    fontWeight: '700',
  },
});

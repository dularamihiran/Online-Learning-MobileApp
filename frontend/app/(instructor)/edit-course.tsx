import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import API from '@/api/api';

export default function EditCourse() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const res = await API.get(`/courses/my`);
      const course = res.data.find((c: any) => c._id === id);
      
      if (course) {
        setTitle(course.title);
        setDescription(course.description);
        setContent(course.content || '');
      } else {
        Alert.alert('Error', 'Course not found');
        router.back();
      }
    } catch (err: any) {
      console.log('Fetch course error:', err);
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setUpdating(true);
    try {
      await API.put(`/courses/${id}`, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
      });

      Alert.alert('Success', 'Course updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      console.log('Update error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update course';
      Alert.alert('Error', errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading course...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✏️ Edit Course</Text>
          <Text style={styles.headerSubtitle}>Update your course details</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Course Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., React Native Fundamentals"
              value={title}
              onChangeText={setTitle}
              editable={!updating}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what students will learn..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!updating}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detailed course curriculum (optional)..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!updating}
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>💾 Update Course</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={updating}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  updateButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonDisabled: {
    backgroundColor: '#7dd3fc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});

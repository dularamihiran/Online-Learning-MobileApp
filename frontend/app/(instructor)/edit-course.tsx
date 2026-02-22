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
  Modal,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import API from '@/api/api';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science', 'AI & Machine Learning',
  'Cloud Computing', 'Cybersecurity', 'DevOps', 'Programming Languages',
  'Database', 'UI/UX Design', 'Game Development', 'Blockchain', 'Other'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function EditCourse() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  
  // Additional fields
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const res = await API.get(`/courses/my`);
      const course = res.data.find((c: any) => c._id === id);
      
      if (course) {
        setTitle(course.title);
        setDescription(course.description);
        setContent(course.content || '');
        setCategory(course.category || '');
        setLevel(course.level || '');
        setDuration(course.duration || '');
        setPrice(course.price || '');
        setPrerequisites(course.prerequisites || '');
        setLearningOutcomes(course.learningOutcomes || '');
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
    if (!title.trim() || !description.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!level) {
      Alert.alert('Error', 'Please select a level');
      return;
    }
    if (!duration.trim()) {
      Alert.alert('Error', 'Please enter course duration');
      return;
    }

    setUpdating(true);
    try {
      await API.put(`/courses/${id}`, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category,
        level,
        duration: duration.trim(),
        price: price.trim(),
        prerequisites: prerequisites.trim(),
        learningOutcomes: learningOutcomes.trim(),
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
          <Text style={styles.headerTitle}>Edit Course</Text>
          <Text style={styles.headerSubtitle}>Update your course details</Text>
        </View>

        <View style={styles.form}>
          {/* Basic Information Section */}
          <Text style={styles.sectionHeader}>Basic Information</Text>
          
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

          {/* Category Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(true)}
              disabled={updating}
            >
              <Text style={category ? styles.pickerButtonTextSelected : styles.pickerButtonText}>
                {category || 'Select Category'}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Level Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Level <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowLevelPicker(true)}
              disabled={updating}
            >
              <Text style={level ? styles.pickerButtonTextSelected : styles.pickerButtonText}>
                {level || 'Select Level'}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Duration and Price */}
          <View style={styles.rowInputGroup}>
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>
                Duration <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 8 weeks"
                value={duration}
                onChangeText={setDuration}
                editable={!updating}
              />
            </View>
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Free or $99"
                value={price}
                onChangeText={setPrice}
                editable={!updating}
              />
            </View>
          </View>

          {/* Course Content Section */}
          <Text style={styles.sectionHeader}>Course Content</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Course Content <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detailed course curriculum..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!updating}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Learning Outcomes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What will students learn? (e.g., Build mobile apps, Master React hooks...)"
              value={learningOutcomes}
              onChangeText={setLearningOutcomes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!updating}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prerequisites</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What should students know before enrolling? (e.g., Basic JavaScript...)"
              value={prerequisites}
              onChangeText={setPrerequisites}
              multiline
              numberOfLines={3}
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
              <Text style={styles.updateButtonText}>Update Course</Text>
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

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.optionItem,
                    category === cat && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    category === cat && styles.optionTextSelected
                  ]}>
                    {cat}
                  </Text>
                  {category === cat && <Text style={styles.checkmark}>✔</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Level Picker Modal */}
      <Modal
        visible={showLevelPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLevelPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Level</Text>
              <TouchableOpacity onPress={() => setShowLevelPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {LEVELS.map((lv) => (
                <TouchableOpacity
                  key={lv}
                  style={[
                    styles.optionItem,
                    level === lv && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    setLevel(lv);
                    setShowLevelPicker(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    level === lv && styles.optionTextSelected
                  ]}>
                    {lv}
                  </Text>
                  {level === lv && <Text style={styles.checkmark}>✔</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowInputGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInputGroup: {
    flex: 1,
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
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  pickerButtonTextSelected: {
    fontSize: 16,
    color: '#1e293b',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#64748b',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalClose: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionItemSelected: {
    backgroundColor: '#e0f2fe',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#0ea5e9',
  },
  checkmark: {
    fontSize: 18,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
});

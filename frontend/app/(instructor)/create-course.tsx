import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science', 'AI & Machine Learning',
  'Cloud Computing', 'Cybersecurity', 'DevOps', 'Programming Languages',
  'Database', 'UI/UX Design', 'Game Development', 'Blockchain', 'Other'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCourse() {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  
  // Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  
  // Additional Fields
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const handleCreate = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a course title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a course description");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Please enter course content");
      return;
    }
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!level) {
      Alert.alert("Error", "Please select a level");
      return;
    }
    if (!duration.trim()) {
      Alert.alert("Error", "Please enter course duration");
      return;
    }

    setLoading(true);
    try {
      const courseData = {
        title,
        description,
        content,
        category,
        level,
        duration,
        price: price || "Free",
        prerequisites: prerequisites || "None",
        learningOutcomes: learningOutcomes || "",
      };
      
      await axios.post(
        "https://online-learning-mobileapp.onrender.com/api/courses",
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert(
        "Success", 
        "Course created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.push("/(instructor)/my-courses" as any),
          },
        ]
      );
      
      // Clear form
      setTitle("");
      setDescription("");
      setContent("");
      setCategory("");
      setLevel("");
      setDuration("");
      setPrice("");
      setPrerequisites("");
      setLearningOutcomes("");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create course";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create New Course</Text>
        <Text style={styles.subtitle}>Fill in all the course details</Text>

        {/* Basic Information */}
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Course Title <Text style={styles.required}>*</Text></Text>
          <TextInput
            placeholder="e.g., MERN Stack Bootcamp"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
          <TextInput
            placeholder="Brief description of your course"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            disabled={loading}
          >
            <Text style={[styles.pickerText, !category && styles.placeholderText]}>
              {category || "Select a category"}
            </Text>
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.pickerScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.pickerItem, category === cat && styles.pickerItemSelected]}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, category === cat && styles.pickerItemTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Level <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowLevelPicker(!showLevelPicker)}
            disabled={loading}
          >
            <Text style={[styles.pickerText, !level && styles.placeholderText]}>
              {level || "Select difficulty level"}
            </Text>
          </TouchableOpacity>
          {showLevelPicker && (
            <View style={styles.pickerContainer}>
              {LEVELS.map((lv) => (
                <TouchableOpacity
                  key={lv}
                  style={[styles.pickerItem, level === lv && styles.pickerItemSelected]}
                  onPress={() => {
                    setLevel(lv);
                    setShowLevelPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, level === lv && styles.pickerItemTextSelected]}>
                    {lv}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Duration <Text style={styles.required}>*</Text></Text>
            <TextInput
              placeholder="e.g., 8 weeks"
              value={duration}
              onChangeText={setDuration}
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              placeholder="e.g., $99 or Free"
              value={price}
              onChangeText={setPrice}
              style={styles.input}
              editable={!loading}
            />
          </View>
        </View>

        {/* Course Content */}
        <Text style={styles.sectionTitle}>Course Content</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Content/Syllabus <Text style={styles.required}>*</Text></Text>
          <TextInput
            placeholder="Topics covered: MongoDB, Express, React, Node.js, React Native..."
            value={content}
            onChangeText={setContent}
            style={[styles.input, styles.textAreaLarge]}
            multiline
            numberOfLines={6}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Learning Outcomes</Text>
          <TextInput
            placeholder="What will students learn? (e.g., Build full-stack apps, Deploy to cloud...)"
            value={learningOutcomes}
            onChangeText={setLearningOutcomes}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prerequisites</Text>
          <TextInput
            placeholder="Required knowledge (e.g., Basic JavaScript, HTML/CSS)"
            value={prerequisites}
            onChangeText={setPrerequisites}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Course</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    color: "#64748b",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#0ea5e9",
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1e293b",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    height: 120,
    textAlignVertical: "top",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: 16,
    color: "#1e293b",
  },
  placeholderText: {
    color: "#9ca3af",
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  pickerItemSelected: {
    backgroundColor: "#e0f2fe",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#374151",
  },
  pickerItemTextSelected: {
    color: "#0ea5e9",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#7dd3fc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
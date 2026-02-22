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

export default function CreateCourse() {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      console.log("Creating course with data:", { title, description, content });
      
      const res = await axios.post(
        "https://online-learning-mobileapp.onrender.com/api/courses",
        {
          title,
          description,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Course created:", res.data);
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
    } catch (error: any) {
      console.error("Create course error:", error);
      console.error("Error response:", error.response?.data);
      
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
        <Text style={styles.subtitle}>Fill in the course details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Course Title</Text>
          <TextInput
            placeholder="e.g., MERN Stack Bootcamp"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="e.g., Full Stack Web & Mobile Development"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            placeholder="e.g., MongoDB, Express, React, Node, React Native"
            value={content}
            onChangeText={setContent}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
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
    marginBottom: 30,
    textAlign: "center",
    color: "#64748b",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#c4b5fd",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
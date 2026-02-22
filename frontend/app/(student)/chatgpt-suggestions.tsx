import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import API from '@/api/api';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
  level?: string;
  duration?: string;
  price?: string;
  instructor: {
    _id: string;
    name: string;
  };
};

export default function ChatGPTSuggestions() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I can help you find the perfect course. What are you interested in learning?',
      isUser: false,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  // Fetch enrolled courses on mount
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await API.get('/enrollments/my');
      const enrolledIds = res.data.map((enrollment: any) => enrollment.course._id);
      setEnrolledCourseIds(enrolledIds);
    } catch {
      // Silently fail - not critical
    }
  };

  // Enroll in a course
  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await API.post('/enrollments/enroll', { courseId });
      Alert.alert('Success', 'You have successfully enrolled in this course!');
      // Add to enrolled list
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to enroll. Please try again.';
      Alert.alert('Error', errorMsg);
    } finally {
      setEnrolling(null);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    const promptText = inputText;
    setInputText('');
    setLoading(true);

    try {
      const res = await API.post('/gpt/ask', { prompt: promptText });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: res.data.reply || 'No response received.',
        isUser: false,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Set recommended courses from backend response (filtered by prompt keywords)
      if (res.data.courses && res.data.courses.length > 0) {
        setRecommendedCourses(res.data.courses);
      } else {
        // No matching courses found
        setRecommendedCourses([]);
        const noCourseMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Sorry, I couldn\'t find any courses matching your request in our database. Try asking about other topics!',
          isUser: false,
        };
        setMessages(prev => [...prev, noCourseMessage]);
      }
    } catch (err: any) {
      let errorText = 'Sorry, I encountered an error. ';
      if (err.response?.status === 500) {
        errorText += 'The AI service is currently unavailable. Please check if the OpenAI API key is configured in the backend.';
      } else {
        errorText += err.response?.data?.message || 'Please try again.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}> AI Course Advisor</Text>
        <Text style={styles.subtitle}>Ask me anything about courses!</Text>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.aiText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4f46e5" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        {/* Recommended Courses Section */}
        {recommendedCourses.length > 0 && (
          <View style={styles.coursesSection}>
            <Text style={styles.coursesSectionTitle}> Relevant Courses for You</Text>
            {recommendedCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course._id);
              const isEnrolling = enrolling === course._id;

              return (
                <View key={course._id} style={styles.courseCard}>
                  {course.level && (
                    <View style={[styles.levelBadge, 
                      course.level === 'Beginner' && styles.badgeBeginner,
                      course.level === 'Intermediate' && styles.badgeIntermediate,
                      course.level === 'Advanced' && styles.badgeAdvanced
                    ]}>
                      <Text style={styles.badgeText}>{course.level}</Text>
                    </View>
                  )}
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseInstructor}>by {course.instructor.name}</Text>
                  </View>
                  
                  {(course.category || course.duration || course.price) && (
                    <View style={styles.metaContainer}>
                      {course.category && (
                        <View style={styles.metaItem}>
                          <Text style={styles.metaText}>📚 {course.category}</Text>
                        </View>
                      )}
                      {course.duration && (
                        <View style={styles.metaItem}>
                          <Text style={styles.metaText}>⏱️ {course.duration}</Text>
                        </View>
                      )}
                      {course.price && (
                        <View style={styles.metaItem}>
                          <Text style={styles.metaText}>💰 {course.price}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <Text style={styles.courseDescription} numberOfLines={3}>
                    {course.description}
                  </Text>
                  {course.content && (
                    <Text style={styles.courseContent} numberOfLines={2}>
                       {course.content}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.enrollButton,
                      isEnrolled && styles.enrolledButton,
                      isEnrolling && styles.enrollButtonDisabled,
                    ]}
                    onPress={() => handleEnroll(course._id)}
                    disabled={isEnrolled || isEnrolling}
                  >
                    <Text style={styles.enrollButtonText}>
                      {isEnrolling ? 'Enrolling...' : isEnrolled ? '✓ Enrolled' : '✓ Enroll Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about courses..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={loading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ea5e9',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#1e293b',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#7dd3fc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Courses section styles
  coursesSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  coursesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  courseHeader: {
    marginBottom: 8,
    paddingRight: 90,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 13,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  courseContent: {
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
  },
  enrolledButton: {
    backgroundColor: '#64748b',
  },
  enrollButtonDisabled: {
    backgroundColor: '#86efac',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.emoji}>🎓</Text>
        <Text style={styles.title}>AI Learning Platform</Text>
        <Text style={styles.subtitle}>
          Smart course recommendations powered by AI.{'\n'}
          Learn anytime, anywhere.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Ionicons name="sparkles" size={32} color="#0ea5e9" />
          <Text style={styles.featureText}>AI Course Suggestions</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="book" size={32} color="#0ea5e9" />
          <Text style={styles.featureText}>Smart Learning</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="phone-portrait" size={32} color="#0ea5e9" />
          <Text style={styles.featureText}>Mobile Platform</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  featureCard: {
    alignItems: 'center',
    width: 100,
  },
  featureText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#0ea5e9',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

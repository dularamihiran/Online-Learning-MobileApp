import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00bcd4',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#3498db',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="all-courses"
        options={{
          title: 'All Courses',
          headerTitle: 'Available Courses',
          href: null, // Hidden from tabs, accessible via Home
        }}
      />
      <Tabs.Screen
        name="my-courses"
        options={{
          title: 'My Courses',
          headerTitle: 'My Enrolled Courses',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmarks" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatgpt-suggestions"
        options={{
          title: 'AI Advisor',
          headerTitle: 'AI Course Advisor',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="course-list"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="course-details"
        options={{
          title: 'Course Details',
          headerTitle: 'Course Details',
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function InstructorLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: '#0f172a',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
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
        name="my-courses"
        options={{
          title: 'My Courses',
          headerTitle: 'My Courses',
          tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-course"
        options={{
          title: 'Create',
          headerTitle: 'Create New Course',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
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
        name="edit-course"
        options={{
          href: null, // Hide from tabs
          headerTitle: 'Edit Course',
        }}
      />
    </Tabs>
  );
}

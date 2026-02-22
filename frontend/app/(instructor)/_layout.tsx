import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function InstructorLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#64748b',
        headerStyle: {
          backgroundColor: '#7c3aed',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
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
      <Tabs.Screen
        name="my-courses"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}

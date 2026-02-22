import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function Index() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(tabs)" />;
}


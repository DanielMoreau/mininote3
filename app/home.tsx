import { useRouter } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/bg1.jpg')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode="cover"
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, borderRadius: 10 }}>

        <Text style={{ color: 'white', fontSize: 28, marginBottom: 20 }}>
          MiniNote
        </Text>

        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Text style={{ color: 'white', marginBottom: 10 }}>📝 Notes</Text>
        </TouchableOpacity>

        <Text style={{ color: 'gray' }}>📸 Média (bientôt)</Text>
        <Text style={{ color: 'gray' }}>📅 Évènements (bientôt)</Text>
        <Text style={{ color: 'gray' }}>✅ Tâches (bientôt)</Text>

      </View>
    </ImageBackground>
  );
}
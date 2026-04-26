import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 20 }}>
        Accueil
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/')}
        style={{
          padding: 12,
          backgroundColor: '#000',
          borderRadius: 8
        }}
      >
        <Text style={{ color: '#fff' }}>
          Voir les notes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
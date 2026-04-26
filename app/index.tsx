import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff'
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: '600',
          marginBottom: 20,
          textAlign: 'center'
        }}
      >
        Mininote
      </Text>

      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 40,
          color: '#333'
        }}
      >
        Une application simple pour écrire,
        organiser et retrouver vos notes rapidement.
{'\n'}
{'\n'}
        26/04/2026. Réglage de l'interface en mode manuel d'ici le 01/05/26. Sous réserve. 
{'\n'}
{'\n'}

Ajustements de l'interface en adaptant manuellement la taille : 
{'\n'} 
{'\n'} - des fenêtres 
{'\n'} - des caractères
{'\n'} - du zoom de l'affichage 
{'\n'} 
{'\n'} 
Affichages 5 notes. 6 à illimité en descendant dans la liste.
Tris "perso", "travail" et "idées"
{'\n'} 
{'\n'} 
"Epinglage" des notes avec l'icône étoile pour accès immmédiat en haut de liste.
{'\n'} 
{'\n'} 
Affichage de la note la plus récente en haut de la liste
{'\n'} 
{'\n'} 
        Merci de votre compréhension.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace('/notes')} // 🔒 bloque retour
        style={{
          backgroundColor: '#007AFF',
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: 10
        }}
        activeOpacity={0.7}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '500'
          }}
        >
          Accéder à Mininote
        </Text>
      </TouchableOpacity>
    </View>
  );
}
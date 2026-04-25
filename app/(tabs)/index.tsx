import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type Note = {
  id: string;
  text: string;
  starred: boolean;
  createdAt: number;
};

export default function HomeScreen() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const [flash, setFlash] = useState(false);

  const listRef = useRef<FlatList>(null);

  // LOAD
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await AsyncStorage.getItem('notes');
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            setNotes(parsed);
          }
        }
      } catch {
        setNotes([]);
      }
    };

    loadNotes();
  }, []);

  // SAVE
  useEffect(() => {
    AsyncStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const scrollTop = () => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  // 🔥 FIX FINAL
  const saveNote = () => {
    if (!input.trim()) return;

    const now = Date.now();

    if (editingId) {
      setNotes(prev =>
        prev.map(n =>
          n.id === editingId
            ? { ...n, text: input }
            : n
        )
      );
      setEditingId(null);
    } else {
      setNotes(prev => [
        ...prev,
        {
          id: now.toString(),
          text: input,
          starred: false,
          createdAt: now
        }
      ]);
    }

    setInput('');
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    scrollTop();
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const startEdit = (note: Note) => {
    setInput(note.text);
    setEditingId(note.id);
  };

  const toggleStar = (id: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, starred: !n.starred } : n
      )
    );
    scrollTop();
  };

  const filteredNotes = [...notes]
    .sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return b.createdAt - a.createdAt;
    })
    .filter(n => n.text.toLowerCase().includes(search.toLowerCase()))
    .filter(n => !showStarredOnly || n.starred);

  return (
    <ImageBackground
      source={require('../../assets/images/bg2.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 180,
          paddingTop: 450,
          backgroundColor: flash
            ? 'rgba(230,255,230,0.9)'
            : 'rgba(0,0,0,0.2)'
        }}
      >

        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15
          }}
        >
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              backgroundColor: '#ddd',
              borderRadius: 8
            }}
          >
            <Text style={{ fontWeight: '600' }}>Accueil</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>
            Notes
          </Text>
        </View>

        {/* INPUT */}
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Écris une note..."
style={{
  backgroundColor: 'white',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10,

  marginLeft: 0,
  marginRight: 60
}}
        />
<View style={{ marginLeft: 0, marginRight: 60 }}>
  <Button
    title={editingId ? "💾 Modifier" : "➕ Ajouter"}
    onPress={saveNote}
  />
</View>

<View style={{ height: 10 }} />

{/* SEARCH */}
<TextInput
  value={search}
  onChangeText={setSearch}
  placeholder="🔎 Rechercher..."
  style={{
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,

    marginLeft: 0,
    marginRight: 60
  }}
/>

{/* FILTER */}
<View style={{ marginTop: 10, marginLeft: 0, marginRight: 60 }}>
  <Button
    title={showStarredOnly ? "Afficher tout" : "⭐ Favoris"}
    onPress={() => setShowStarredOnly(!showStarredOnly)}
  />
</View>

        {/* LIST */}
        <FlatList
          ref={listRef}
          style={{ marginTop: 40 }}
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>
              💤 Aucune note
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={{
                marginLeft: 2,
                marginRight: 70,
                padding: 26,
                borderRadius: 12,
                marginBottom: 52,
                borderWidth: 2,
                borderColor: '#000',
                backgroundColor: 'transparent'
              }}
            >
              <Text style={{ color: 'white', marginBottom: 8 }}>
                {item.starred ? '⭐ ' : ''}
                {item.text}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={{ color: 'white' }}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleStar(item.id)}>
                  <Text style={{ color: 'white' }}>
                    {item.starred ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <Text style={{ color: 'white' }}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

      </View>
    </ImageBackground>
  );
}
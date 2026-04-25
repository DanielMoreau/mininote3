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
  createdAt?: number;
  category?: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('perso');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [flash, setFlash] = useState(false);

  const listRef = useRef<FlatList>(null);

  const categories = ['perso', 'travail', 'idées'];

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

  const saveNote = () => {
    if (!input.trim()) return;

    const now = Date.now();

    if (editingId) {
      setNotes(prev =>
        prev.map(n =>
          n.id === editingId ? { ...n, text: input, category } : n
        )
      );
      setEditingId(null);
    } else {
      setNotes(prev => [
        {
          id: now.toString(),
          text: input,
          starred: false,
          createdAt: now,
          category
        },
        ...prev
      ]);
    }

    setInput('');

    // 🔥 feedback renforcé
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const startEdit = (note: Note) => {
    setInput(note.text);
    setCategory(note.category || 'perso');
    setEditingId(note.id);
  };

  const toggleStar = (id: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, starred: !n.starred } : n
      )
    );
  };

  const filteredNotes = notes
    .filter(n => n.text.toLowerCase().includes(search.toLowerCase()))
    .filter(n => !showStarredOnly || n.starred)
    .filter(n => selectedCategory === 'all' || n.category === selectedCategory)
    .sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  return (
    <ImageBackground
      source={require('../assets/images/bg2.jpg')}
      style={{
        flex: 1,
        backgroundColor: flash
          ? 'rgba(255,255,255,0.25)' // 👈 flash premium
          : 'transparent'
      }}
      resizeMode="cover"
    >
      <FlatList
        ref={listRef}
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}

        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingTop: 40 }}>
              <TouchableOpacity onPress={() => router.replace('/home')}>
                <Text style={{ color: 'white' }}>Accueil</Text>
              </TouchableOpacity>
              <Text style={{ color: 'white', fontSize: 24 }}>Notes</Text>
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
                marginHorizontal: 20
              }}
            />

            {/* CATEGORY MENU */}
            <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
              <Text style={{ color: 'white', marginBottom: 5 }}>
                Catégorie :
              </Text>

              <View style={{ flexDirection: 'row' }}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={{
                      marginRight: 10,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: category === cat ? '#fff' : '#555'
                    }}
                  >
                    <Text style={{ color: category === cat ? '#000' : '#fff' }}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ADD BUTTON */}
            <View style={{ marginHorizontal: 20 }}>
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
                marginHorizontal: 20
              }}
            />

            {/* FILTER STAR */}
            <View style={{ marginHorizontal: 20 }}>
              <Button
                title={showStarredOnly ? "Afficher tout" : "⭐ Favoris"}
                onPress={() => setShowStarredOnly(!showStarredOnly)}
              />
            </View>

            {/* CATEGORY FILTER */}
            <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 10 }}>
              {['all', ...categories].map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={{
                    marginRight: 10,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: selectedCategory === cat ? '#fff' : '#555'
                  }}
                >
                  <Text style={{ color: selectedCategory === cat ? '#000' : '#fff' }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }

        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>
            💤 Aucune note
          </Text>
        }

        renderItem={({ item, index }) => {
          if (index > 7) return null;

          return (
            <View
              style={{
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: '#000',
                backgroundColor: 'transparent',
                marginHorizontal: 20
              }}
            >
              <Text style={{ color: 'white', marginBottom: 4 }}>
                {item.starred ? '⭐ ' : ''}
                {item.text}
              </Text>

              <Text style={{ color: '#ccc', fontSize: 12 }}>
                {item.category || 'sans catégorie'}
              </Text>

              <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 8 }}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : 'Date inconnue'}
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
          );
        }}
      />
    </ImageBackground>
  );
}
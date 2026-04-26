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

  const listRef = useRef<FlatList>(null);

  const categories = ['perso', 'travail', 'idées'];

  useEffect(() => {
    const loadNotes = async () => {
      const data = await AsyncStorage.getItem('notes');
      if (data) setNotes(JSON.parse(data));
    };
    loadNotes();
  }, []);

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

  const blockStyle = {
    width: '100%' as const,
    maxWidth: 700,
    alignSelf: 'center' as const
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg2.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* HEADER */}
      <View style={{ paddingBottom: 10 }}>
        <View
          style={{
            ...blockStyle,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 260,
            alignItems: 'center'
          }}
        >
          {/* 🔴 ACCUEIL AGRANDI x2 */}
          <TouchableOpacity
            onPress={() => router.push('/home')}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                color: 'red',
                fontSize: 32, // 🔥 x2
                fontWeight: '600'
              }}
            >
              Accueil
            </Text>
          </TouchableOpacity>

          <Text style={{ color: '#000', fontSize: 24 }}>Notes</Text>
        </View>

        <View style={{ height: 100 }} />

        {/* INPUT */}
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Écris une note..."
          style={{
            ...blockStyle,
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10
          }}
        />

        {/* CATEGORIES */}
        <View style={{ ...blockStyle, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={{
                  marginRight: 10,
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor: category === cat ? '#ddd' : '#aaa'
                }}
              >
                <Text style={{ color: '#000' }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ADD */}
        <View style={blockStyle}>
          <Button title={editingId ? "Modifier" : "Ajouter"} onPress={saveNote} />
        </View>

        <View style={{ height: 10 }} />

        {/* SEARCH */}
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="🔎 Rechercher..."
          style={{
            ...blockStyle,
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10
          }}
        />

        {/* FILTER */}
        <View style={blockStyle}>
          <Button
            title={showStarredOnly ? "Tout" : "⭐ Favoris"}
            onPress={() => setShowStarredOnly(!showStarredOnly)}
          />
        </View>

        <View style={{ height: 30 }} />
      </View>

      {/* LISTE */}
      <FlatList
        ref={listRef}
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        style={{ maxHeight: 720 }}
        renderItem={({ item }) => (
          <View
            style={{
              ...blockStyle,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderWidth: 2,
              borderColor: '#000'
            }}
          >
            <Text style={{ color: '#000', marginBottom: 8 }}>
              {item.starred ? '⭐ ' : ''}
              {item.text}
            </Text>

            <Text style={{ color: '#222', marginBottom: 2 }}>
              {item.category}
            </Text>

            <Text style={{ color: '#444', fontSize: 12 }}>
              {new Date(item.createdAt || 0).toLocaleString()}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8
              }}
            >
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={{ color: '#000' }}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleStar(item.id)}>
                <Text style={{ color: '#000' }}>
                  {item.starred ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text style={{ color: '#000' }}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ImageBackground>
  );
}
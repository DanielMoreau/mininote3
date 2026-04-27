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

import { useSpacing } from "@/store/useSpacing";

type Note = {
  id: string;
  text: string;
  starred: boolean;
  createdAt?: number;
  category?: string;
};

export default function NotesScreen() {
  const router = useRouter();

  const { space, spaceSmall, text, radius } = useSpacing();

  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('perso');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

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

  const toggleStar = (id: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, starred: !n.starred } : n
      )
    );
  };

  const startEdit = (note: Note) => {
    setInput(note.text);
    setCategory(note.category || 'perso');
    setEditingId(note.id);
  };

  const filteredNotes = notes
    .filter(n => n.text.toLowerCase().includes(search.toLowerCase()))
    .filter(n => !showStarredOnly || n.starred)
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
      <View style={{ paddingBottom: space * 3 }}>

        {/* HEADER */}
        <View style={{
          ...blockStyle,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: space * 2
        }}>
          <Text style={{ fontSize: 24, color: '#000' }}>
            Notes
          </Text>

          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={{ color: 'red' }}>Accueil</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT */}
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Écris une note..."
          style={{
            ...blockStyle,
            backgroundColor: '#fff',
            padding: space,
            borderRadius: radius,
            marginBottom: spaceSmall
          }}
        />

        {/* CATÉGORIES */}
        <View style={{ ...blockStyle, marginBottom: spaceSmall }}>
          <View style={{ flexDirection: 'row' }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={{
                  marginRight: spaceSmall,
                  padding: spaceSmall,
                  borderRadius: radius,
                  backgroundColor: category === cat ? '#ddd' : '#aaa'
                }}
              >
                <Text style={{ color: '#000' }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BOUTON */}
        <View style={blockStyle}>
          <Button
            title={editingId ? 'Modifier' : 'Ajouter'}
            onPress={saveNote}
          />
        </View>

        <View style={{ height: spaceSmall }} />

        {/* RECHERCHE */}
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="🔎 Rechercher..."
          style={{
            ...blockStyle,
            backgroundColor: '#fff',
            padding: space,
            borderRadius: radius,
            marginBottom: spaceSmall
          }}
        />

        {/* FILTRE */}
        <View style={blockStyle}>
          <Button
            title={showStarredOnly ? 'Tout' : '⭐ Favoris'}
            onPress={() => setShowStarredOnly(!showStarredOnly)}
          />
        </View>

        <View style={{ height: space }} />
      </View>

      {/* LISTE */}
      <FlatList
        ref={listRef}
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: space }}>
            Aucune note
          </Text>
        }
        renderItem={({ item }) => (
          <View style={{
            ...blockStyle,
            padding: space,
            borderRadius: radius,
            marginBottom: space,
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderWidth: 2,
            borderColor: '#000'
          }}>
            <Text style={{ color: '#000', marginBottom: spaceSmall }}>
              {item.starred ? '⭐ ' : ''}
              {item.text}
            </Text>

            <Text style={{ color: '#222' }}>{item.category}</Text>

            <Text style={{ color: '#444', fontSize: text - 2 }}>
              {new Date(item.createdAt || 0).toLocaleString()}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: spaceSmall
            }}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleStar(item.id)}>
                <Text>{item.starred ? '⭐' : '☆'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ImageBackground>
  );
}
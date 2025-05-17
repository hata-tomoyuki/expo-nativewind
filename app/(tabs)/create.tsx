import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todos';

export default function Create() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }

    setLoading(true);
    try {
      // 新しいTodoを作成
      const newTodo = {
        id: Date.now(), // 一時的なIDとして現在のタイムスタンプを使用
        title: title.trim(),
        completed: false,
        userId: 1,
      };

      // 既存のTodoを取得
      const storedTodosJson = await AsyncStorage.getItem(STORAGE_KEY);
      const storedTodos = storedTodosJson ? JSON.parse(storedTodosJson) : [];

      // 新しいTodoを追加
      const updatedTodos = [newTodo, ...storedTodos];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));

      Alert.alert('成功', 'Todoを作成しました', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            router.push('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('エラー', 'Todoの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-8 pt-4">新しいTodoを作成</Text>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-2">タイトル</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base"
            value={title}
            onChangeText={setTitle}
            placeholder="Todoのタイトルを入力"
            editable={!loading}
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className={`p-4 rounded-lg mt-6 ${
            loading ? 'bg-blue-300' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white text-center font-bold">
            {loading ? '作成中...' : '作成する'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

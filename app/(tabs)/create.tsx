import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

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
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('作成に失敗しました');
      }

      const data = await response.json();
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
      <Text className="text-2xl font-bold text-center mb-8">新しいTodoを作成</Text>

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

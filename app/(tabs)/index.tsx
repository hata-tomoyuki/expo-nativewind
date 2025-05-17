import { View, FlatList, ActivityIndicator, Text, Pressable } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { TodoItem } from "../components/TodoItem";
import { useRouter, useFocusEffect } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const STORAGE_KEY = '@todos';

export default function Index() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      // APIからデータを取得
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }
      const apiTodos = await response.json();

      // ローカルストレージから保存したTodoを取得
      const storedTodosJson = await AsyncStorage.getItem(STORAGE_KEY);
      const storedTodos = storedTodosJson ? JSON.parse(storedTodosJson) : [];

      // APIのデータとローカルのデータを結合
      setTodos([...storedTodos, ...apiTodos]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 画面がフォーカスされるたびにデータを更新
  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

  const handleTodoPress = (todo: Todo) => {
    router.push({
      pathname: "/todo/[id]" as const,
      params: { id: todo.id, todo: JSON.stringify(todo) }
    });
  };

  const keyExtractor = (item: Todo) => item.id.toString();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-4">
      <Text className="text-2xl font-bold text-center p-4">Todo List</Text>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem item={item} onPress={() => handleTodoPress(item)} />
        )}
        keyExtractor={keyExtractor}
        className="flex-1"
      />
    </View>
  );
}

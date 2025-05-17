import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useEffect, useState } from "react";
import { TodoItem } from "../components/TodoItem";
import { useRouter } from "expo-router";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export default function Index() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

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

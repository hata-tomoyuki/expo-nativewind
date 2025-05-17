import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export default function TodoDetail() {
  const { id, todo: todoParam } = useLocalSearchParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (todoParam) {
      // パラメータから渡されたデータを使用
      setTodo(JSON.parse(todoParam as string));
      setLoading(false);
    } else {
      // パラメータがない場合はAPIから取得
      fetchTodoDetail();
    }
  }, [id, todoParam]);

  const fetchTodoDetail = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }
      const data = await response.json();
      setTodo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (error || !todo) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">{error || 'Todoが見つかりません'}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4 pt-4">Todo詳細</Text>
        <View className="bg-white rounded-lg shadow-sm p-6">
          <View className="flex-row items-center mb-4">
            <View
              className={`w-5 h-5 rounded-full mr-3 ${
                todo.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <Text className="text-lg font-semibold">
              {todo.completed ? '完了' : '未完了'}
            </Text>
          </View>
          <Text className="text-2xl font-bold mb-4">{todo.title}</Text>
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-gray-600">ユーザーID: {todo.userId}</Text>
            <Text className="text-gray-600">Todo ID: {todo.id}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => router.back()} className="p-4 bg-blue-500 rounded-lg m-4">
        <Text className="text-white text-center text-lg">戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

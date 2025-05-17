import { View, Text } from 'react-native';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  item: Todo;
}

export const TodoItem = ({ item }: TodoItemProps) => {
  return (
    <View className="p-4 border-b border-gray-200">
      <View className="flex-row items-center">
        <View
          className={`w-5 h-5 rounded-full mr-3 ${
            item.completed ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
        <Text
          className={`flex-1 text-base ${
            item.completed ? 'text-gray-500 line-through' : 'text-gray-800'
          }`}
        >
          {item.title}
        </Text>
      </View>
    </View>
  );
};

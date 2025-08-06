import { Link } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function WorkoutListItem({}) {
  return (
    <Link href={`/workout/123`} asChild>
      <TouchableOpacity>
        <Text>Workout Title</Text>
        <Text>Workout Discipline</Text>
      </TouchableOpacity>
    </Link>
  );
}
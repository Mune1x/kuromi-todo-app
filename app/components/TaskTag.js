import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/color';

const TaskTag = ({ tag }) => {
  // Determine tag color based on tag name
  const getTagColor = () => {
    switch (tag.toLowerCase()) {
      case 'work':
        return '#6C8EBF'; // blue
      case 'personal':
        return '#9673A6'; // purple
      case 'urgent':
        return '#FF6B6B'; // red
      case 'client':
        return '#D79B00'; // orange
      case 'shopping':
        return '#60A917'; // green
      case 'health':
        return '#E83E8C'; // pink
      case 'study':
        return '#6C757D'; // gray
      case 'finance':
        return '#17A2B8'; // teal
      default:
        // Generate a consistent color based on the tag string
        const hash = Array.from(tag).reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 70%)`;
    }
  };

  return (
    <View style={[styles.tagContainer, { backgroundColor: getTagColor() + '30' }]}>
      <Text style={[styles.tagText, { color: getTagColor() }]}>#{tag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  }
});

export default TaskTag;
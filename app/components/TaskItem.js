import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/color';
import TaskTag from './TaskTag';

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  onTogglePriority,
  onLongPress
}) => {
  const [animatedValue] = useState(new Animated.Value(1));
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.yellow;
      case 'low':
        return Colors.green;
      default:
        return Colors.lightGray;
    }
  };

  const handleComplete = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start(() => {
      onToggleComplete(task.id);
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Extract the task priority from the task
  const priorityLabel = task.priority === 'high' ? 'high priority' : 
                         task.priority === 'medium' ? 'medium priority' : 
                         task.priority === 'low' ? 'low priority' : '';
  
  // Extract tags from the task (if they exist)
  const tags = task.tags || [];
  
  // Add placeholder tags based on task attributes for the mockup
  if (priorityLabel && !tags.includes(priorityLabel)) {
    tags.push(priorityLabel);
  }
  
  if (task.category && !tags.includes(task.category)) {
    tags.push(task.category);
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: animatedValue }] },
        task.priority === 'high' && styles.highPriorityContainer
      ]}
      onLongPress={onLongPress}
    >
      <View style={styles.leftSection}>
        <TouchableOpacity 
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]} 
          onPress={handleComplete}
        >
          {task.completed && (
            <MaterialIcons name="check" size={18} color={Colors.white} />
          )}
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <Text style={[
            styles.title, 
            task.completed && styles.completedText
          ]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={[
              styles.description, 
              task.completed && styles.completedText
            ]} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          
          {/* Tags section */}
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TaskTag key={index} tag={tag} />
              ))}
            </View>
          )}
          
          <View style={styles.taskMeta}>
            {task.dueDate && (
              <View style={styles.meta}>
                <MaterialCommunityIcons 
                  name="calendar" 
                  size={14} 
                  color={Colors.gray} 
                />
                <Text style={styles.metaText}>{formatDate(task.dueDate)}</Text>
              </View>
            )}
            {task.dueDate && (
              <View style={styles.meta}>
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={14} 
                  color={Colors.gray} 
                />
                <Text style={styles.metaText}>{formatTime(task.dueDate)}</Text>
              </View>
            )}
            {task.reminder && (
              <View style={styles.meta}>
                <MaterialCommunityIcons 
                  name="bell" 
                  size={14} 
                  color={Colors.gray} 
                />
                <Text style={styles.metaText}>{formatTime(task.reminder)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => onEdit(task)}>
          <MaterialIcons name="edit" size={20} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)}>
          <MaterialIcons name="delete" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highPriorityContainer: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.red,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary,
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.lightGray,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.lightGray,
  },
});

export default TaskItem;
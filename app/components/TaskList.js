import React, { useRef } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import DraggableList from './DraggableList';

import TaskItem from './TaskItem';
import SwipeableItem from './SwipeableItem';
import Colors from '../constants/color';

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onDelete, 
  onEdit, 
  onReorder,
  onTogglePriority,
  renderRightActions
}) => {
  const listRef = useRef(null);
  
  const renderItem = ({ item, drag, isActive }) => {
    return (
      <SwipeableItem
        renderRightActions={() => renderRightActions(item)}
        key={item.id}
      >
        <TaskItem
          task={item}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onTogglePriority={onTogglePriority}
          onLongPress={drag}
          isActive={isActive}
        />
      </SwipeableItem>
    );
  };

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks yet! Add your first task.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <DraggableList
        ref={listRef}
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => onReorder(data)}
        activationDistance={20}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default TaskList;
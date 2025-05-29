import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Animated,
  Image,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Dashboard from '../components/Dashboard';
import TabNavigator from '../components/TabNavigator';
import CalendarView from '../components/CalendarView';
import AnalyticsView from '../components/AnalyticsView';
import Colors from '../constants/color';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed
  const [filterPriority, setFilterPriority] = useState('all'); // all, low, medium, high
  const [searchBarAnim] = useState(new Animated.Value(0));
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleSaveTask = (taskData) => {
    let updatedTasks;

    if (editingTask) {
      // Update existing task
      updatedTasks = tasks.map((task) => 
        task.id === taskData.id ? taskData : task
      );
    } else {
      // Add new task
      updatedTasks = [...tasks, taskData];
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleTogglePriority = (taskId) => {
    const priorities = ['none', 'low', 'medium', 'high'];
    
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const currentIndex = priorities.indexOf(task.priority || 'none');
        const nextIndex = (currentIndex + 1) % priorities.length;
        return { ...task, priority: priorities[nextIndex] };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleReorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
    saveTasks(reorderedTasks);
  };

  const toggleSearchBar = () => {
    const toValue = isSearchVisible ? 0 : 1;
    
    Animated.timing(searchBarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  // Filter tasks based on search, status and priority
  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !task.completed) ||
                         (filterStatus === 'completed' && task.completed);
    
    // Filter by priority
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderRightActions = (task) => {
    return (
      <View style={styles.rightActions}>
        <RectButton
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          onPress={() => handleEditTask(task)}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </RectButton>
        <RectButton
          style={[styles.actionButton, { backgroundColor: Colors.red }]}
          onPress={() => handleDeleteTask(task.id)}
        >
          <MaterialIcons name="delete" size={24} color="white" />
        </RectButton>
      </View>
    );
  };

  const renderTasksView = () => (
    <>
      <Animated.View style={[
        styles.searchContainer, 
        { 
          maxHeight: searchBarAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 60]
          }),
          opacity: searchBarAnim,
          marginBottom: searchBarAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 10]
          })
        }
      ]}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.gray}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color={Colors.gray} />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
      
      <View style={styles.taskActionsContainer}>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'all' && styles.filterTextActive
              ]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'active' && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus('active')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'active' && styles.filterTextActive
              ]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'completed' && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus('completed')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'completed' && styles.filterTextActive
              ]}>Completed</Text>
            </TouchableOpacity>
            
            <View style={styles.filterDivider} />
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterPriority === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterPriority('all')}
            >
              <Text style={[
                styles.filterText,
                filterPriority === 'all' && styles.filterTextActive
              ]}>All Priorities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterPriority === 'high' && styles.filterButtonActive,
                filterPriority === 'high' && { backgroundColor: Colors.red + '20' }
              ]}
              onPress={() => setFilterPriority('high')}
            >
              <View style={styles.priorityFilterContent}>
                <View style={[styles.priorityDot, { backgroundColor: Colors.red }]} />
                <Text style={[
                  styles.filterText,
                  filterPriority === 'high' && { color: Colors.red }
                ]}>High</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterPriority === 'medium' && styles.filterButtonActive,
                filterPriority === 'medium' && { backgroundColor: Colors.yellow + '20' }
              ]}
              onPress={() => setFilterPriority('medium')}
            >
              <View style={styles.priorityFilterContent}>
                <View style={[styles.priorityDot, { backgroundColor: Colors.yellow }]} />
                <Text style={[
                  styles.filterText,
                  filterPriority === 'medium' && { color: Colors.yellow }
                ]}>Medium</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterPriority === 'low' && styles.filterButtonActive,
                filterPriority === 'low' && { backgroundColor: Colors.green + '20' }
              ]}
              onPress={() => setFilterPriority('low')}
            >
              <View style={styles.priorityFilterContent}>
                <View style={[styles.priorityDot, { backgroundColor: Colors.green }]} />
                <Text style={[
                  styles.filterText,
                  filterPriority === 'low' && { color: Colors.green }
                ]}>Low</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={toggleSearchBar}
        >
          <MaterialIcons name={isSearchVisible ? "close" : "search"} size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          onReorder={handleReorderTasks}
          onTogglePriority={handleTogglePriority}
          renderRightActions={renderRightActions}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBackground}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image
              source={require('../assets/kuromi_icon.png')}
              style={styles.kuromiIcon}
              resizeMode="contain"
            />
            <Text style={styles.title}>Kuromi Tasks</Text>
            <Text style={styles.subtitle}>Stay organized with style! ✨</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="settings" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        
        <Dashboard tasks={tasks} />
      </LinearGradient>
      
      <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'tasks' && renderTasksView()}
      
      {activeTab === 'calendar' && (
        <CalendarView tasks={tasks} />
      )}
      
      {activeTab === 'analytics' && (
        <AnalyticsView tasks={tasks} />
      )}
      
      <TaskForm
        isVisible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSave={handleSaveTask}
        editTask={editingTask}
      />
      
      {activeTab === 'tasks' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddTask}
        >
          <MaterialIcons name="add" size={30} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackground: {
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  kuromiIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
  },
  taskActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginRight: 15,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.lightGray + '50',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  filterContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray + '50',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.gray,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  filterDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 10,
  },
  priorityFilterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rightActions: {
    width: 124,
    flexDirection: 'row',
  },
  actionButton: {
    width: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
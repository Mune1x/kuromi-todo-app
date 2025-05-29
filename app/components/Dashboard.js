import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/color';

const StatCard = ({ number, label, gradientColors }) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.statCard}
    >
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );
};

const Dashboard = ({ tasks = [] }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Count tasks due today
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }).length;
  
  // Count overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < new Date() && dueDate.toDateString() !== new Date().toDateString();
  }).length;
  
  return (
    <View style={styles.container}>
      <StatCard 
        number={totalTasks} 
        label="Total" 
        gradientColors={[Colors.primary, Colors.secondary]}
      />
      <StatCard 
        number={completedTasks} 
        label="Done" 
        gradientColors={[Colors.secondary, Colors.accent]}
      />
      <StatCard 
        number={todayTasks} 
        label="Today" 
        gradientColors={[Colors.accent, Colors.secondary]}
      />
      <StatCard 
        number={overdueTasks} 
        label="Overdue" 
        gradientColors={[Colors.secondary, Colors.primary]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.white,
  }
});

export default Dashboard;
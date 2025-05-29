import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnalyticsView = ({ tasks }) => {
  const [completionRate, setCompletionRate] = useState(0);
  const [tasksByPriority, setTasksByPriority] = useState({
    high: 0,
    medium: 0,
    low: 0,
    none: 0
  });
  const [tasksByStatus, setTasksByStatus] = useState({
    completed: 0,
    inProgress: 0,
    overdue: 0
  });
  const [weeklyCompletion, setWeeklyCompletion] = useState([0, 0, 0, 0, 0, 0, 0]);
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Calculate completion rate
      const completed = tasks.filter(task => task.completed).length;
      setCompletionRate(Math.round((completed / tasks.length) * 100));

      // Calculate tasks by priority
      const priorityCounts = {
        high: 0,
        medium: 0,
        low: 0,
        none: 0
      };
      
      tasks.forEach(task => {
        const priority = task.priority || 'none';
        priorityCounts[priority]++;
      });
      
      setTasksByPriority(priorityCounts);

      // Calculate tasks by status
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const statusCounts = {
        completed: completed,
        inProgress: 0,
        overdue: 0
      };

      tasks.forEach(task => {
        if (task.completed) return; // Already counted
        
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          
          if (dueDate < today) {
            statusCounts.overdue++;
          } else {
            statusCounts.inProgress++;
          }
        } else {
          statusCounts.inProgress++;
        }
      });
      
      setTasksByStatus(statusCounts);

      // Calculate weekly completion
      const weekDays = [0, 1, 2, 3, 4, 5, 6]; // 0 is Sunday
      const weeklyStats = [0, 0, 0, 0, 0, 0, 0];
      
      tasks.forEach(task => {
        if (task.completed && task.updatedAt) {
          const completedDate = new Date(task.updatedAt);
          const dayOfWeek = completedDate.getDay(); // 0-6
          weeklyStats[dayOfWeek]++;
        }
      });
      
      setWeeklyCompletion(weeklyStats);
    }
  }, [tasks]);
  const renderProgressBar = (value, maxValue, color) => {
    const percentage = maxValue > 0 ? Math.min(Math.round((value / maxValue) * 100), 100) : 0;
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };

  const renderWeeklyChart = () => {
    const maxValue = Math.max(...weeklyCompletion, 1);
    
    return (
      <View style={styles.weeklyChartContainer}>
        {weeklyCompletion.map((value, index) => {
          const height = (value / maxValue) * 100;
          const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index];
          const isToday = new Date().getDay() === index;
          
          return (
            <View key={index} style={styles.barColumn}>
              <View style={[
                styles.barContainer, 
                { height: '100%' }
              ]}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${height}%`,
                      backgroundColor: isToday ? Colors.primary : Colors.secondary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.barLabel, isToday && { color: Colors.primary }]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return Colors.red;
      case 'medium': return Colors.yellow;
      case 'low': return Colors.green;
      default: return Colors.lightGray;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="pie-chart" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Task Completion</Text>
        </View>
        
        <View style={styles.completionStats}>
          <View style={styles.completionCircle}>
            <Text style={styles.completionRate}>{completionRate}%</Text>
            <Text style={styles.completionLabel}>Completion Rate</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{tasksByStatus.completed}</Text>
            {renderProgressBar(tasksByStatus.completed, tasks.length, Colors.green)}
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statLabel}>In Progress</Text>
            <Text style={styles.statValue}>{tasksByStatus.inProgress}</Text>
            {renderProgressBar(tasksByStatus.inProgress, tasks.length, Colors.yellow)}
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Overdue</Text>
            <Text style={styles.statValue}>{tasksByStatus.overdue}</Text>
            {renderProgressBar(tasksByStatus.overdue, tasks.length, Colors.red)}
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="flag" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Tasks by Priority</Text>
        </View>
        
        <View style={styles.priorityStats}>
          {Object.entries(tasksByPriority).map(([priority, count]) => (
            <View key={priority} style={styles.priorityStat}>
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(priority) }]} />
              <Text style={styles.priorityLabel}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
              <Text style={styles.priorityCount}>{count}</Text>
              {renderProgressBar(count, tasks.length, getPriorityColor(priority))}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="bar-chart" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
        </View>
        
        <View style={styles.chartContainer}>
          {renderWeeklyChart()}
        </View>
        
        <Text style={styles.chartDescription}>
          Tasks completed per day this week
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginLeft: 8,
  },
  completionStats: {
    alignItems: 'center',
    marginVertical: 15,
  },
  completionCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  completionRate: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  completionLabel: {
    fontSize: 12,
    color: Colors.gray,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  stat: {
    flex: 1,
    paddingHorizontal: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.lightGray + '40',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  priorityStats: {
    marginTop: 5,
  },
  priorityStat: {
    marginBottom: 12,
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    left: 0,
    top: 3,
  },
  priorityLabel: {
    fontSize: 14,
    color: Colors.dark,
    marginLeft: 18,
    marginBottom: 5,
  },
  priorityCount: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  chartContainer: {
    height: 180,
    marginVertical: 10,
  },
  weeklyChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: 20,
    paddingBottom: 10,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barContainer: {
    width: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 5,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 5,
  },
  chartDescription: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 10,
  }
});

export default AnalyticsView;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/color';

const CalendarView = ({ tasks = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [tasksOnSelectedDay, setTasksOnSelectedDay] = useState([]);

  // Generate calendar days for the current month
  useEffect(() => {
    const days = generateCalendarDays(selectedDate);
    setCalendarDays(days);
  }, [selectedDate]);

  // Filter tasks for selected date
  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === selectedDate.getDate() &&
        dueDate.getMonth() === selectedDate.getMonth() &&
        dueDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    setTasksOnSelectedDay(filteredTasks);
  }, [tasks, selectedDate]);

  const generateCalendarDays = (date) => {
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add days from previous month to fill the first week
    const dayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
    for (let i = dayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        hasTask: hasTasksOnDate(tasks, prevDate),
      });
    }

    // Add all days of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: isToday(currentDate),
        hasTask: hasTasksOnDate(tasks, currentDate),
      });
    }

    // Add days from next month to fill the last week
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({
          date: nextDate,
          isCurrentMonth: false,
          hasTask: hasTasksOnDate(tasks, nextDate),
        });
      }
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hasTasksOnDate = (tasks, date) => {
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === date.getDate() &&
        dueDate.getMonth() === date.getMonth() &&
        dueDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const selectDay = (day) => {
    setSelectedDate(day.date);
  };

  const renderCalendarDay = ({ item }) => {
    const isSelected = 
      item.date.getDate() === selectedDate.getDate() && 
      item.date.getMonth() === selectedDate.getMonth() &&
      item.date.getFullYear() === selectedDate.getFullYear();
    
    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          !item.isCurrentMonth && styles.otherMonthDay,
          isSelected && styles.selectedDay,
          item.isToday && styles.today
        ]}
        onPress={() => selectDay(item)}
      >
        <Text style={[
          styles.dayText,
          !item.isCurrentMonth && styles.otherMonthDayText,
          isSelected && styles.selectedDayText,
          item.isToday && styles.todayText
        ]}>
          {item.date.getDate()}
        </Text>
        {item.hasTask && !isSelected && <View style={styles.taskDot} />}
      </TouchableOpacity>
    );
  };

  const renderTask = ({ item }) => {
    return (
      <View style={styles.taskItem}>
        <View style={[styles.taskPriorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
        <View style={styles.taskDetails}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.dueDate && (
            <View style={styles.taskMetaInfo}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.gray} />
              <Text style={styles.taskMetaText}>
                {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  // Format the month and year display
  const monthYearString = selectedDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  // Get day name for selected date
  const dayNameString = selectedDate.toLocaleString('default', {
    weekday: 'long'
  });

  // Format the day display
  const dayString = selectedDate.getDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth(-1)}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{monthYearString}</Text>
        <TouchableOpacity onPress={() => navigateMonth(1)}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayHeader}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>

      <FlatList
        data={calendarDays}
        renderItem={renderCalendarDay}
        numColumns={7}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />

      <View style={styles.selectedDateInfo}>
        <View style={styles.selectedDateHeader}>
          <Text style={styles.dayNameText}>{dayNameString}</Text>
          <Text style={styles.dayText}>{dayString}</Text>
        </View>
        
        {tasksOnSelectedDay.length === 0 ? (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No tasks scheduled for this day</Text>
          </View>
        ) : (
          <FlatList
            data={tasksOnSelectedDay}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tasksList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 15,
    margin: 15,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray + '30',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  weekdayHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray + '30',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray,
  },
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    color: Colors.dark,
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: Colors.gray,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
  },
  todayText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  taskDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  selectedDateInfo: {
    marginTop: 10,
    padding: 15,
    flex: 1,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 10,
  },
  tasksList: {
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskPriorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    marginBottom: 5,
  },
  taskMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskMetaText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 4,
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    color: Colors.gray,
    fontSize: 14,
  }
});

export default CalendarView;
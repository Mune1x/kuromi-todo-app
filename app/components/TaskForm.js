import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/color';

const TaskForm = ({ 
  isVisible, 
  onClose, 
  onSave, 
  editTask = null 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('none');
  const [dueDate, setDueDate] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateType, setDateType] = useState('due'); // 'due' or 'reminder'
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setPriority(editTask.priority || 'none');
      setDueDate(editTask.dueDate ? new Date(editTask.dueDate) : null);
      setReminder(editTask.reminder ? new Date(editTask.reminder) : null);
      setIsRecurring(editTask.isRecurring || false);
      setRecurrencePattern(editTask.recurrencePattern || 'daily');
      setNotes(editTask.notes || '');
      setTags(editTask.tags || []);
    } else {
      resetForm();
    }
  }, [editTask, isVisible]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('none');
    setDueDate(null);
    setReminder(null);
    setIsRecurring(false);
    setRecurrencePattern('daily');
    setNotes('');
    setTags([]);
    setNewTag('');
  };
  
  const handleSave = () => {
    if (!title.trim()) {
      // You can add validation feedback here
      return;
    }
    
    const taskData = {
      id: editTask ? editTask.id : Date.now().toString(),
      title,
      description,
      priority,
      completed: editTask ? editTask.completed : false,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminder: reminder ? reminder.toISOString() : null,
      isRecurring,
      recurrencePattern,
      notes,
      tags,
      category: tags.length > 0 ? tags[0] : null,
      createdAt: editTask ? editTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(taskData);
    onClose();
    if (!editTask) {
      resetForm();
    }
  };
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (dateType === 'due' ? dueDate : reminder);
    setShowDatePicker(Platform.OS === 'ios');
    
    if (dateType === 'due') {
      setDueDate(currentDate);
    } else {
      setReminder(currentDate);
    }
    
    // If on Android, show time picker after selecting date
    if (Platform.OS === 'android' && selectedDate) {
      setShowTimePicker(true);
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedTime) {
      const currentDate = dateType === 'due' ? dueDate : reminder;
      if (currentDate) {
        const updatedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        );
        
        if (dateType === 'due') {
          setDueDate(updatedDate);
        } else {
          setReminder(updatedDate);
        }
      }
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const showDateTimePicker = (type) => {
    setDateType(type);
    setShowDatePicker(true);
  };

  const getPriorityColor = () => {
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
  
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editTask ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <TextInput
              style={styles.titleInput}
              placeholder="Task title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={Colors.gray}
              autoFocus={!editTask}
            />
            
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={Colors.gray}
              multiline={true}
            />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['none', 'low', 'medium', 'high'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && { 
                        borderColor: p === 'none' ? Colors.gray : getPriorityColor(),
                        backgroundColor: p === 'none' ? Colors.white : getPriorityColor() + '20',
                      }
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[
                      styles.priorityText,
                      priority === p && { 
                        color: p === 'none' ? Colors.gray : getPriorityColor() 
                      }
                    ]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add tag e.g. work, personal"
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholderTextColor={Colors.gray}
                  onSubmitEditing={addTag}
                />
                <TouchableOpacity 
                  style={styles.addTagButton}
                  onPress={addTag}
                >
                  <MaterialIcons name="add" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(tag)}>
                        <MaterialIcons name="close" size={16} color={Colors.primary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Due Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => showDateTimePicker('due')}
              >
                <MaterialCommunityIcons name="calendar" size={20} color={Colors.primary} />
                <Text style={styles.dateText}>
                  {dueDate ? `${formatDate(dueDate)} at ${formatTime(dueDate)}` : 'Add due date'}
                </Text>
                {dueDate && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setDueDate(null)}
                  >
                    <MaterialIcons name="clear" size={18} color={Colors.gray} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reminder</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => showDateTimePicker('reminder')}
              >
                <MaterialCommunityIcons name="bell" size={20} color={Colors.primary} />
                <Text style={styles.dateText}>
                  {reminder ? `${formatDate(reminder)} at ${formatTime(reminder)}` : 'Add reminder'}
                </Text>
                {reminder && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setReminder(null)}
                  >
                    <MaterialIcons name="clear" size={18} color={Colors.gray} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <Text style={styles.sectionTitle}>Recurring Task</Text>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                  thumbColor={isRecurring ? Colors.primary : Colors.white}
                />
              </View>
              
              {isRecurring && (
                <View style={styles.recurrenceContainer}>
                  {['daily', 'weekly', 'monthly'].map((pattern) => (
                    <TouchableOpacity
                      key={pattern}
                      style={[
                        styles.recurrenceButton,
                        recurrencePattern === pattern && styles.recurrenceButtonActive
                      ]}
                      onPress={() => setRecurrencePattern(pattern)}
                    >
                      <Text style={[
                        styles.recurrenceText,
                        recurrencePattern === pattern && styles.recurrenceTextActive
                      ]}>
                        {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add notes"
                value={notes}
                onChangeText={setNotes}
                placeholderTextColor={Colors.gray}
                multiline={true}
              />
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {editTask ? 'Save Changes' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={dateType === 'due' ? (dueDate || new Date()) : (reminder || new Date())}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        
        {showTimePicker && (
          <DateTimePicker
            value={dateType === 'due' ? (dueDate || new Date()) : (reminder || new Date())}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
  },
  descriptionInput: {
    fontSize: 16,
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    minHeight: 80,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.dark,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  addTagButton: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: Colors.primary,
    marginRight: 6,
    fontSize: 14,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 14,
    color: Colors.gray,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
  },
  dateText: {
    marginLeft: 10,
    flex: 1,
    color: Colors.black,
  },
  clearButton: {
    padding: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurrenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  recurrenceButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  recurrenceButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  recurrenceText: {
    fontSize: 14,
    color: Colors.gray,
  },
  recurrenceTextActive: {
    color: Colors.primary,
  },
  notesInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    minHeight: 80,
  },
  footer: {
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskForm;
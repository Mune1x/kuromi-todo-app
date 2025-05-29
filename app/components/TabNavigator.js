import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/color';

const TabNavigator = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'tasks',
      label: 'Tasks',
      icon: 'check-box',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: 'calendar-today',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'bar-chart',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <MaterialIcons
            name={tab.icon}
            size={22}
            color={activeTab === tab.id ? Colors.primary : Colors.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray + '30',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.gray,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default TabNavigator;
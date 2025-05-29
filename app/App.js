import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import Colors from './constants/color';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.statusBarBackground} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <HomeScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusBarBackground: {
    height: StatusBar.currentHeight,
    backgroundColor: Colors.primary,
  },
});

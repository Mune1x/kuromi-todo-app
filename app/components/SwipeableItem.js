import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const SwipeableItem = forwardRef(({ children, renderRightActions, ...props }, ref) => {
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      {...props}
    >
      <View style={styles.container}>
        {children}
      </View>
    </Swipeable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SwipeableItem;
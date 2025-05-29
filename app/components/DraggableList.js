import React, { forwardRef } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';

const DraggableList = forwardRef((props, ref) => {
  return <DraggableFlatList {...props} />;
});

export default DraggableList;
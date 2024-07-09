import React from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

// Example data array
const data = [
  { id: '1', image: 'https://i.pinimg.com/564x/d0/96/08/d09608783579c448e0212284e203af7a.jpg' },
  { id: '2', image: 'https://i.pinimg.com/564x/80/7b/00/807b009c40d981fb911e97b6cc808cdc.jpg' },
  { id: '3', image: 'https://i.pinimg.com/564x/3a/52/f9/3a52f9c9046a388f8ddc30d4c294932c.jpg' },
  { id: '4', image: 'https://i.pinimg.com/564x/62/01/c2/6201c22ae041c82b84e850c69e5c9323.jpg' },
  { id: '5', image: 'https://i.pinimg.com/736x/ea/27/a1/ea27a1c54fc3d20ffd58cbeadc2c302f.jpg' },
];

// Calculate item width based on screen width
const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const renderItem = ({ item }) => (
  <View style={styles.item}>
    <Image source={{ uri: item.image }} style={styles.image} />
  </View>
);

export default function PostGrid() {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  item: {
    width: itemWidth,
    height: itemWidth,
    margin: 1, // Optional: for a slight gap between images
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
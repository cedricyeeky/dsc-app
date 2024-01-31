import React from 'react';
import { View, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Your content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color if needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
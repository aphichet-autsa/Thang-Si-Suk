import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// คอมโพเนนต์ที่รับไอคอนและข้อความ
const IconButton = ({ icon, text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  iconContainer: {
    backgroundColor: '#BDF21D',
    borderRadius: 50,
    padding: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default IconButton;

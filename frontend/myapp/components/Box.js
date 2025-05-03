import React from 'react';
import { View, StyleSheet } from 'react-native';

const Box = () => {
  return (
    <View style={styles.box}>
      <View style={styles.rectangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 143,
    width: 430,
    justifyContent: 'center',
    alignItems: 'center',
    // คุณสามารถปรับตำแหน่งของ box ได้ที่นี่ถ้าต้องการ
  },
  rectangle: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    height: 143,
    width: 430,
    // สำหรับการจัดการเงาใน iOS
    elevation: 4, // สำหรับ Android
  },
});

export default Box;

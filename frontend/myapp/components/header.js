import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Image source={require('../assets/home-2.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>หน้าแรก</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/shop')}>
        <Image source={require('../assets/shop.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>ร้านรับซื้อ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItemCenter} onPress={() => router.push('/post')}>
        <Image source={require('../assets/plus.png')} style={styles.bottomIconCenter} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
        <Image source={require('../assets/location.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>ร้านใกล้ฉัน</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
        <Image source={require('../assets/test-account.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>ฉัน</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  navItemCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    backgroundColor: '#B7E305', // สีพื้นหลังของปุ่มตรงกลาง
    borderRadius: 30,
    width: 60,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomIconCenter: {
    width: 30,
    height: 30,
  },
});

export default BottomNav;

import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const NavItem = ({ icon, label, onPress, active }) => {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Image source={icon} style={[styles.navIcon, active && styles.navIconActive]} />
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function BottomNav() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNavItemPress = (index, route) => {
    setActiveIndex(index);
    router.push(route);
  };

  return (
    <View style={styles.navBar}>
      <NavItem icon={require('../assets/home-2.png')} label="หน้าแรก" active={activeIndex === 0} onPress={() => handleNavItemPress(0, '/home')} />
      <NavItem icon={require('../assets/shop.png')} label="ร้านรับซื้อ" active={activeIndex === 1} onPress={() => handleNavItemPress(1, '/shop')} />
      <TouchableOpacity style={styles.navItemCenter} onPress={() => handleNavItemPress(2, '/post')}>
        <Image source={require('../assets/plus.png')} style={styles.bottomIconCenter} />
      </TouchableOpacity>
      <NavItem icon={require('../assets/location.png')} label="ร้านใกล้ฉัน" active={activeIndex === 3} onPress={() => handleNavItemPress(3, '/NearShops')} />
      <NavItem icon={require('../assets/test-account.png')} label="ฉัน" active={activeIndex === 4} onPress={() => handleNavItemPress(4, '/ShopProfileScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between', // ใช้ space-between เพื่อให้ระยะห่างระหว่างปุ่มเท่ากัน
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 8,
  },
  navItem: { 
    alignItems: 'center', 
    flex: 1, 
    justifyContent: 'center',
    paddingHorizontal: 8, // เพิ่มระยะห่างระหว่างปุ่ม
  },
  navIcon: { 
    width: 30, 
    height: 30, 
    tintColor: '#000' 
  },
  navIconActive: { 
    tintColor: '#B7E305' 
  },
  navItemCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    backgroundColor: '#fff',
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
    height: 30 
  },
  navLabel: { 
    fontSize: 11, 
    marginTop: 3 
  },
});

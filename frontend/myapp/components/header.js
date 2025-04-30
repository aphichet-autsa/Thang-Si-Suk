import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// ✅ Header ส่วนบน
export function HeaderOnly() {
  return (
    <View style={styles.header}>
      {/* Logo + THANGSISUK */}
      <View style={styles.leftGroup}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>THANGSISUK</Text>
      </View>

      {/* Location + Logout Icons */}
      <View style={styles.rightGroup}>
        <Image source={require('../assets/location.png')} style={styles.icon} />
        <Image source={require('../assets/logout.png')} style={styles.icon} />
      </View>
    </View>
  );
}

// ✅ Bottom Navigation Bar
export function BottomNavOnly() {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Image source={require('../assets/home-2.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>หน้าแรก</Text>
      </TouchableOpacity>

      <View style={styles.navItem}>
        <Image source={require('../assets/shop.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>ร้านรับซื้อ</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Post')}>
        <Image source={require('../assets/plus.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>

      <View style={styles.navItem}>
        <Image source={require('../assets/location.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>ร้านใกล้ฉัน</Text>
      </View>

      <View style={styles.navItem}>
        <Image source={require('../assets/test-account.png')} style={styles.navIcon} />
        <Text style={styles.navLabel}>ฉัน</Text>
      </View>
    </View>
  );
}

// ✅ styles (ก๊อปที่คุณมีอยู่มาใส่ได้เลย)
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#B7E305',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    width: 28,
    height: 28,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 70,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
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
  addButton: {
    backgroundColor: '#B7E305',
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    elevation: 5,
  },
}); 
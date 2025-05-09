import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/header';  // นำเข้า Header Component
import BottomNav from '../components/BottomNav';  // นำเข้า BottomNav Component
import { useRouter } from 'expo-router';  // นำเข้า useRouter

const DonateScreen = () => {
  const router = useRouter(); // ใช้ useRouter แทน navigation

  return (
    <View style={styles.container}>
      <Header />

      {/* Feature Buttons Section */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* เพิ่ม View ครอบปุ่มทั้งหมด */}
        <View style={styles.featureContainer}>
          {/* ใช้ router.push() สำหรับการนำทาง */}
          <FeatureButton title="ร้านรับซื้อ" icon={require('../assets/bg-home.png')} onPress={() => router.push('/shop')} />
          <FeatureButton title="โพสต์ซื้อขาย" icon={require('../assets/excellent.png')} onPress={() => router.push('/lookpost')} />
          <FeatureButton title="บริจาค" icon={require('../assets/fundraising.png')} onPress={() => router.push('/donate')} />
        </View>
      </ScrollView>

      <BottomNav />  {/* เรียกใช้ BottomNav Component */}
    </View>
  );
};

const FeatureButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.featureBtn} onPress={onPress}>
    <Image source={icon} style={styles.featureIcon} />
    <Text style={styles.featureText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 100, // เพื่อให้เนื้อหาจะไม่ทับกับ BottomNav
  },
  featureContainer: {
    backgroundColor: '#fff',  // กำหนดสีพื้นหลังเป็นสีขาว
    borderRadius: 15,         // เพิ่มมุมโค้งมนให้กับพื้นหลัง
    paddingVertical: 20,      // เพิ่มระยะห่างด้านบนและล่างของปุ่ม
    marginTop: 0,            // เอาช่องว่างด้านบนออกให้ชิดกับ Header
    shadowColor: '#000',      // กำหนดสีของเงา
    shadowOffset: { width: 0, height: 4 }, // กำหนดทิศทางของเงา
    shadowOpacity: 0.1,       // กำหนดความโปร่งใสของเงา
    shadowRadius: 6,          // กำหนดความเบลอของเงา
    elevation: 4,             // เพิ่มเงาบนอุปกรณ์ Android
    flexDirection: 'row',     // ทำให้ปุ่มเรียงในแนวนอน
    justifyContent: 'space-around', // กระจายปุ่มให้ห่างกัน
    alignItems: 'center',     // จัดให้อยู่กึ่งกลางในแนวตั้ง
  },
  featureBtn: {
    alignItems: 'center',
    backgroundColor: '#B7E305',
    padding: 10,
    borderRadius: 15,
    width: 90,
  },
  featureIcon: {
    width: 40,
    height: 40,
  },
  featureText: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default DonateScreen;

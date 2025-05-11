import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/header'; 
import BottomNav from '../components/BottomNav'; 

export default function LinkScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>ช่องทางการติดต่อ</Text>

        {/* กรอบสีขาวครอบทั้งหมด */}
        <View style={styles.socialContainer}>
          <View style={styles.socialItem}>
            <Image source={require('../assets/facebook.png')} style={styles.icon} />
            <Text style={styles.socialText}>ชื่อเฟส</Text>
          </View>

          <View style={styles.socialItem}>
            <Image source={require('../assets/line.png')} style={styles.icon} />
            <Text style={styles.socialText}>ไอดีไลน์</Text>
          </View>

          <View style={styles.socialItem}>
            <Image source={require('../assets/instagram.png')} style={styles.icon} />
            <Text style={styles.socialText}>IG:..........</Text>
          </View>

          <View style={styles.socialItem}>
            <Image source={require('../assets/call.png')} style={styles.icon} />
            <Text style={styles.socialText}>เบอร์โทร โทรเลย</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEF19F', // สีพื้นหลังเป็นสีเขียว
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  backBtn: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    marginTop: 1, // ขยับ "ช่องทางการติดต่อ" ขึ้นไป
  },
  socialContainer: {
    width: '50%', // ลดความกว้างของกรอบสีขาว
    alignItems: 'flex-start', // ชิดซ้าย
    backgroundColor: '#fff', // กรอบสีขาวครอบทั้งหมด
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // ไอคอนชิดซ้าย
    marginBottom: 25,
    paddingLeft: 15, // เพิ่มระยะห่างจากขอบ
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 15,
  },
  socialText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 60, // เพิ่มระยะห่างระหว่างบรรทัด
  },
});

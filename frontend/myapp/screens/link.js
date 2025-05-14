import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export default function LinkScreen() {
  const router = useRouter();
  const { uid } = router.query;  // ดึง uid จาก query params
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    if (!uid) {
      console.log("UID is missing!");
      return;
    }

    const fetchContactInfo = async () => {
      const docRef = doc(db, 'Users', uid);  // สมมติว่าข้อมูลผู้ใช้เก็บใน collection "Users"
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContactInfo(docSnap.data());  // กำหนดข้อมูลการติดต่อ
      } else {
        console.log('ไม่พบเอกสาร!');
      }
    };

    fetchContactInfo();
  }, [uid]);

  if (!contactInfo) {
    return <Text>กำลังโหลด...</Text>;  // หรือการแสดงสถานะการโหลด
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>ช่องทางการติดต่อ</Text>

        <View style={styles.socialContainer}>
          <View style={styles.socialItem}>
            <Image source={require('../assets/facebook.png')} style={styles.icon} />
            <Text style={styles.socialText}>{contactInfo.facebook || 'ไม่มีข้อมูล'}</Text>
          </View>

          <View style={styles.socialItem}>
            <Image source={require('../assets/line.png')} style={styles.icon} />
            <Text style={styles.socialText}>{contactInfo.lineId || 'ไม่มีข้อมูล'}</Text>
          </View>

          <View style={styles.socialItem}>
            <Image source={require('../assets/instagram.png')} style={styles.icon} />
            <Text style={styles.socialText}>{contactInfo.instagram || 'ไม่มีข้อมูล'}</Text>
          </View>

          <View style={styles.socialItem}>
            <Image source={require('../assets/call.png')} style={styles.icon} />
            <Text style={styles.socialText}>{contactInfo.phone || 'ไม่มีข้อมูล'}</Text>
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
    backgroundColor: '#DEF19F',  // สีพื้นหลัง
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
  },
  socialContainer: {
    width: '50%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 25,
    paddingLeft: 15,
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
  },
});

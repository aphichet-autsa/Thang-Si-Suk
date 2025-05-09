import React from 'react';
import {
  View, Text, StyleSheet, Image,
  TouchableOpacity, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/header';
import BottomNav from '../components/BottomNav';

export default function NoShopScreen() {
  const router = useRouter();

  const handleGoRegister = () => {
    router.push('/RegisterShopScreen'); // ไปหน้าสมัครร้าน
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>คุณยังไม่ได้สมัครร้านค้า</Text>

        <Image
          source={require('../assets/noshop.png')} // เปลี่ยนเป็นรูปไอคอนห้ามร้านค้าของคุณ
          style={styles.image}
        />

        <Text style={styles.noShopText}>ยังไม่มีร้านค้า</Text>

        <TouchableOpacity style={styles.button} onPress={handleGoRegister}>
          <Text style={styles.buttonText}>สมัครร้านรับซื้อเลย</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
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
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    image: {
      width: 150,
      height: 150,
      marginVertical: 20,
      resizeMode: 'contain',
    },
    noShopText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#5B463D',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 20,
    },
  });
// LookPost.js
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import Header from '../components/header';  // นำเข้า Header
import Box from '../components/Box';  // นำเข้า Box

const LookPost = () => {
  return (
    <View style={styles.screen}>
      <header />  {/* เรียกใช้งาน Header */}

      {/* เนื้อหาโพสต์ */}
      <ScrollView contentContainerStyle={styles.content}>
        <Box />  {/* เรียกใช้งาน Box ที่แสดงข้อความของโพสต์ */}
        
        {/* ข้อมูลโพสต์ */}
        <View style={styles.postContainer}>
          <Text style={styles.postTitle}>ร้านรับซื้อกระดาษลัง</Text>
          <Text style={styles.postDetails}>ต้องการรับกระดาษลัง องค์กรต้องการรับจำนวนมาก ขนาด 20 กก. มาจาก 1 ตัน</Text>
          
          {/* แสดงภาพโพสต์ */}
          <View style={styles.imagesContainer}>
            <Image source={{uri: 'image_url_1'}} style={styles.image} />
            <Image source={{uri: 'image_url_2'}} style={styles.image} />
          </View>
          
          {/* ติดต่อลิงก์ */}
          <Text style={styles.contactButton}>ติดต่อ</Text>
        </View>
      </ScrollView>

      <header />  {/* เรียกใช้งาน BottomNav */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postDetails: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  contactButton: {
    marginTop: 10,
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default LookPost;

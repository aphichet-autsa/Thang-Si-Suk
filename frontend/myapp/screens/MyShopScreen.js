import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // นำเข้า useNavigation
import { HeaderOnly, BottomNavOnly } from '../components/header'; // นำเข้าคอมโพเนนต์

const MyShopScreen = () => {
    const [facebookLink, setFacebookLink] = useState('https://www.facebook.com/');
    const [lineLink, setLineLink] = useState('https://line.me/');
    const [igLink, setIgLink] = useState('https://www.instagram.com/');
    const [phoneLink, setPhoneLink] = useState('tel:+1234567890');
    
    const navigation = useNavigation();  // ใช้ useNavigation

    const handleLinkPress = (url) => {
      Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
    };

    const goBack = () => {
      navigation.goBack();  // ใช้ goBack() เพื่อนำทางกลับไปหน้าก่อนหน้า
    };

  return (
    <View style={styles.container}>
      {/* ดึง Header เข้ามา */}
      <HeaderOnly />
    
      {/* ปุ่มย้อนกลับที่มุมซ้ายบน */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={require('../assets/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image and Name */}
        <Image source={require('../assets/profile.png')} style={styles.profile} />
        <Text style={styles.name}>นายสมปอง หมายปอง</Text>

        {/* Social Media Links with Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => handleLinkPress(facebookLink)}>
            <Image source={require('../assets/facebook.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.socialText}>https://www.facebook.com/</Text>
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => handleLinkPress(lineLink)}>
            <Image source={require('../assets/line.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.socialText}>https://line.me/</Text>
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => handleLinkPress(igLink)}>
            <Image source={require('../assets/instagram.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.socialText}>https://www.instagram.com/</Text>
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => handleLinkPress(phoneLink)}>
            <Image source={require('../assets/call.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.socialText}>โทรเลย</Text>
        </View>

        {/* Shop Section */}
        <View style={styles.sectionRow}>
          <Image source={require('../assets/bg-home.png')} style={styles.sectionImage} />
          <Text style={styles.sectionTitle}>ร้านค้าของฉัน</Text>
        </View>

        {/* Shop Info Form */}
        <TextInput style={styles.input} placeholder="ชื่อร้าน" />
        <TextInput style={styles.input} placeholder="ชื่อเจ้าของร้าน" />
        <TextInput style={styles.input} placeholder="ที่อยู่" />
        <TextInput style={styles.input} placeholder="ตำบล" />
        <TextInput style={styles.input} placeholder="อำเภอ/เขต" />
        <TextInput style={styles.input} placeholder="จังหวัด" />
        <TextInput style={styles.input} placeholder="รหัสไปรษณีย์" />
        <TextInput style={styles.input} placeholder="เบอร์ติดต่อ" />
        <TextInput style={styles.input} placeholder="ปักหมุดที่อยู่" />
        <TextInput style={styles.input} placeholder="รายละเอียดของที่รับ" />

        {/* Image Upload Button */}
        <TouchableOpacity style={styles.uploadBtn}>
          <Text>เพิ่มรูปภาพของคุณ</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.buttonText}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.buttonText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavOnly />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { 
    padding: 20, 
    alignItems: 'center',
    paddingBottom: 100,  // เพิ่ม padding ด้านล่างเพื่อให้ปุ่มไม่ชนกับขอบจอ
  },
  profile: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  sectionRow: {
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'center', 
    marginBottom: 10,  
  },
  sectionImage: {
    width: 50,  
    height: 50, 
    marginRight: 10,  
    resizeMode: 'contain', 
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',  
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15, 
  },
  uploadBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10, 
    paddingHorizontal: 5, 
  },
  cancelBtn: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    flex: 1,  
    marginRight: 10,
  },
  confirmBtn: {
    backgroundColor: '#A3CC01',
    padding: 12,
    borderRadius: 10,
    flex: 1,  
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
    width: 50,  
    height: 50, 
    resizeMode: 'contain',  
  },
  // ปุ่มย้อนกลับที่มุมซ้ายบน
  backButton: {
    position: 'absolute',
    top: 100,  // ให้ปุ่มอยู่ด้านบนสุด
    left: 10,   
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    zIndex: 1,  // ให้ปุ่มอยู่เหนือส่วนอื่น ๆ
  },
  backIcon: {
    width: 30,
    height: 30,  // ขนาดไอคอน
    resizeMode: 'contain',
  },
});

export default MyShopScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config'; // เชื่อม Firebase ของคุณ
import { useRouter } from 'expo-router';
import ImagePickerComponent from '../components/ImagePickerComponent'; // เพิ่ม import คอมโพเนนต์ ImagePickerComponent

export default function RegisterShopScreen() {
  const router = useRouter();

  // ประกาศ state สำหรับจัดเก็บข้อมูลร้านและภาพ
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [pinAddress, setPinAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [province, setProvince] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [detail, setDetail] = useState('');
  const [imageUri, setImageUri] = useState(null); // สำหรับเก็บ URL ของรูปที่เลือก
  const [uploading, setUploading] = useState(false); // สำหรับการแสดงสถานะการอัปโหลด
  const [images, setImages] = useState([]); // เพิ่มตัวแปรสำหรับจัดเก็บภาพ

  // ฟังก์ชันการเลือกภาพจากแกลอรี่
  const handleImagePick = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('คุณต้องให้สิทธิ์การเข้าถึงรูปภาพ');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri); // เก็บ URI ของภาพที่เลือก
    }
  };

  // ฟังก์ชันอัปโหลดภาพไปยัง Cloudinary
  const handleUpload = async () => {
    if (!imageUri) {
      alert("กรุณาเลือกรูปภาพ");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    const fileUri = imageUri;
    const filename = fileUri.split('/').pop();
    const fileExtension = filename.split('.').pop();

    formData.append('file', {
      uri: fileUri,
      name: filename,
      type: `image/${fileExtension}`,
    });
    formData.append('upload_preset', 'unsigned_upload');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dd0ro6iov/image/upload',
        formData
      );

      const imageUrl = response.data.secure_url;

      await addDoc(collection(db, 'shops'), {
        shopName,
        ownerName,
        address,
        district,
        amphoe,
        province,
        zipcode,
        phone,
        category,
        detail,
        pinAddress,
        imageUrl,
        createdAt: new Date()
      });

      Alert.alert('อัปโหลดรูปภาพสำเร็จ');
      setUploading(false);
      router.push('/shop');
    } catch (error) {
      Alert.alert('การอัปโหลดล้มเหลว');
      console.error('Upload error: ', error);
      setUploading(false);
    }
  };

  // ฟังก์ชันการบันทึกข้อมูลร้านค้าที่ Firestore
  const handleSubmit = async () => {
    if (
      !shopName.trim() ||
      !ownerName.trim() ||
      !address.trim() ||
      !pinAddress.trim() ||
      !district.trim() ||
      !amphoe.trim() ||
      !province.trim() ||
      !zipcode.trim() ||
      !phone.trim() ||
      !category.trim() ||
      !detail.trim()
    ) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    handleUpload(); // เมื่อกรอกข้อมูลครบแล้วจะเรียกใช้ฟังก์ชันอัปโหลด
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerText}>THANGSISUK</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/location')}>
            <Image source={require('../assets/location.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Image source={require('../assets/shop.png')} style={styles.shopIcon} />
          <Text style={styles.pageTitle}>ร้านรับซื้อ</Text>
        </View>
        <Text style={styles.subtitle}>กรอกรายละเอียด</Text>

        {/* Image Picker Component */}
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.profileImageBtn} onPress={handleImagePick}>
            <Image source={require('../assets/profile.png')} style={styles.profileImage} />
            <View style={styles.profileImageOverlay}>
              <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <TextInput placeholder="ชื่อร้าน" style={[styles.input, { color: 'black' }]} value={shopName} onChangeText={setShopName} />
        <TextInput placeholder="ชื่อเจ้าของร้าน" style={[styles.input, { color: 'black' }]} value={ownerName} onChangeText={setOwnerName} />
        <TextInput placeholder="ที่อยู่" style={[styles.input, { color: 'black' }]} value={address} onChangeText={setAddress} />
        {/* (Add other input fields here...) */}

        {/* Image Picker Component - Handle multiple images */}
        <ImagePickerComponent images={images} setImages={setImages} />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={{fontWeight: 'bold'}}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Bottom nav items */}
      </View>
    </View>
  );
}

// สไตล์ที่ใช้
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#B7E305' },
  logo: { width: 40, height: 40 },
  headerText: { flex: 1, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  headerIcons: { flexDirection: 'row' },
  icon: { width: 24, height: 24, marginLeft: 10 },
  scrollContainer: { padding: 20, paddingBottom: 30 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 6 },
  shopIcon: { width: 28, height: 28, marginRight: 8 },
  pageTitle: { fontWeight: 'bold', fontSize: 18 },
  subtitle: { textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginVertical: 8 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#222', fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputHalf: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 10, flex: 0.48, borderWidth: 1, borderColor: '#222', fontSize: 15 },
  pinInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  pinIcon: { width: 22, height: 22, marginRight: 6 },
  pinTextInput: { flex: 1, fontSize: 15 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 18,
    columnGap: 40,
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#c4df00',
    padding: 16,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 8,
  },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', paddingVertical: 5, borderTopWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 6 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
  navItemCenter: { alignItems: 'center', justifyContent: 'center', marginTop: -16, flex: 1 },
  bottomIcon: { width: 32, height: 32 },
  bottomIconCenter: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 4, marginBottom: 2 },
  bottomText: { fontSize: 12, textAlign: 'center', marginTop: 2 },
});

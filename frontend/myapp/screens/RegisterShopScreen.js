import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore'; 
import { db } from '../config/firebase-config'; // เชื่อม Firebase ของคุณ
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator'; // สำหรับการปรับขนาดภาพ

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
  const [profileImageUri, setProfileImageUri] = useState(null); // สำหรับเก็บ URI ของภาพโปรไฟล์
  const [shopImageUri, setShopImageUri] = useState(null); // สำหรับเก็บ URI ของภาพร้าน
  const [uploading, setUploading] = useState(false); // สำหรับการแสดงสถานะการอัปโหลด

  // ฟังก์ชันการเลือกภาพจากแกลอรี่
  const handleImagePick = async (type) => {
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

    if (!result.cancelled && result.uri) {
      const { uri } = result;
      // ลดขนาดภาพก่อนเก็บ
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // ปรับขนาดความกว้างเป็น 800px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // ปรับความละเอียด
      );
      
      if (type === 'profile') {
        setProfileImageUri(manipResult.uri); // เก็บ URI ของภาพโปรไฟล์
      } else if (type === 'shop') {
        setShopImageUri(manipResult.uri); // เก็บ URI ของภาพร้าน
      }
    } else {
      alert('ไม่พบภาพที่เลือก');
    }
  };

  const handleUpload = async () => {
    if (!profileImageUri || !shopImageUri) {
      alert("กรุณาเลือกรูปภาพทั้งสองอัน");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    // สำหรับภาพโปรไฟล์
    const profileFileUri = profileImageUri;
    const profileFilename = profileFileUri.split('/').pop();
    const profileFileExtension = profileFilename.split('.').pop();

    formData.append('file', {
      uri: profileFileUri,
      name: profileFilename,
      type: `image/${profileFileExtension}`,
    });
    formData.append('upload_preset', 'shop123'); // ใช้ 'unsigned_upload' Preset

    try {
      const responseProfile = await axios.post(
        'https://api.cloudinary.com/v1_1/dd0ro6iov/image/upload',
        formData
      );

      const profileImageUrl = responseProfile.data.secure_url;
      console.log("Profile image uploaded successfully:", profileImageUrl);  // เพิ่มบรรทัดนี้

      // สำหรับภาพรายละเอียดร้าน
      const shopFileUri = shopImageUri;
      const shopFilename = shopFileUri.split('/').pop();
      const shopFileExtension = shopFilename.split('.').pop();

      formData.append('file', {
        uri: shopFileUri,
        name: shopFilename,
        type: `image/${shopFileExtension}`,
      });

      const responseShop = await axios.post(
        'https://api.cloudinary.com/v1_1/dd0ro6iov/image/upload',
        formData
      );

      const shopImageUrl = responseShop.data.secure_url;
      console.log("Shop image uploaded successfully:", shopImageUrl);  // เพิ่มบรรทัดนี้

      // บันทึกข้อมูลร้านและภาพลงใน Firestore
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
        profileImageUrl, // เก็บ URL ของภาพโปรไฟล์
        shopImageUrl,    // เก็บ URL ของภาพร้าน
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../assets/logo2.png')} style={styles.logo} />
          <Text style={styles.headerText}>THANGSISUK</Text>
        </View>

        {/* Form for shop details */}
        <Text style={styles.subtitle}>กรอกรายละเอียด</Text>

        {/* Profile Image Picker */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.profileImageBtn} onPress={() => handleImagePick('profile')}>
            <Image source={require('../assets/profile.png')} style={styles.profileImage} />
            <View style={styles.profileImageOverlay}>
              <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <TextInput placeholder="ชื่อร้าน" style={styles.input} value={shopName} onChangeText={setShopName} />
        <TextInput placeholder="ชื่อเจ้าของร้าน" style={styles.input} value={ownerName} onChangeText={setOwnerName} />
        <TextInput placeholder="ที่อยู่" style={styles.input} value={address} onChangeText={setAddress} />
        <TextInput placeholder="ตำบล" style={styles.input} value={amphoe} onChangeText={setAmphoe} />
        <TextInput placeholder="อำเภอ" style={styles.input} value={district} onChangeText={setDistrict} />
        <TextInput placeholder="จังหวัด" style={styles.input} value={province} onChangeText={setProvince} />
        <TextInput placeholder="รหัสไปรษณีย์" style={styles.input} value={zipcode} onChangeText={setZipcode} />
        <TextInput placeholder="เบอร์โทรศัพท์" style={styles.input} value={phone} onChangeText={setPhone} />
        <TextInput placeholder="ประเภท" style={styles.input} value={category} onChangeText={setCategory} />
        <TextInput placeholder="รายละเอียด" style={styles.input} value={detail} onChangeText={setDetail} />
        <TextInput placeholder="ที่อยู่ตำแหน่ง (Pin)" style={styles.input} value={pinAddress} onChangeText={setPinAddress} />

        {/* Shop Image Picker */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.shopImageBtn} onPress={() => handleImagePick('shop')}>
            <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
            <Text>อัปโหลดรูปภาพรายละเอียดร้าน</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={{fontWeight: 'bold'}}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#B7E305' },
  logo: { width: 40, height: 40 },
  headerText: { flex: 1, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  scrollContainer: { padding: 20, paddingBottom: 30 },
  subtitle: { textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginVertical: 8 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#222', fontSize: 15 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 20 },
  profileImageBtn: { justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  plusIcon: { width: 30, height: 30 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, columnGap: 40 },
  cancelButton: { backgroundColor: 'white', padding: 16, borderRadius: 12, minWidth: 160, alignItems: 'center' },
  confirmButton: { backgroundColor: '#c4df00', padding: 16, borderRadius: 12, minWidth: 160, alignItems: 'center' },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import Header from '../components/header';
import { getAuth } from 'firebase/auth';

const CLOUD_NAME = 'dd0ro6iov';
const UPLOAD_PRESET = 'imaguser';

export default function RegisterShopScreen() {
  const router = useRouter();

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
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [shopImageUris, setShopImageUris] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const checkIfShopExists = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;

        // Query to check if the user already has a shop
        const q = query(collection(db, 'shops'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          Alert.alert('คุณได้สมัครร้านค้าไปแล้ว', 'คุณไม่สามารถสมัครร้านค้าใหม่ได้');
          router.push('/shop'); // ไปหน้าร้านค้าที่มีอยู่
        }
      }
    };

    checkIfShopExists();
  }, []);

  const handleLocationPick = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      const place = geocode[0];
      const fullAddress = `${place.name || ''} ${place.street || ''} ${place.district || ''} ${place.city || ''} ${place.region || ''}`.trim();
      setPinAddress(fullAddress);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการดึงตำแหน่ง');
      console.error(error);
    }
  };

  const handleImagePick = async (type) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('คุณต้องให้สิทธิ์การเข้าถึงรูปภาพ');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      if (type === 'profile') {
        setProfileImageUri(manipResult.uri);
      } else if (type === 'shop') {
        setShopImageUris(prev => [...prev, manipResult.uri]);
      }
    } else {
      alert('ไม่พบภาพที่เลือก');
    }
  };

  const handleRemoveShopImage = (indexToRemove) => {
    setShopImageUris(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (!profileImageUri || shopImageUris.length === 0) {
      alert("กรุณาเลือกรูปภาพทั้งสองอัน");
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("กรุณาเข้าสู่ระบบก่อนทำการสมัครร้านค้า");
      return;
    }

    const uid = currentUser.uid;

    setUploading(true);
    try {
      const uploadToCloudinary = async (uri) => {
        const formData = new FormData();
        const filename = uri.split('/').pop();
        const fileType = filename.split('.').pop();

        formData.append('file', {
          uri,
          name: filename,
          type: `image/${fileType}`,
        });
        formData.append('upload_preset', 'shop123');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dd0ro6iov/image/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data.secure_url;
      };

      const profileImageUrl = await uploadToCloudinary(profileImageUri);
      const shopImageUrls = await Promise.all(shopImageUris.map(uri => uploadToCloudinary(uri)));

      await addDoc(collection(db, 'shops'), {
        uid, shopName, ownerName, address, district, amphoe, province, zipcode,
        phone, category, detail, pinAddress,
        profileImageUrl, shopImageUrls,
        createdAt: new Date()
      });

      Alert.alert('อัปโหลดรูปภาพสำเร็จ');
      router.push('/shop');
    } catch (error) {
      Alert.alert('การอัปโหลดล้มเหลว');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!shopName || !ownerName || !address || !pinAddress || !district || !amphoe || !province || !zipcode || !phone || !category || !detail) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    handleUpload();
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header />
        <Text style={styles.subtitle}>กรอกรายละเอียด</Text>

        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.profileImageBtn} onPress={() => handleImagePick('profile')}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
            ) : (
              <Image source={require('../assets/profile.png')} style={styles.profileImage} />
            )}
            <View style={styles.profileImageOverlay}>
              <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
            </View>
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity style={styles.pinInputRow} onPress={handleLocationPick}>
          <Image source={require('../assets/location.png')} style={styles.locationIcon} />
          <Text style={styles.pinText}>{pinAddress || 'ที่อยู่ตำแหน่ง (Pin)'}</Text>
        </TouchableOpacity>

        <View style={styles.imageBoxContainer}>
          <TouchableOpacity style={styles.imageBox} onPress={() => handleImagePick('shop')}>
            <Image source={require('../assets/plus.png')} style={styles.imageBoxPlusIcon} />
            <Text style={styles.imageBoxText}>เพิ่มรูปภาพร้านเพิ่มเติม</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {shopImageUris.map((uri, index) => (
              <View key={index} style={styles.shopImageWrapper}>
                <Image source={{ uri }} style={styles.shopImagePreview} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveShopImage(index)}
                >
                  <Text style={styles.removeButtonText}>x</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={{ fontWeight: 'bold' }}>ยกเลิก</Text>
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
  scrollContainer: { padding: 20, paddingBottom: 30 },
  subtitle: { textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginVertical: 8 },
  input: {
    backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
    marginBottom: 10, borderWidth: 1, borderColor: '#222', fontSize: 14,
  },
  imagePickerContainer: { alignItems: 'center', marginBottom: 20 },
  profileImageBtn: { justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImageOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center'
  },
  plusIcon: { width: 30, height: 30 },
  pinInputRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#222',
    borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#f9f9f9'
  },
  locationIcon: { width: 24, height: 24, marginRight: 10 },
  pinText: { color: '#333', fontSize: 14 },
  buttonRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: 16, columnGap: 40
  },
  cancelButton: {
    backgroundColor: 'white', padding: 16, borderRadius: 12,
    minWidth: 160, alignItems: 'center'
  },
  confirmButton: {
    backgroundColor: '#c4df00', padding: 16, borderRadius: 12,
    minWidth: 160, alignItems: 'center'
  },
  imageBoxContainer: { marginVertical: 15 },
  imageBox: {
    width: '100%', height: 100, borderWidth: 2, borderColor: '#ccc',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f9f9f9', overflow: 'hidden'
  },
  imageBoxPlusIcon: { width: 30, height: 30, tintColor: '#888', marginBottom: 5 },
  imageBoxText: { fontSize: 13, color: '#666' },
  shopImagePreview: {
    width: 100, height: 100, borderRadius: 8,
    borderWidth: 1, borderColor: '#ccc', marginRight: 8
  },
  shopImageWrapper: { position: 'relative' },
  removeButton: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: 'red', borderRadius: 10, padding: 2,
    zIndex: 10
  },
  removeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  removeButtonText: {
    color: 'white', fontWeight: 'bold', fontSize: 12
  },
}); 

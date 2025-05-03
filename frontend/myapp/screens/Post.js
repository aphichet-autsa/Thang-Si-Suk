import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ใช้ useNavigation hook จาก react-navigation
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/header';  // นำเข้า Header Component
import BottomNav from '../components/BottomNav';  // นำเข้า BottomNav Component

export default function PostScreen() {
  const navigation = useNavigation(); // ใช้ useNavigation hook
  const [images, setImages] = useState([]); // เก็บภาพที่เลือก
  const [caption, setCaption] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const checkPermissions = async () => {
      // ตรวจสอบสิทธิ์การเข้าถึงกล้อง
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('กรุณาอนุญาตให้ใช้กล้อง');
      } else {
        setHasPermission(true);
      }

      // ตรวจสอบสิทธิ์การเข้าถึงแกลเลอรี
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        alert('กรุณาอนุญาตให้เข้าถึงแกลเลอรี');
      }
    };
    checkPermissions();
  }, []);

  const openCamera = async () => {
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeImages,
      });

      console.log("Camera result:", result); // ตรวจสอบผลลัพธ์จากการถ่ายภาพ
      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);  // ดึง URI จาก assets[0].uri
      } else {
        console.log("ไม่สามารถรับ URI ได้จากกล้อง");
      }
    } else {
      alert('กรุณาอนุญาตให้ใช้กล้อง');
    }
  };

  const openGallery = async () => {
    if (hasPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeImages,
      });

      console.log("Gallery result:", result); // ตรวจสอบผลลัพธ์จากการเลือกภาพ
      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);  // ดึง URI จาก assets[0].uri
      } else {
        console.log("ไม่สามารถรับ URI ได้จากแกลเลอรี");
      }
    } else {
      alert('กรุณาอนุญาตให้เข้าถึงแกลเลอรี');
    }
  };

  const renderImageItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>ไม่มีสิทธิ์เข้าถึงกล้อง</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 🔥 SubHeader */}
      <Header /> {/* เรียกใช้ Header Component */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>{/* ใช้ goBack ของ useNavigation */}
          <Image source={require('../assets/back.png')} style={styles.smallIcon} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>โพสต์</Text>
        {/* ไอคอนกล้องและรูปภาพ */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={openCamera}>
            <Image source={require('../assets/camera.png')} style={styles.smallIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery}>
            <Image source={require('../assets/image.png')} style={styles.smallIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 ScrollView ส่วนกลาง */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.captionInput}
          placeholder="เพิ่มคำบรรยาย..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        {/* แสดงภาพที่เลือก */}
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.imageList}
        />

        {/* เพิ่มตำแหน่ง */}
        <View style={styles.locationRow}>
          <Image source={require('../assets/location.png')} style={styles.locationIcon} />
          <Text style={styles.addLocation}>เพิ่มตำแหน่งของคุณ</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav /> {/* เรียกใช้ BottomNav Component */}
    </View>
  );
}

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#B7E305',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  subHeaderTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  smallIcon: {
    width: 40,
    height: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
    backgroundColor: '#fff',
  },
  captionInput: {
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  imageList: {
    marginTop: 20,
    marginBottom: 15,
  },
  imageContainer: {
    marginRight: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  addLocation: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ededed',
    marginRight: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#B7E305',
    marginLeft: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

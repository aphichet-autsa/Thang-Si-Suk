import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, FlatList, Modal, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; // import expo-location
import MapView, { Marker } from 'react-native-maps'; // For displaying the map
import { HeaderOnly, BottomNavOnly } from '../components/header'; // Import Header and Bottom Navigation

export default function PostScreen() {
  const router = useRouter();
  const [images, setImages] = useState([]); // เก็บภาพที่เลือก
  const [caption, setCaption] = useState('');
  const [hasPermission, setHasPermission] = useState(false); // เปลี่ยนเป็น boolean
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // เลือกภาพที่จะลบหรือแก้ไข
  const [location, setLocation] = useState(null); // เก็บตำแหน่ง
  const [locationName, setLocationName] = useState(''); // เก็บชื่อสถานที่จาก Reverse Geocoding
  const [region, setRegion] = useState(null); // สำหรับการตั้งแผนที่

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

      // ตรวจสอบสิทธิ์การเข้าถึงตำแหน่ง
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        alert('ไม่สามารถเข้าถึงตำแหน่ง');
      }
    };
    checkPermissions();
  }, []);

  const openCamera = async () => {
    if (hasPermission && images.length < 8) { // จำกัดจำนวนภาพไม่เกิน 8
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeImages,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);  // ดึง URI จาก assets[0].uri
      }
    } else {
      alert('กรุณาอนุญาตให้ใช้กล้อง หรือภาพเกินจำนวนที่กำหนด');
    }
  };

  const openGallery = async () => {
    if (hasPermission && images.length < 8) { // จำกัดจำนวนภาพไม่เกิน 8
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeImages,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);  // ดึง URI จาก assets[0].uri
      }
    } else {
      alert('กรุณาอนุญาตให้เข้าถึงแกลเลอรี หรือภาพเกินจำนวนที่กำหนด');
    }
  };

  const getLocation = async () => {
    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation(coords);
    // ตั้งแผนที่ตามตำแหน่งที่ได้รับ
    setRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    const geocode = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    if (geocode.length > 0) {
      const locationData = geocode[0];
      const locationString = `${locationData.city || ''} ${locationData.region || ''} ${locationData.country || ''}`;
      setLocationName(locationString); // เก็บชื่อสถานที่ที่ได้
    }
  };

  const openMap = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      Linking.openURL(url); // เปิด Google Maps เพื่อดูเส้นทาง
    }
  };

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleImagePress(index)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true); // เปิด modal เมื่อกดที่ภาพ
  };

  const handleDeleteImage = () => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== selectedImageIndex)); // ลบภาพที่เลือก
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false); // ปิด modal เมื่อกด Cancel
  };

  const handleSave = () => {
    setModalVisible(false);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>ไม่มีสิทธิ์เข้าถึงกล้อง</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 🔥 Add HeaderOnly component */}
      <HeaderOnly />

      {/* 🔥 SubHeader */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()}>
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
          <TouchableOpacity onPress={getLocation}>
            <Image source={require('../assets/location.png')} style={styles.locationIcon} />
          </TouchableOpacity>
          {location ? (
            <Text style={styles.addLocation}>
              {locationName ? locationName : `ตำแหน่งของคุณ: ${location.latitude}, ${location.longitude}`}
            </Text>
          ) : (
            <Text style={styles.addLocation}>เพิ่มตำแหน่งของคุณ</Text>
          )}
        </View>

        {/* ปุ่มดูเส้นทาง */}
        <View style={styles.locationRow}>
          {location && (
            <TouchableOpacity style={styles.openMapButton} onPress={openMap}>
              <Text style={styles.buttonText}>ดูเส้นทาง</Text>
            </TouchableOpacity>
          )}
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

      {/* Modal สำหรับลบหรือแก้ไขภาพ */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>คุณต้องการทำอะไรกับภาพนี้?</Text>
            <TouchableOpacity onPress={handleDeleteImage}>
              <Text style={styles.modalButton}>ลบภาพ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.modalButton}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔥 Add BottomNavOnly component */}
      <BottomNavOnly />
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
  openMapButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    fontSize: 18,
    color: '#007BFF',
    marginVertical: 10,
  },
});
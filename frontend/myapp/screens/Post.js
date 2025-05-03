import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, FlatList, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { HeaderOnly, BottomNav } from '../components/header';

export default function PostScreen() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('กรุณาอนุญาตให้ใช้กล้อง');
      } else {
        setHasPermission(true);
      }

      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        alert('กรุณาอนุญาตให้เข้าถึงแกลเลอรี');
      }
    };
    checkPermissions();
  }, []);

  const openCamera = async () => {
    if (hasPermission && images.length < 8) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeImages,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } else {
      alert('กรุณาอนุญาตให้ใช้กล้อง หรือภาพเกินจำนวนที่กำหนด');
    }
  };

  const openGallery = async () => {
    if (hasPermission && images.length < 8) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeImages,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } else {
      alert('กรุณาอนุญาตให้เข้าถึงแกลเลอรี หรือภาพเกินจำนวนที่กำหนด');
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
    setModalVisible(true);
  };

  const handleDeleteImage = () => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== selectedImageIndex));
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
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
      <HeaderOnly />

      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/back.png')} style={styles.smallIcon} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>โพสต์ </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={openCamera}>
            <Image source={require('../assets/camera.png')} style={styles.smallIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery}>
            <Image source={require('../assets/image.png')} style={styles.smallIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.captionInput}
          placeholder="เพิ่มคำบรรยาย..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.imageList}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    color: '#000000',
  },
  smallIcon: {
    width: 30,
    height: 30,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 120,
    paddingHorizontal: 10,
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
    color: '#fff',
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

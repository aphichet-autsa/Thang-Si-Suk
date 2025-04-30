import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import ImagePickerComponent from '../components/ImagePickerComponent';
import { HeaderOnly, BottomNavOnly } from '../components/header';

export default function PostScreen() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openCamera = () => setShowCamera(true);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImages(prev => [...prev, photo.uri]);
      setShowCamera(false);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      setImages(prev => [...prev, video.uri]);
      setIsRecording(false);
      setShowCamera(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  if (showCamera) {
    if (hasPermission === null) return <View />;
    if (hasPermission === false) return <Text>ไม่มีสิทธิ์เข้าถึงกล้อง</Text>;

    return (
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraButtons}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.buttonText}>ถ่ายรูป</Text>
            </TouchableOpacity>
            {!isRecording ? (
              <TouchableOpacity style={styles.captureButton} onPress={startRecording}>
                <Text style={styles.buttonText}>เริ่มอัด</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.captureButton, { backgroundColor: 'red' }]} onPress={stopRecording}>
                <Text style={styles.buttonText}>หยุดอัด</Text>
              </TouchableOpacity>
            )}
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 🔥 Header ด้านบน */}
      <HeaderOnly />

      {/* 🔥 SubHeader */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/back.png')} style={styles.smallIcon} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>โพสต์</Text>
        <TouchableOpacity onPress={openCamera}>
          <Image source={require('../assets/camera.png')} style={styles.smallIcon} />
        </TouchableOpacity>
      </View>

      {/* 🔥 ScrollView ส่วนกลาง */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ช่องใส่คำบรรยาย */}
        <TextInput
          style={styles.captionInput}
          placeholder="เพิ่มคำบรรยาย..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        {/* รูปภาพที่เลือก */}
        <View style={styles.imagePickerWrapper}>
          <ImagePickerComponent images={images} setImages={setImages} />
        </View>

        {/* ไอคอน location */}
        <View style={styles.locationRow}>
          <Image source={require('../assets/location.png')} style={styles.locationIcon} />
          <Text style={styles.addLocation}>เพิ่มตำแหน่งของคุณ</Text>
        </View>

        {/* ปุ่ม ยกเลิก / ยืนยัน */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔥 Bottom Navigation Bar */}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  subHeaderTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  smallIcon: {
    width: 40,
    height: 40,
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
  imagePickerWrapper: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtons: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  captureButton: {
    backgroundColor: '#ffffff90',
    padding: 15,
    borderRadius: 10,
  },
});
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraComponent = ({ onPictureTaken }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPictureTaken(photo.uri);  // ส่งรูปภาพกลับไปยังหน้าหลัก
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      onPictureTaken(video.uri);  // ส่งวิดีโอกลับไปยังหน้าหลัก
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>ไม่มีสิทธิ์เข้าถึงกล้อง</Text>;
  }

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
};

const styles = StyleSheet.create({
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraComponent;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/header';
import BottomNav from '../components/BottomNav';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import * as ImagePicker from 'expo-image-picker';

const CLOUD_NAME = 'dd0ro6iov';
const UPLOAD_PRESET = 'imaguser';

const MyShopScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [ig, setIg] = useState('');
  const [igLink, setIgLink] = useState('');
  const [idline, setIdline] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setEmail(data.email || '');
          setFacebook(data.facebook || '');
          setFacebookLink(data.facebooklink || '');
          setIg(data.ig || '');
          setIgLink(data.iglink || '');
          setIdline(data.idline || '');
          setPhoneNumber(data.phoneNumber || '');
          setName(data.name || '');
          setProfileImage(data.profileImageUrl || null);

          const q = query(collection(db, 'shops'), where('uid', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const shopData = querySnapshot.docs[0].data();
            setShop(shopData);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          email,
          facebook,
          facebooklink: facebookLink,
          ig,
          iglink: igLink,
          idline,
          phoneNumber,
          name,
          profileImageUrl: profileImage,
        });
        Alert.alert('สำเร็จ', 'อัปเดตข้อมูลเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้');
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("แจ้งเตือน", "จำเป็นต้องขอสิทธิ์เข้าถึงรูปภาพ");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const cloudUrl = await uploadImageToCloudinary(uri);
      if (cloudUrl) setProfileImage(cloudUrl);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      Alert.alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      return null;
    }
  };

  const goBack = () => {
    router.replace('/home');
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...shop.shopImageUrls];
    updatedImages.splice(index, 1);
    setShop({ ...shop, shopImageUrls: updatedImages });
  };

  const handleAddShopImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const uploadedUrl = await uploadImageToCloudinary(uri);
      if (uploadedUrl) {
        setShop({
          ...shop,
          shopImageUrls: [...(shop.shopImageUrls || []), uploadedUrl],
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={require('../assets/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/profile.png')}
            style={styles.profile}
          />
          <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>ชื่อ</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>อีเมล</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Facebook</Text>
        <TextInput style={styles.input} value={facebook} onChangeText={setFacebook} />

        <Text style={styles.label}>ลิงก์ Facebook</Text>
        <TextInput style={styles.input} value={facebookLink} onChangeText={setFacebookLink} />

        <Text style={styles.label}>Instagram</Text>
        <TextInput style={styles.input} value={ig} onChangeText={setIg} />

        <Text style={styles.label}>ลิงก์ Instagram</Text>
        <TextInput style={styles.input} value={igLink} onChangeText={setIgLink} />

        <Text style={styles.label}>ID Line</Text>
        <TextInput style={styles.input} value={idline} onChangeText={setIdline} />

        <Text style={styles.label}>เบอร์ติดต่อ</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />

    
        {/* ✅ เพิ่ม Section ตรงนี้ */}
        <View style={styles.sectionRow}>
          <Image source={require('../assets/bg-home.png')} style={styles.sectionImage} />
          <Text style={styles.sectionTitle}>ร้านค้าของฉัน</Text>
        </View>

        {shop && (
        <View style={styles.shopBox}>
            <Text style={styles.sectionTitle}>ร้านค้าของฉัน</Text>

            <Text style={styles.label}>ชื่อร้าน</Text>
            <TextInput style={styles.input} value={shop.shopName} onChangeText={(text) => setShop({ ...shop, shopName: text })} />

            <Text style={styles.label}>เจ้าของ</Text>
            <TextInput style={styles.input} value={shop.ownerName} onChangeText={(text) => setShop({ ...shop, ownerName: text })} />

            <Text style={styles.label}>หมวดหมู่</Text>
            <TextInput style={styles.input} value={shop.category} onChangeText={(text) => setShop({ ...shop, category: text })} />

            <Text style={styles.label}>ที่อยู่</Text>
            <TextInput style={styles.input} value={shop.address} onChangeText={(text) => setShop({ ...shop, address: text })} />

            <Text style={styles.label}>อำเภอ</Text>
            <TextInput style={styles.input} value={shop.amphoe} onChangeText={(text) => setShop({ ...shop, amphoe: text })} />

            <Text style={styles.label}>ตำบล</Text>
            <TextInput style={styles.input} value={shop.district} onChangeText={(text) => setShop({ ...shop, district: text })} />

            <Text style={styles.label}>จังหวัด</Text>
            <TextInput style={styles.input} value={shop.province} onChangeText={(text) => setShop({ ...shop, province: text })} />

            <Text style={styles.label}>เบอร์โทร</Text>
            <TextInput style={styles.input} value={shop.phone} onChangeText={(text) => setShop({ ...shop, phone: text })} />

            <Text style={styles.label}>ปักหมุด</Text>
            <TextInput style={styles.input} value={shop.pinAddress} onChangeText={(text) => setShop({ ...shop, pinAddress: text })} />

            <Text style={styles.label}>รายละเอียด</Text>
            <TextInput style={styles.input} value={shop.detail} onChangeText={(text) => setShop({ ...shop, detail: text })} />

            {shop.shopImageUrls && shop.shopImageUrls.map((url, index) => (
            <View key={index} style={{ position: 'relative', marginRight: 10 }}>
            <Image source={{ uri: url }} style={styles.shopImage} />
            <TouchableOpacity
                onPress={() => handleRemoveImage(index)}
                style={styles.removeBtn}
            >
                <Text style={styles.removeText}>X</Text>
            </TouchableOpacity>
            </View>
        ))}

        <TouchableOpacity onPress={handleAddShopImage} style={styles.addImageBtn}>
            <Text style={styles.addImageText}>+ เพิ่มรูปใหม่</Text>
        </TouchableOpacity>

        </View>
        )}
        

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={goBack}>
            <Text style={styles.buttonText}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleUpdate}>
            <Text style={styles.buttonText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 100 },
  profile: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 10 },
  changeImageText: { textAlign: 'center', fontSize: 12, marginTop: 5 },
  label: { fontSize: 13, color: '#666', marginBottom: 4, marginTop: 10 },
  input: { width: '100%', height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginBottom: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  cancelBtn: { backgroundColor: '#eee', padding: 12, borderRadius: 10, flex: 1, marginRight: 10 },
  confirmBtn: { backgroundColor: '#A3CC01', padding: 12, borderRadius: 10, flex: 1 },
  buttonText: { textAlign: 'center', fontWeight: 'bold' },
  backButton: { position: 'absolute', top: 70, left: 10, padding: 10, backgroundColor: '#fff', borderRadius: 50, zIndex: 1 },
  backIcon: { width: 30, height: 30, resizeMode: 'contain' },
  shopBox: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  shopImage: { width: 120, height: 120, borderRadius: 10, marginRight: 10, marginTop: 10 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 20 },
  sectionImage: { width: 50, height: 50, marginRight: 10, resizeMode: 'contain' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addImageBtn: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#ccc',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addImageText: {
    fontSize: 14,
    color: '#000',
  },
});


export default MyShopScreen;

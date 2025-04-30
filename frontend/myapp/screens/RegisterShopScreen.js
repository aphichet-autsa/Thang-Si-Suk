import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useRouter } from 'expo-router';
import ImagePickerComponent from '../components/ImagePickerComponent';

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
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    // Validation: check required fields
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

    try {
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
        imageUrl: 'https://i.ibb.co/y8qzXyZ/user-icon.png',
        createdAt: new Date()
      });
      alert('สมัครร้านสำเร็จแล้ว!');
      router.push('/shop'); // Navigate to shop list page
    } catch (error) {
      console.error('บันทึกไม่สำเร็จ:', error);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerText}>THANGSISUK</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/location')}>
            <Image source={require('../assets/location.png')} style={styles.icon} />
          </TouchableOpacity>
           <TouchableOpacity onPress={() => router.push('/location')}>
              <Image source={require('../assets/logout.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Section Title */}
        <View style={styles.titleRow}>
          <Image source={require('../assets/shop.png')} style={styles.shopIcon} />
          <Text style={styles.pageTitle}>ร้านรับซื้อ</Text>
        </View>
        <Text style={styles.subtitle}>กรอกรายละเอียด</Text>

        {/* Profile Image Upload */}
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.profileImageBtn}>
            <Image source={require('../assets/profile.png')} style={styles.profileImage} />
            <View style={styles.profileImageOverlay}>
              <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <TextInput placeholder="ชื่อร้าน" style={styles.input} value={shopName} onChangeText={setShopName} />
        <TextInput placeholder="ชื่อเจ้าของร้าน" style={styles.input} value={ownerName} onChangeText={setOwnerName} />
        <View style={styles.row}>
          <TextInput placeholder="ที่อยู่" style={styles.inputHalf} value={address} onChangeText={setAddress} />
          <TextInput placeholder="ตำบล" style={styles.inputHalf} value={district} onChangeText={setDistrict} />
        </View>
        <View style={styles.row}>
          <TextInput placeholder="อำเภอ/เขต" style={styles.inputHalf} value={amphoe} onChangeText={setAmphoe} />
          <TextInput placeholder="จังหวัด" style={styles.inputHalf} value={province} onChangeText={setProvince} />
        </View>
        <View style={styles.row}>
          <TextInput placeholder="รหัสไปรษณีย์" style={styles.inputHalf} value={zipcode} onChangeText={setZipcode} keyboardType="numeric" />
          <TextInput placeholder="เบอร์ติดต่อ" style={styles.inputHalf} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        {/* Pin address */}
        <View style={styles.pinInput}>
          <Image source={require('../assets/pin.png')} style={styles.pinIcon} />
          <TextInput
            placeholder="ปักหมุดที่อยู่"
            style={styles.pinTextInput}
            value={pinAddress}
            onChangeText={setPinAddress}
          />
        </View>
        <TextInput placeholder="รายละเอียดของที่รับ" style={styles.input} value={category} onChangeText={setCategory} />
        <TextInput placeholder="รายละเอียดเพิ่มเติม" style={styles.input} value={detail} onChangeText={setDetail} />

        {/* Image Picker */}
        <View style={{ marginVertical: 12 }}>
          <ImagePickerComponent images={images} setImages={setImages} />
        </View>

        {/* Buttons */}
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Image source={require('../assets/home-2.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>หน้าแรก</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/shop')}>
          <Image source={require('../assets/shop.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>ร้านรับซื้อ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter} onPress={() => router.push('/addshop')}>
          <Image source={require('../assets/plus.png')} style={styles.bottomIconCenter} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Image source={require('../assets/location.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>ร้านใกล้ฉัน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Image source={require('../assets/user.png')} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>อื่น</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  imageContainer: { alignItems: 'center', marginBottom: 18 },
  profileImageBtn: { justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#00000', backgroundColor: 'white' },
  profileImageOverlay: { position: 'absolute', width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  plusIcon: { width: 38, height: 38, opacity: 0.7 },
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
  // Bottom Navigation Bar
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', paddingVertical: 5, borderTopWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 6 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
  navItemCenter: { alignItems: 'center', justifyContent: 'center', marginTop: -16, flex: 1 },
  bottomIcon: { width: 32, height: 32 },
  bottomIconCenter: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 4, marginBottom: 2 },
  bottomText: { fontSize: 12, textAlign: 'center', marginTop: 2 },
});

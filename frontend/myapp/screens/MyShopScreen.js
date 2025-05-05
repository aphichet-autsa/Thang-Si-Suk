import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router'; // ใช้ useRouter จาก expo-router
import Header from '../components/header'; // นำเข้าคอมโพเนนต์ HeaderOnly
import BottomNav from '../components/BottomNav'; // นำเข้าคอมโพเนนต์ BottomNavOnly

const MyShopScreen = () => {
    const [facebookLink, setFacebookLink] = useState('https://www.facebook.com/');
    const [lineLink, setLineLink] = useState('https://line.me/');
    const [igLink, setIgLink] = useState('https://www.instagram.com/');
    const [phoneLink, setPhoneLink] = useState('tel:+1234567890');
    
    const [shopName, setShopName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [address, setAddress] = useState('');
    const [subdistrict, setSubdistrict] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [pinLocation, setPinLocation] = useState('');
    const [description, setDescription] = useState('');

    const router = useRouter();  // ใช้ useRouter สำหรับการนำทาง

    // ฟังก์ชันสำหรับการเปิดลิงก์
    const handleLinkPress = (url) => {
        Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
    };

    // ฟังก์ชันย้อนกลับไปยังหน้า ShopProfileScreen
    const goBack = () => {
        router.replace('/home');  // ใช้ navigate เพื่อไปที่ ShopProfileScreen
    };

    return (
        <View style={styles.container}>
            <Header />
            
            {/* ปุ่มย้อนกลับที่มุมซ้ายบน */}
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Image source={require('../assets/back.png')} style={styles.backIcon} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Image and Name */}
                <Image source={require('../assets/profile.png')} style={styles.profile} />
                <Text style={styles.name}>นายสมปอง หมายปอง</Text>

                {/* Social Media Links with Icons */}
                <View style={styles.socialRow}>
                    <TouchableOpacity onPress={() => handleLinkPress(facebookLink)}>
                        <Image source={require('../assets/facebook.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.socialText}>Facebook</Text>
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity onPress={() => handleLinkPress(lineLink)}>
                        <Image source={require('../assets/line.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.socialText}>Line</Text>
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity onPress={() => handleLinkPress(igLink)}>
                        <Image source={require('../assets/instagram.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.socialText}>Instagram</Text>
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity onPress={() => handleLinkPress(phoneLink)}>
                        <Image source={require('../assets/call.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.socialText}>โทรเลย</Text>
                </View>

                {/* Shop Section */}
                <View style={styles.sectionRow}>
                    <Image source={require('../assets/bg-home.png')} style={styles.sectionImage} />
                    <Text style={styles.sectionTitle}>ร้านค้าของฉัน</Text>
                </View>

                {/* Shop Info Form */}
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อร้าน"
                    value={shopName}
                    onChangeText={setShopName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อเจ้าของร้าน"
                    value={ownerName}
                    onChangeText={setOwnerName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ที่อยู่"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ตำบล"
                    value={subdistrict}
                    onChangeText={setSubdistrict}
                />
                <TextInput
                    style={styles.input}
                    placeholder="อำเภอ/เขต"
                    value={district}
                    onChangeText={setDistrict}
                />
                <TextInput
                    style={styles.input}
                    placeholder="จังหวัด"
                    value={province}
                    onChangeText={setProvince}
                />
                <TextInput
                    style={styles.input}
                    placeholder="รหัสไปรษณีย์"
                    value={postalCode}
                    onChangeText={setPostalCode}
                />
                <TextInput
                    style={styles.input}
                    placeholder="เบอร์ติดต่อ"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ปักหมุดที่อยู่"
                    value={pinLocation}
                    onChangeText={setPinLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="รายละเอียดของที่รับ"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Image Upload Button */}
                <TouchableOpacity style={styles.uploadBtn}>
                    <Text>เพิ่มรูปภาพของคุณ</Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelBtn}>
                        <Text style={styles.buttonText}>ยกเลิก</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmBtn}>
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
    content: { padding: 20, alignItems: 'center', paddingBottom: 100 },
    profile: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    name: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
    socialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 10 },
    socialText: { marginLeft: 10, fontSize: 16, color: '#333' },
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    sectionImage: { width: 50, height: 50, marginRight: 10, resizeMode: 'contain' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 10 },
    input: { width: '100%', height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
    uploadBtn: { backgroundColor: '#eee', padding: 10, borderRadius: 8, marginTop: 5, marginBottom: 20, width: '100%', alignItems: 'center' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, paddingHorizontal: 5 },
    cancelBtn: { backgroundColor: '#eee', padding: 12, borderRadius: 10, flex: 1, marginRight: 10 },
    confirmBtn: { backgroundColor: '#A3CC01', padding: 12, borderRadius: 10, flex: 1 },
    buttonText: { textAlign: 'center', fontWeight: 'bold' },
    icon: { width: 50, height: 50, resizeMode: 'contain' },
    backButton: { position: 'absolute', top: 70, left: 10, padding: 10, backgroundColor: '#fff', borderRadius: 50, zIndex: 1 },
    backIcon: { width: 30, height: 30, resizeMode: 'contain' },
});

export default MyShopScreen;
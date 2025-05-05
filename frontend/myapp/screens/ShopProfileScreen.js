import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router'; // ใช้ useRouter จาก expo-router
import Header from '../components/header'; // นำเข้าคอมโพเนนต์ HeaderOnly
import BottomNav from '../components/BottomNav'; // นำเข้าคอมโพเนนต์ BottomNavOnly

// Social Link Component
const SocialLink = ({ title, link, icon }) => (
  <View style={styles.socialRow}>
    <TouchableOpacity onPress={() => Linking.openURL(link)}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
    <Text style={styles.socialText}>{title}</Text>
  </View>
);

// Post Component
const Post = () => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image source={require('../assets/profile.png')} style={styles.postAvatar} />
      <View>
        <Text style={styles.postName}>นายสมปอง หมายปอง</Text>
        <Text style={styles.postLocation}>ขาย🔘 มทส</Text>
      </View>
    </View>
    <Text style={styles.postText}>
      บริการรับของเก่าาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาา
    </Text>
    <Image source={require('../assets/shop_photo1.jpg')} style={styles.postImage} resizeMode="cover" />
    <Text style={styles.contactText}>📞 ติดต่อ</Text>
  </View>
);

const ShopProfileScreen = () => {
  const navigation = useRouter();

  // ฟังก์ชันสำหรับการนำทางไปหน้า MyShopScreen
  const goToMyShopScreen = () => {
    navigation.navigate('MyShopScreen');  // นำทางไปยังหน้า MyShopScreen
  };

  // ฟังก์ชันย้อนกลับ
  const goBack = () => {
    navigation.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* ปุ่มย้อนกลับที่มุมซ้ายบน */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={require('../assets/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* ปุ่มแก้ไขที่มุมขวา */}
      <TouchableOpacity style={styles.editButton} onPress={goToMyShopScreen}>
        <Image source={require('../assets/edit.png')} style={styles.editIcon} />
      </TouchableOpacity>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* ข้อมูลโปรไฟล์ */}
        <View style={styles.profileContainer}>
          <Image source={require('../assets/profile.png')} style={styles.profile} />
          <Text style={styles.name}>นายสมปอง หมายปอง</Text>
        </View>

        {/* ข้อมูล Social */}
        <View style={styles.socialContainer}>
          <SocialLink title="Facebook" link="https://www.facebook.com/" icon={require('../assets/facebook.png')} />
          <SocialLink title="Line" link="https://line.me/" icon={require('../assets/line.png')} />
          <SocialLink title="Instagram" link="https://www.instagram.com/" icon={require('../assets/instagram.png')} />
          <SocialLink title="โทรเลย" link="tel:+1234567890" icon={require('../assets/call.png')} />
        </View>

        {/* ร้านค้าของฉัน */}
        <View style={styles.sectionRow}>
          <Image source={require('../assets/bg-home.png')} style={styles.sectionImage} />
          <Text style={styles.sectionTitle}>ร้านค้าของฉัน</Text>
        </View>

        {/* Post */}
        <Post />
      </ScrollView>

      <BottomNav />  {/* เรียกใช้ BottomNav Component */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center', paddingBottom: 100 },
  profileContainer: { alignItems: 'center', marginBottom: 15 },
  profile: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  socialContainer: { marginBottom: 20, width: '100%', alignItems: 'center' },
  socialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  socialText: { marginLeft: 10, fontSize: 16, color: '#333' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  sectionImage: { width: 50, height: 50, marginRight: 10, resizeMode: 'contain' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 10 },
  icon: { width: 40, height: 40, resizeMode: 'contain' },
  postContainer: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, width: '100%', marginBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: 'bold' },
  postLocation: { fontSize: 12, color: '#777' },
  postText: { marginBottom: 10, fontSize: 14, color: '#333' },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  contactText: { alignSelf: 'flex-end', color: '#007AFF', fontWeight: 'bold' },
  backButton: { position: 'absolute', top: 70, left: 10, zIndex: 1, padding: 10, backgroundColor: '#fff', borderRadius: 50 },
  backIcon: { width: 30, height: 30, resizeMode: 'contain' },
  editButton: { position: 'absolute', top: 70, right: 20, zIndex: 1, padding: 10, backgroundColor: '#fff', borderRadius: 50 },
  editIcon: { width: 30, height: 30, resizeMode: 'contain' },
});

export default ShopProfileScreen;
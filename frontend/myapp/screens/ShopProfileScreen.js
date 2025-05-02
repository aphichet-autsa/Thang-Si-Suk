import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { HeaderOnly, BottomNavOnly } from '../components/header'; // นำเข้าคอมโพเนนต์ HeaderOnly และ BottomNavOnly

// Social Link Component
const SocialLink = ({ title, link }) => (
  <View style={styles.socialRow}>
    <Text>{title}</Text>
    <Text style={styles.linkText}>{link}</Text>
  </View>
);

// Post Component
const Post = () => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image source={require('../assets/profile.png')} style={styles.postAvatar} />
      <View>
        <Text style={styles.postName}>นายสมปอง หมายปอง</Text>
        <Text style={styles.postLocation}>ขาย 🔘 มทส</Text>
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
  return (
    <View style={styles.container}>
      {/* ใช้ HeaderOnly จาก components */}
      <HeaderOnly />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Info */}
        <Image source={require('../assets/profile.png')} style={styles.profile} />
        <Text style={styles.name}>นายสมปอง หมายปอง</Text>

        {/* Social Info */}
        <SocialLink title="เฟซบุ๊ก" link="ลิ้งค์เฟส" />
        <SocialLink title="ไลน์ไอดี" link="ลิ้งค์ไลน์" />
        <SocialLink title="ไอจี" link="ลิ้งค์IG" />
        <SocialLink title="เบอร์โทร" link="โทรเลย" />

        {/* ร้านค้าของฉัน */}
        <Text style={styles.sectionTitle}>🏪 ร้านค้าของฉัน</Text>

        {/* Post */}
        <Post />
      </ScrollView>

      {/* ใช้ BottomNavOnly จาก components */}
      <BottomNavOnly />
    </View>
  );
};

export default ShopProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#B7E305',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  logo: { width: 50, height: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  icon: { width: 28, height: 28 },
  content: { padding: 20, alignItems: 'center' },
  profile: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  linkText: {
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  postContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postName: { fontWeight: 'bold' },
  postLocation: { fontSize: 12, color: '#555' },
  postText: { marginBottom: 10 },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactText: {
    alignSelf: 'flex-end',
    color: '#007AFF',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#B7E305',
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    elevation: 5,
  },
});

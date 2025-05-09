import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../config/firebase-config';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Header from '../components/header';
import BottomNav from '../components/BottomNav';

const SocialLink = ({ title, link, icon }) => (
  <View style={styles.socialRow}>
    <TouchableOpacity onPress={() => Linking.openURL(link)}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
    <Text style={styles.socialText}>{title}</Text>
  </View>
);

const PostItem = ({ post, handleDeletePost }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image source={post.profileImageUrl ? { uri: post.profileImageUrl } : require('../assets/profile.png')} style={styles.postAvatar} />
      <View>
        <Text style={styles.postName}>{post.ownerName || 'ไม่ระบุชื่อ'}</Text>
        <Text style={styles.postLocation}>{post.type === 'buy' ? 'โพสต์ขาย' : 'โพสต์บริจาค'} {post.address || ''}</Text>
      </View>
    </View>
    <Text style={styles.postText}>{post.caption}</Text>

    {/* ใช้ FlatList ในแนวนอนเพื่อแสดงหลายรูปภาพ */}
    {post.imageUrls && post.imageUrls.length > 0 && (
      <FlatList
        data={post.imageUrls}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.postImage} resizeMode="cover" />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}  // ทำให้เลื่อนข้าง ๆ
        showsHorizontalScrollIndicator={false}  // ปิดการแสดง scroll indicator
      />
    )}

    <Text style={styles.contactText}>ติดต่อ</Text>

    {/* เปลี่ยนเป็นข้อความแทนปุ่ม */}
    <Text style={styles.deleteText} onPress={() => handleDeletePost(post)}>ลบโพสต์</Text>
  </View>
);

const ShopProfileScreen = () => {
  const navigation = useRouter();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const uid = currentUser.uid;

      const userQuery = query(collection(db, 'users'), where('uid', '==', uid));
      const userSnap = await getDocs(userQuery);
      if (!userSnap.empty) {
        setUser(userSnap.docs[0].data());
      }

      const posts = [];
      const collections = ['PostSale', 'PostDonate'];
      for (const col of collections) {
        const q = query(collection(db, col), where('uid', '==', uid));
        const snap = await getDocs(q);
        snap.forEach(doc => posts.push(doc.data()));
      }
      setMyPosts(posts);
    };

    fetchUserAndPosts();
  }, []);

  const goToMyShopScreen = () => {
    navigation.navigate('MyShopScreen');
  };

  const goBack = () => {
    navigation.replace('/home');
  };

  const handleDeletePost = async (post) => {
    try {
      const colName = post.type === 'buy' ? 'PostSale' : 'PostDonate';
      const q = query(collection(db, colName), where('uid', '==', post.uid), where('caption', '==', post.caption));
      const snap = await getDocs(q);
      snap.forEach(async (docItem) => {
        await deleteDoc(doc(db, colName, docItem.id));
      });
      setMyPosts(myPosts.filter(p => p.caption !== post.caption)); // อัปเดตหน้าจอ
      Alert.alert('ลบแล้ว', 'โพสต์ถูกลบเรียบร้อย');
    } catch (err) {
      Alert.alert('ผิดพลาด', 'ไม่สามารถลบโพสต์ได้');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={require('../assets/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={goToMyShopScreen}>
        <Image source={require('../assets/edit.png')} style={styles.editIcon} />
      </TouchableOpacity>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {user && (
          <View style={styles.profileContainer}>
            <Image source={user.profileImageUrl ? { uri: user.profileImageUrl } : require('../assets/profile.png')} style={styles.profile} />
            <Text style={styles.name}>{user.name}</Text>
          </View>
        )}

        <View style={styles.socialContainer}>
          <SocialLink title={user?.facebook || 'Facebook'} link={user?.facebooklink || 'https://www.facebook.com/'} icon={require('../assets/facebook.png')} />
          <SocialLink title={user?.idline || 'Line'} link={`https://line.me/R/ti/p/~${user?.idline || ''}`} icon={require('../assets/line.png')} />
          <SocialLink title={user?.ig || 'Instagram'} link={`https://www.instagram.com/${user?.ig || ''}`} icon={require('../assets/instagram.png')} />
          <SocialLink title={user?.phoneNumber || 'โทรเลย'} link={`tel:${user?.phoneNumber || ''}`} icon={require('../assets/call.png')} />
        </View>

        <View style={styles.sectionRow}>
          <Image source={require('../assets/bg-home.png')} style={styles.sectionImage} />
          <Text style={styles.sectionTitle}>ร้านค้าของฉัน</Text>
        </View>

        <FlatList
          data={myPosts}
          renderItem={({ item }) => (
            <PostItem post={item} handleDeletePost={handleDeletePost} />
          )}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </ScrollView>

      <BottomNav />
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
  postImage: { width: 260, height: 190, borderRadius: 10, marginRight: 10 }, // เพิ่ม marginRight เพื่อให้สามารถเลื่อนได้
  contactText: { alignSelf: 'flex-end', color: '#007AFF', fontWeight: 'bold' },
  backButton: { position: 'absolute', top: 70, left: 10, zIndex: 1, padding: 10, backgroundColor: '#fff', borderRadius: 50 },
  backIcon: { width: 30, height: 30, resizeMode: 'contain' },
  editButton: { position: 'absolute', top: 70, right: 20, zIndex: 1, padding: 10, backgroundColor: '#fff', borderRadius: 50 },
  editIcon: { width: 30, height: 30, resizeMode: 'contain' },
  deleteText: {
    color: '#FF0000',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ShopProfileScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Linking } from 'react-native';
import Header from '../components/header';
import BottomNav from '../components/BottomNav';
import { useRouter } from 'expo-router';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const LookPost = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'PostSale'));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // เรียงล่าสุดก่อน
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={
            item.profileImageUrl
              ? { uri: item.profileImageUrl }
              : require('../assets/profile.png')
          }
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.username}>{item.ownerName || 'ไม่ระบุชื่อ'}</Text>
          <Text style={styles.date}>
            {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'ไม่ทราบวันที่'}
          </Text>
          <Text style={styles.location}>{item.address || 'ไม่ระบุตำแหน่ง'}</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.caption || 'ไม่มีคำอธิบายเพิ่มเติม'}</Text>

      {item.imageUrls && item.imageUrls.length > 0 && (
        <FlatList
          data={item.imageUrls}
          keyExtractor={(img, index) => index.toString()}
          horizontal
          renderItem={({ item: img }) => (
            <Image source={{ uri: img }} style={styles.postImage} />
          )}
        />
      )}

      {item.coords && (
        <TouchableOpacity
          style={styles.routeButton}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${item.coords.latitude},${item.coords.longitude}`
            )
          }
        >
          <Text style={styles.routeButtonText}>ดูเส้นทาง</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactText}>ติดต่อ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView>
        <View style={styles.featureContainer}>
          <FeatureButton title="ร้านรับซื้อ" icon={require('../assets/bg-home.png')} onPress={() => router.push('/shop')} />
          <FeatureButton title="โพสต์ซื้อขาย" icon={require('../assets/excellent.png')} onPress={() => router.push('/lookpost')} />
          <FeatureButton title="บริจาค" icon={require('../assets/fundraising.png')} onPress={() => router.push('/donate')} />
        </View>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const FeatureButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.featureBtn} onPress={onPress}>
    <Image source={icon} style={styles.featureIcon} />
    <Text style={styles.featureText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  featureContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  featureBtn: {
    alignItems: 'center',
    backgroundColor: '#B7E305',
    padding: 10,
    borderRadius: 15,
    width: 90,
  },
  featureIcon: {
    width: 40,
    height: 40,
  },
  featureText: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  routeButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  routeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactButton: {
    marginTop: 10,
    backgroundColor: '#ededed',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LookPost;

import React, { useEffect, useState } from "react";
import {View,Text,Image,StyleSheet,ScrollView,ImageBackground,TouchableOpacity,} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config"; // Firebase Config
import Header from '../components/header';  // นำเข้า Header Component
import BottomNav from '../components/BottomNav';  // นำเข้า BottomNav Component

export default function HomeScreen() {
  const router = useRouter(); // สร้างตัวแปรเพื่อใช้ใน router
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "knowledges"));
    const imageData = querySnapshot.docs.map((doc) => doc.data());
    setImages(imageData);
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <Header /> {/* เรียกใช้ Header Component */}

          {/* Scrollable Cards for Banner Images (Horizontal) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {images.filter((image) => image.position === "top").map((image, index) => (
              <View key={index} style={styles.imageCardTop}>
                <View style={styles.cardShadow} />
                {image.imageUrl ? (
                  <Image source={{ uri: image.imageUrl }} style={styles.imagePreviewTop} resizeMode="cover" />
                ) : (
                  <Text style={styles.noImageText}>Image not available</Text> // เมื่อไม่มี imageUrl จะแสดงข้อความแทน
                )}
              </View>
            ))}
          </ScrollView>

          {/* Feature Buttons */}
          <View style={styles.featureRow}>
            <FeatureButton title="ร้านรับซื้อ" icon={require('../assets/bg-home.png')} onPress={() => router.push('/shop')} />
            <FeatureButton title="โพสต์ซื้อขาย" icon={require('../assets/excellent.png')} onPress={() => router.push('/look')} />
            <FeatureButton title="บริจาค" icon={require('../assets/fundraising.png')} onPress={() => router.push('/look')} />
          </View>

          {/* Scrollable Cards for Infographic Images (Vertical) */}
          <ScrollView contentContainerStyle={styles.verticalScroll}>
            {images.filter((image) => image.position === "bottom").map((image, index) => (
              <View key={index} style={styles.imageCardBottom}>
                {image.imageUrl ? (
                  <Image source={{ uri: image.imageUrl }} style={styles.imagePreviewBottom} resizeMode="cover" />
                ) : (
                  <Text style={styles.noImageText}>Image not available</Text> // เมื่อไม่มี imageUrl จะแสดงข้อความแทน
                )}
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <BottomNav /> {/* เรียกใช้ BottomNav Component */}
      </View>
    </ImageBackground>
  );
}

const FeatureButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.featureBtn} onPress={onPress}>
    <Image source={icon} style={styles.featureIcon} />
    <Text style={styles.featureText}>{title}</Text>
  </TouchableOpacity>
);

const NavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.navItem}>
      <Image source={icon} style={[styles.navIcon, active && styles.navIconActive]} />
      <Text style={styles.navLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E7F5B9',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    paddingBottom: 100,
  },
  scrollSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  verticalScroll: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageCardTop: {
    marginRight: 15,
    width: 230,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  imageCardBottom: {
    marginRight: 15,
    width: 350,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  imagePreviewTop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePreviewBottom: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
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
  noImageText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
  },
});

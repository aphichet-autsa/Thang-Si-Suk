import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import Header from '../components/header';
import BottomNav from '../components/BottomNav';

export default function NearbyShopsScreen() {
  const [shops, setShops] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // ขออนุญาตใช้ตำแหน่งปัจจุบัน
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }

      // ดึงข้อมูลร้านจาก Firestore
      const snapshot = await getDocs(collection(db, 'shops'));
      const shopData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(shop => shop.coords?.latitude && shop.coords?.longitude);

      setShops(shopData);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {shops.map(shop => (
            <Marker
              key={shop.id}
              coordinate={{
                latitude: shop.coords.latitude,
                longitude: shop.coords.longitude,
              }}
              title={shop.shopName}
              description={shop.address}
            />
          ))}
        </MapView>
      )}

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    zIndex: 0,
  },
});

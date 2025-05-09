import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Linking, ScrollView,
} from 'react-native';
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }

      const snapshot = await getDocs(collection(db, 'shops'));
      const shopData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).filter(shop => shop.coords?.latitude && shop.coords?.longitude);

      setShops(shopData);
    })();
  }, []);

  const openMap = (lat, lng) => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  };

  const renderShop = ({ item }) => (
    <View style={styles.shopCard}>
      <Text style={styles.shopName}>{item.shopName}</Text>
      <Text style={styles.shopCategory}>{item.category || 'หมวดหมู่ไม่ระบุ'}</Text>
      <Text style={styles.shopAddress}>{item.address || '-'}</Text>
      <Text style={styles.shopPhone}>📞 {item.phone || 'ไม่มีเบอร์'}</Text>

      <TouchableOpacity
        style={styles.directionsButton}
        onPress={() => openMap(item.coords.latitude, item.coords.longitude)}
      >
        <Text style={styles.directionsText}>Directions</Text>
      </TouchableOpacity>
    </View>
  );

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
          {shops.map((shop) => (
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

      <View style={styles.resultsBox}>
        <Text style={styles.resultsHeader}>Results</Text>
        <FlatList
          data={shops}
          renderItem={renderShop}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  map: { height: 250 },
  resultsBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 10,
    flex: 1,
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shopCard: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  shopCategory: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  shopAddress: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  shopPhone: {
    fontSize: 13,
    marginTop: 2,
    color: '#007AFF',
  },
  directionsButton: {
    alignSelf: 'flex-start',
    marginTop: 5,
    backgroundColor: '#E6F1FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  directionsText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Linking, ScrollView
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

  const renderShopItem = ({ item }) => (
    <View style={styles.shopCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../assets/profile.png')}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.shopName}>{item.shopName}</Text>
          <Text style={styles.detailText}>{item.category || '-'}</Text>
          <Text style={styles.detailText}>{item.address}</Text>
          <Text style={styles.detailText}>📞 {item.phone || 'ไม่ระบุ'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.directionBtn} onPress={() => openMap(item.coords.latitude, item.coords.longitude)}>
        <Text style={styles.directionText}>Directions</Text>
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

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Results</Text>
        <FlatList
          data={shops}
          keyExtractor={(item) => item.id}
          renderItem={renderShopItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  map: { height: 250 },
  resultsContainer: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  shopCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailText: {
    fontSize: 13,
    color: '#555',
  },
  directionBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
    backgroundColor: '#E6F1FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  directionText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

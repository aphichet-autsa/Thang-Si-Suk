import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ShopDetailScreen(props) {
  const router = useRouter();
  // รับข้อมูลร้านจาก props หรือ params
  const params = useLocalSearchParams();
  const shop = props.shop || params.shop ? JSON.parse(params.shop) : {};

  let images = [];
  if (Array.isArray(shop.imageUrl)) {
    images = shop.imageUrl;
  } else if (shop.imageUrl) {
    images = [shop.imageUrl];
  }

  return (
    <View style={styles.root}>
      {/* Header สีเขียวสด */}
      <View style={styles.headerGreen}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerText}>THANGSISUK</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require('../assets/location.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/logout.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      {/* แถบหัวข้อ ร้านรับซื้อ */}
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/shop')}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Image source={require('../assets/shop.png')} style={styles.shopIcon} />
          <Text style={styles.pageTitle}>ร้านรับซื้อ</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image
              source={shop.avatarUrl ? { uri: shop.avatarUrl } : require('../assets/profile.png')}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.label}>ชื่อร้าน : <Text style={styles.value}>{shop.shopName || ''}</Text></Text>
            </View>
          </View>
          <Text style={styles.label}>ที่อยู่ : <Text style={styles.value}>{shop.address || ''}</Text></Text>
          <Text style={styles.label}>ประเภทที่รับ : <Text style={styles.value}>{shop.category || ''}</Text></Text>
          <Text style={styles.label}>เบอร์ติดต่อ : <Text style={styles.value}>{shop.phone || ''}</Text></Text>

          {/* รูปภาพหลายรูปแบบ grid */}
          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eaf6b9',
  },
  headerGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B7E305',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  logo: { width: 40, height: 40, marginRight: 8 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 28, height: 28, marginLeft: 8 },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginLeft: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf6b9',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  centerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backIcon: { width: 28, height: 28 },
  shopIcon: { width: 36, height: 36, marginRight: 8 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginTop: 4,
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
    justifyContent: 'flex-start',
  },
  gridImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    margin: 2,
    backgroundColor: '#eee',
  },
});

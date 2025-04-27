import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  // 🔧 แก้ตรงนี้: ใช้ static require แทน dynamic require
  const imageSources = [
    require('../assets/bin-card.png'),
    require('../assets/image15.png'),
    require('../assets/image16.png'),
    require('../assets/image17.png'),
  ];

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={require('../assets/logo2.png')} style={styles.logo} />
            <Text style={styles.headerTitle}>THANGSISUK</Text>
            <View style={styles.headerIcons}>
              <Image source={require('../assets/location.png')} style={styles.iconSmall} />
              <Image source={require('../assets/logout.png')} style={styles.iconSmall} />
            </View>
          </View>

        
          {/* Scrollable Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {imageSources.map((source, index) => (
              <View key={index} style={styles.imageCard}>
                <View style={styles.cardShadow} />
                <Image
                  source={source}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Feature Buttons */}
          <View style={styles.featureRow}>
            <FeatureButton title="ร้านรับซื้อ" icon={require('../assets/bg-home.png')} />
            <FeatureButton title="โพสต์ซื้อขาย" icon={require('../assets/excellent.png')} />
            <FeatureButton title="บริจาค" icon={require('../assets/fundraising.png')} />
          </View>

          {/* Poster Row 1 */}
          <View style={styles.posterGroup}>
            <View style={styles.posterBackground} />
            <View style={styles.posterRow}>
              <Image source={require('../assets/poster1.png')} style={styles.posterLeft} />
              <Image source={require('../assets/poster2.png')} style={styles.posterRight} />
            </View>
          </View>

          {/* Poster Row 2 */}
          <Image
            source={require('../assets/poster3.png')}
            style={styles.fullPoster}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.navBar}>
          <NavItem icon={require('../assets/home-2.png')} label="หน้าแรก" active />
          <NavItem icon={require('../assets/shop.png')} label="ร้านรับซื้อ" />
          <TouchableOpacity style={styles.addButton}>
            <Image source={require('../assets/plus.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          <NavItem icon={require('../assets/location.png')} label="ร้านใกล้ฉัน" />
          <NavItem icon={require('../assets/test-account.png')} label="ฉัน" />
        </View>
      </View>
    </ImageBackground>
  );
}

const FeatureButton = ({ title, icon }) => (
  <TouchableOpacity style={styles.featureBtn}>
    <Image source={icon} style={styles.featureIcon} />
    <Text style={styles.featureText}>{title}</Text>
  </TouchableOpacity>
);

const NavItem = ({ icon, label, active }) => (
  <View style={styles.navItem}>
    <Image source={icon} style={[styles.navIcon, active && styles.navIconActive]} />
    <Text style={styles.navLabel}>{label}</Text>
  </View>
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
  header: {
    backgroundColor: '#B7E305',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconSmall: {
    width: 28,
    height: 28,
    marginHorizontal: 5,
  },
  cardContainer: {
    width: '90%',
    height: 145,
    alignSelf: 'center',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rectangleBehind: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: -1,
  },
  banner: {
    width: '100%',
    height: '100%',
  },

  scrollSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  imageCard: {
    marginRight: 15,
    width: 170,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
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
  imageCardWrapper: {
    marginRight: 15,
    width: 180,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#fff',           // ✅ พื้นหลังขาว
    shadowColor: '#000',               // ✅ เงาสีดำ
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,                      // ✅ Android ใช้ elevation สำหรับเงา
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  posterGroup: {
    position: 'relative',
    marginTop: 15,
  },
  posterBackground: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 180,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    zIndex: -1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  posterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
  },
  posterLeft: {
    width: '47%',
    height: 160,
    borderRadius: 10,
  },
  posterRight: {
    width: '47%',
    height: 160,
    borderRadius: 10,
  },
  fullPoster: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 25,
  },
  navBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
  navIconActive: {
    tintColor: '#000',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 3,
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25,
    elevation: 5,
  },
});

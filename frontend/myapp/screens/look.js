import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HeaderOnly, BottomNavOnly } from '../components/header';
import IconButton from '../components/IconButton';  // นำเข้า IconButton

// ไอคอนที่ใช้สำหรับปุ่ม
import storeIcon from '../assets/bg-home.png';  // ไอคอนร้านรับซื้อ
import postIcon from '../assets/post.png';  // ไอคอนโพสต์ซื้อขาย
import donateIcon from '../assets/donate.png';  // ไอคอนบริจาค

const LookScreen = () => {
  const handleStorePress = () => {
    console.log("ร้านรับซื้อ");
  };

  const handlePostPress = () => {
    console.log("โพสต์ซื้อขาย");
  };

  const handleDonatePress = () => {
    console.log("บริจาค");
  };

  return (
    <View style={styles.screen}>
      <HeaderOnly title="THANGSISUK" onPress={() => console.log("Location pressed")} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>โพสต์ข้อมูลจะมาในภายหลัง</Text>
        
        {/* เพิ่ม IconButton ที่นี่ */}
        <View style={styles.row}>
          <IconButton icon={storeIcon} text="ร้านรับซื้อ" onPress={handleStorePress} />
          <IconButton icon={postIcon} text="โพสต์ซื้อขาย" onPress={handlePostPress} />
          <IconButton icon={donateIcon} text="บริจาค" onPress={handleDonatePress} />
        </View>
      </ScrollView>
      <BottomNavOnly />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default LookScreen;

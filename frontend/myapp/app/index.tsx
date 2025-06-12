import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
<<<<<<< Updated upstream
      router.replace('/login'); // เปลี่ยนหน้าไป login หลัง 3 วิ
    }, 3000);
=======
      router.replace('/login'); // เปลี่ยนเส้นทางไปที่หน้า Login หลังจาก render เสร็จ
    }, 0);
>>>>>>> Stashed changes

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo1.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f9a7', // สีเขียวอ่อนตามภาพ
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});

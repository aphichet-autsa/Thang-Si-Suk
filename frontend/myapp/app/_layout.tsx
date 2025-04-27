import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase-config';  // Firebase Authentication

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินจาก Firebase
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);  // ถ้าผู้ใช้ล็อกอินแล้วให้เปลี่ยนสถานะเป็น true
      } else {
        setIsLoggedIn(false);  // ถ้ายังไม่ได้ล็อกอินให้เป็น false
      }
    });

    return () => unsubscribe();  // หยุดการตรวจสอบเมื่อ Component ถูกลบ
  }, []);

  return (
    <Stack initialRouteName={isLoggedIn ? "home" : "login"}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
      <Stack.Screen name="contract" options={{ headerShown: false }} />
      <Stack.Screen name="shop" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ headerShown: false }} />
      <Stack.Screen name="registershop" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}

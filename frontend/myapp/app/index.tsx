// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); // เปลี่ยนเส้นทางไปที่หน้า Login หลังจาก render เสร็จ
    }, 0); // รอเล็กน้อยเพื่อให้ layout mount ก่อน

    return () => clearTimeout(timer); // ล้าง timer เมื่อ component ถูก unmount
  }, []);

  return null;
}

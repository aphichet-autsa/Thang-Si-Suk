'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/auth/login');  // ✅ กดแล้วไปหน้า Login
  };

  return (
    <div style={{
      backgroundColor: '#AEE9FF',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'  // ทำให้เม้าส์เป็นรูปมือ (เหมือนปุ่ม)
    }}
    onClick={handleClick}  // ✅ กดที่พื้นที่ทั้ง div
    >
      <Image 
        src="/thangsisuk.png" 
        alt="THANGSISUK" 
        width={200} 
        height={200} 
        style={{ borderRadius: '20px' }}
        priority
      />
    </div>
  );
}

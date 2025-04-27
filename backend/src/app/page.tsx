'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";  // ใช้ next/navigation สำหรับ Next.js 13+

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    // ล็อกข้อความใน console เพื่อตรวจสอบ
    console.log("Redirecting to /auth/login");

    setTimeout(() => {
      console.log("Pushing to /auth/login");
      router.push("/auth/login");  // ใช้เส้นทางแบบนี้
    }, 3000);  // 3 วินาที
  }, [router]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', backgroundColor: '#DEF19F'
    }}>
      <img src="/logo.png" alt="Thang Si Suk" style={{ width: '150px', height: 'auto' }} />
    </div>
  );
};

export default Splash;

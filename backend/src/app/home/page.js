'use client';

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email.split('@')[0]);
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 🔵 Header */}
      <div style={{
        backgroundColor: '#91E2FF',
        padding: '0px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',   // 🔵 ดันซ้าย-ขวา
        height: '80px',
      }}>
        <h2 style={{ margin: '0', fontWeight: 'bold' }}>THANGSISUK</h2>
        <Image src="/minilogo.png" alt="Mini Logo" width={40} height={40} />
      </div>

      {/* 🔵 Main Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar */}
        <div style={{
          width: '250px',
          backgroundColor: '#E2E2E2',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          
          {/* 🧑‍🦱 Profile + Name */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#E0E0E0',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px'
            }}>
              <Image src="/profile.png" alt="Profile" width={50} height={50} />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{userName}</span>
          </div>

          {/* เมนู + ออกจากระบบ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={buttonStyle}>จัดการความรู้ในระบบ</button>
            <button style={buttonStyle}>ร้านค้าในระบบ</button>
            <button style={buttonStyle}>จัดการโพส</button>
            <button style={buttonStyle} onClick={() => router.push('/userlist')}>
                ผู้ใช้ในระบบ
            </button>
            <button style={buttonStyle}>แอดมิน</button>
            {/* ปุ่มออกจากระบบอยู่ด้านบน */}
            <button
                onClick={handleLogout}
                style={{
                ...buttonStyle,
                backgroundColor: 'red',
                color: 'white',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
                }}
            >
                <Image src="/Logout.png" alt="Logout Icon" width={24} height={24} />
                ออกจากระบบ
            </button>
            </div>

        </div>

        {/* เนื้อหาหลัก */}
        <div style={{ flex: 1, backgroundColor: '#FFF9C4', padding: '30px' }}>
          <h1>ข้อมูลความรู้ในระบบ</h1>
          {/* พื้นที่เนื้อหา */}
        </div>

      </div>
    </div>
  );
}

const buttonStyle = { 
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',            // ต้องมี flex
    alignItems: 'center',       // จัดกลางแนวตั้ง
    justifyContent: 'center',   // ⭐ จัดกลางแนวนอน
    gap: '10px',                // ระยะห่างระหว่างรูปกับข้อความ
    fontWeight: 'bold'          // (เพิ่มได้ถ้าอยากให้ตัวหนังสือหนา)
  };
  
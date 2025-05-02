'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from "@/firebase";
import { collection, getDocs } from 'firebase/firestore';
import ChartComponent from './ChartComponent';
import Image from 'next/image';

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    posts: 0,
    areas: 0
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลผู้ใช้
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userCount = usersSnapshot.size;
        
        // ดึงข้อมูลอื่นๆ (ตัวอย่าง)
        const shopsSnapshot = await getDocs(collection(db, "shops"));
        // const postsSnapshot = await getDocs(collection(db, "posts"));
        
        setStats({
          users: userCount,
          shops: 49, // shopsSnapshot.size เมื่อมี collection shops
          posts: 69, // postsSnapshot.size เมื่อมี collection posts
          areas: 59
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#e0e0e0'
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* เมนูด้านซ้าย */}
      <div style={{
        width: '250px',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        <h2 style={{ 
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
          marginBottom: '20px',
          textAlign: 'center'
        }}>THANGSISUK</h2>
        
        <button style={buttonStyle} onClick={() => router.push("/home")}>จัดการความรู้ในระบบ</button>
        <button style={buttonStyle} onClick={() => router.push("/shop")} >ร้านค้าในระบบ </button>
        <button style={buttonStyle}>จัดการโพส</button>
        <button style={buttonStyle} onClick={() => router.push('/userlist')}>
          ผู้ใช้ในระบบ
        </button>
        <button style={buttonStyle} onClick={() => router.push('/dashboard')}>
          แดชบอร์ด
        </button>
        
        {/* ปุ่มออกจากระบบอยู่ด้านล่าง */}
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button
            onClick={handleLogout}
            style={{
              ...buttonStyle,
              backgroundColor: '#ff4444',
              color: 'white',
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
      <div style={{ 
        marginLeft: '250px',
        padding: '30px',
        width: 'calc(100% - 250px)'
      }}>
        <h1 style={{ 
          color: '#333',
          marginBottom: '30px',
          textAlign: 'center'
        }}>แดชบอร์ด</h1>
        
        {/* สถิติแบบ Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { title: 'จำนวนผู้ใช้งาน', value: stats.users, color: '#36a2eb' },
            { title: 'ร้านค้าในระบบ', value: stats.shops, color: '#ff6384' },
            { title: 'โพสต์ขาย', value: stats.posts, color: '#4bc0c0' },
            { title: 'บริเวณ', value: stats.areas, color: '#9966ff' },
          ].map((item, index) => (
            <div key={index} style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ marginBottom: '10px', color: '#666' }}>{item.title}</h3>
              <p style={{ 
                fontSize: '32px',
                fontWeight: 'bold',
                color: item.color
              }}>{item.value}</p>
            </div>
          ))}
        </div>
        
        {/* กราฟ */}
        <ChartComponent />
      </div>
    </div>
  );
};

export default Dashboard;
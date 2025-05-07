'use client';
import React, { useState, useEffect } from 'react';
import { db } from "@/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { MainLayout } from "../components/layout/MainLayout";
import { StatsCard } from "../dashboard/StatsCard";
import ChartComponent from "../dashboard/ChartComponent";


const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    posts: 0,
    areas: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลผู้ใช้
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userCount = usersSnapshot.size;
        
        // ดึงข้อมูลอื่นๆ (ตัวอย่าง)
        const shopsSnapshot = await getDocs(collection(db, "shops"));
        
        setStats({
          users: userCount,
          shops: shopsSnapshot.size,
          posts: 69, // ตัวอย่างค่า
          areas: 59  // ตัวอย่างค่า
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout activeMenu="dashboard">
      <h1 style={{ 
        color: '#333',
        marginBottom: '30px',
        textAlign: 'center'
      }}>แดชบอร์ด</h1>
      
      {/* สถิติแบบ Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatsCard 
          title="จำนวนผู้ใช้งาน" 
          value={stats.users} 
          color="#36a2eb" 
        />
        <StatsCard 
          title="ร้านค้าในระบบ" 
          value={stats.shops} 
          color="#ff6384" 
        />
        <StatsCard 
          title="โพสต์ขาย" 
          value={stats.posts} 
          color="#4bc0c0" 
        />
        <StatsCard 
          title="บริเวณ" 
          value={stats.areas} 
          color="#9966ff" 
        />
      </div>
      
      {/* กราฟ */}
      <ChartComponent />
    </MainLayout>
  );
};

export default Dashboard;
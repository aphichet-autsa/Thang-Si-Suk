'use client';  // เพิ่มบรรทัดนี้ที่บรรทัดแรก

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
        
        // ดึงข้อมูลร้านค้า
        const shopsSnapshot = await getDocs(collection(db, "shops"));
        
        // ดึงข้อมูลโพสต์ขาย
        const postSaleSnapshot = await getDocs(collection(db, "PostSale"));
        
        // ดึงข้อมูลโพสต์บริจาค
        const postDonateSnapshot = await getDocs(collection(db, "PostDonate"));

        setStats({
          users: userCount,
          shops: shopsSnapshot.size,
          posts: postSaleSnapshot.size, // จำนวนโพสต์ขาย
          areas: postDonateSnapshot.size  // จำนวนโพสต์บริจาค
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
          title="บริจาค" 
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

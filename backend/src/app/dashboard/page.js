'use client';
import React, { useState, useEffect } from 'react';
import { db } from "@/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { MainLayout } from "../components/layout/MainLayout";
import { StatsCard } from "../dashboard/StatsCard";
import ChartComponent from "../dashboard/ChartComponent";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    posts: 0,
    donations: 0
  });

  const [monthlyData, setMonthlyData] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ดึงข้อมูลทั้งหมดแบบขนาน
        const [
          usersSnapshot, 
          shopsSnapshot, 
          postSaleSnapshot, 
          postDonateSnapshot
        ] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "shops")),
          getDocs(collection(db, "PostSale")),
          getDocs(collection(db, "PostDonate"))
        ]);

        // ดึงข้อมูลรายเดือน
        const monthlyStats = await getMonthlyStats();
        const registrationStats = await getRegistrationStats();

        setStats({
          users: usersSnapshot.size,
          shops: shopsSnapshot.size,
          posts: postSaleSnapshot.size,
          donations: postDonateSnapshot.size
        });

        setMonthlyData(monthlyStats);
        setRegistrationData(registrationStats);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ดึงข้อมูลสถิติรายเดือน
  const getMonthlyStats = async () => {
    const currentDate = new Date();
    const months = [];
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    
    // สร้าง array ของ 6 เดือนย้อนหลัง
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        name: monthNames[date.getMonth()] + ' ' + (date.getFullYear() + 543).toString().slice(2)
      });
    }

    // ดึงข้อมูลผู้ใช้รายเดือน
    const userCounts = await Promise.all(
      months.map(async (m) => {
        const startDate = new Date(m.year, m.month, 1);
        const endDate = new Date(m.year, m.month + 1, 0);
        
        const q = query(
          collection(db, "users"),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.size;
      })
    );

    // ดึงข้อมูลร้านค้ารายเดือน
    const shopCounts = await Promise.all(
      months.map(async (m) => {
        const startDate = new Date(m.year, m.month, 1);
        const endDate = new Date(m.year, m.month + 1, 0);
        
        const q = query(
          collection(db, "shops"),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.size;
      })
    );

    return {
      labels: months.map(m => m.name),
      datasets: [
        {
          label: 'ผู้ใช้งานใหม่',
          data: userCounts,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
        },
        {
          label: 'ร้านค้าใหม่',
          data: shopCounts,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        }
      ]
    };
  };

  // ดึงข้อมูลการลงทะเบียนและโพสต์
  const getRegistrationStats = async () => {
    const currentDate = new Date();
    const months = [];
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    
    // สร้าง array ของ 6 เดือนย้อนหลัง
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        name: monthNames[date.getMonth()] + ' ' + (date.getFullYear() + 543).toString().slice(2)
      });
    }

    // ดึงข้อมูลโพสต์ขายรายเดือน
    const postCounts = await Promise.all(
      months.map(async (m) => {
        const startDate = new Date(m.year, m.month, 1);
        const endDate = new Date(m.year, m.month + 1, 0);
        
        const q = query(
          collection(db, "PostSale"),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.size;
      })
    );

    // ดึงข้อมูลโพสต์บริจาครายเดือน
    const donationCounts = await Promise.all(
      months.map(async (m) => {
        const startDate = new Date(m.year, m.month, 1);
        const endDate = new Date(m.year, m.month + 1, 0);
        
        const q = query(
          collection(db, "PostDonate"),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.size;
      })
    );

    return {
      labels: months.map(m => m.name),
      datasets: [
        {
          label: 'โพสต์ขาย',
          data: postCounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: 'โพสต์บริจาค',
          data: donationCounts,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
        }
      ]
    };
  };

  if (loading) {
    return (
      <MainLayout activeMenu="dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh'
        }}>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout activeMenu="dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'red'
        }}>
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

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
          icon="👥"
        />
        <StatsCard 
          title="ร้านค้าในระบบ" 
          value={stats.shops} 
          color="#ff6384" 
          icon="🏪"
        />
        <StatsCard 
          title="โพสต์ขาย" 
          value={stats.posts} 
          color="#4bc0c0" 
          icon="💰"
        />
        <StatsCard 
          title="โพสต์บริจาค" 
          value={stats.donations} 
          color="#9966ff" 
          icon="❤️"
        />
      </div>
      
      {/* กราฟ */}
      {monthlyData && registrationData && (
        <ChartComponent 
          userStats={stats}
          monthlyData={monthlyData}
          registrationData={registrationData}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
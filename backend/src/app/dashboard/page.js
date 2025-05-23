'use client';
import React, { useState, useEffect } from 'react';
import { db } from "@/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { MainLayout } from "../components/layout/MainLayout";
import { StatsCard } from "../components/layout/StatsCard";
import ChartComponent from "../components/layout/ChartComponent";
import PieChartComponent from "../components/layout/PieChartComponent";
import ProvinceChartComponent from "../components/layout/ProvinceChartComponent";
import StackedBarByArea from "../components/layout/StackedBarByArea";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    posts: 0,
    donations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopCategoryData, setShopCategoryData] = useState(null);
  const [provinceStats, setProvinceStats] = useState(null);
  const [areaStats, setAreaStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersSnapshot,
          shopsSnapshot,
          postSaleSnapshot,
          postDonateSnapshot
        ] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "shops")),
          getDocs(collection(db, "PostSale")),
          getDocs(collection(db, "PostDonate")),
        ]);

        // Category & Province count
        const categoryCounts = {};
        const provinceCount = {};
        shopsSnapshot.forEach(doc => {
          const data = doc.data();
          const cat = data.category || 'ไม่ระบุ';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

          const province = data.province || 'ไม่ระบุ';
          provinceCount[province] = (provinceCount[province] || 0) + 1;
        });

        // Stats cards
        setStats({
          users: usersSnapshot.size,
          shops: shopsSnapshot.size,
          posts: postSaleSnapshot.size,
          donations: postDonateSnapshot.size,
        });

        // Pie chart
        const catLabels = Object.keys(categoryCounts);
        const catData = Object.values(categoryCounts);
        setShopCategoryData({
          labels: catLabels,
          datasets: [{
            label: 'หมวดหมู่ร้านค้า',
            data: catData,
            backgroundColor: catLabels.map((_, i) =>
              `hsl(${(i * 360) / catLabels.length}, 70%, 60%)`
            ),
            borderWidth: 1,
          }],
        });

        // Province chart
        const provinceLabels = Object.keys(provinceCount);
        const provinceData = Object.values(provinceCount);
        setProvinceStats({
          labels: provinceLabels,
          datasets: [{
            label: 'จำนวนร้านค้า',
            data: provinceData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        });

        // Area stacked chart
        const areaMap = {};
        [...postDonateSnapshot.docs, ...postSaleSnapshot.docs].forEach(doc => {
          const data = doc.data();
          const type = data.type === 'donate' ? 'donate' : 'buy';
          const address = data.address || 'ไม่ระบุ';

          let area = 'ไม่ระบุ';
          if (address.includes('ตำบล')) {
            const parts = address.split('ตำบล');
            if (parts[1]) {
              area = parts[1].trim().split(' ')[0];
            }
          }

          if (!areaMap[area]) {
            areaMap[area] = { donate: 0, buy: 0 };
          }
          areaMap[area][type]++;
        });

        const areaLabels = Object.keys(areaMap);
        const donateData = areaLabels.map(area => areaMap[area].donate);
        const buyData = areaLabels.map(area => areaMap[area].buy);
        setAreaStats({
          labels: areaLabels,
          datasets: [
            {
              label: 'บริจาค',
              data: donateData,
              backgroundColor: '#4bc0c0',
            },
            {
              label: 'ขาย',
              data: buyData,
              backgroundColor: '#ff6384',
            }
          ]
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout activeMenu="dashboard">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout activeMenu="dashboard">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", color: "red" }}>
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeMenu="dashboard">
      <h1 style={{ color: "#333", marginBottom: 30, textAlign: "center" }}>แดชบอร์ด</h1>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20,
        marginBottom: 30,
      }}>
        <StatsCard title="จำนวนผู้ใช้งาน" value={stats.users} color="#36a2eb" icon="👥" />
        <StatsCard title="ร้านค้าในระบบ" value={stats.shops} color="#ff6384" icon="🏪" />
        <StatsCard title="โพสต์ขาย" value={stats.posts} color="#4bc0c0" icon="💰" />
        <StatsCard title="โพสต์บริจาค" value={stats.donations} color="#9966ff" icon="❤️" />
      </div>

      {/* Row 1: ChartComponent + PieChartComponent */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 20,
        flexWrap: 'wrap',
        marginBottom: 40,
      }}>
        <div style={{ flex: '1 1 400px', maxWidth: 500, height: 380 }}>
          <ChartComponent userStats={stats} />
        </div>

        {shopCategoryData && (
          <div style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: 380,
            flex: '1 1 400px',
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: 20 }}>สัดส่วนหมวดหมู่ร้านค้า</h3>
            <div style={{ flexGrow: 1 }}>
              <PieChartComponent data={shopCategoryData} />
            </div>
          </div>
        )}
      </div>

      {/* Row 2: ProvinceChartComponent + StackedBarByArea */}
      {provinceStats && areaStats && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 40,
        }}>
          <div style={{ flex: '1 1 400px', maxWidth: 500, height: 380 }}>
            <ProvinceChartComponent data={provinceStats} />
          </div>

          <div style={{ flex: '1 1 400px', maxWidth: 500, height: 380 }}>
            <StackedBarByArea data={areaStats} />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;

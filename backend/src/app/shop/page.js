'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from "@/firebase";
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { MainLayout } from "../components/layout/MainLayout";
import ShopCard from "../components/layout/ShopCard";

export default function ShopListPage() {
  const [state, setState] = useState({
    shops: [],
    searchTerm: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shops'));
      const shopList = querySnapshot.docs.map(doc => {
        const data = doc.data();

        const createdAt =
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toLocaleString()
            : typeof data.createdAt === 'string'
              ? data.createdAt
              : '';

        return {
          docId: doc.id, // ✅ เปลี่ยนจาก id: doc.id เป็น docId
          shopName: data.shopName || '',
          ...data, // รวม field ที่เหลือ เช่น ownerName, phone, image ฯลฯ
          createdAt, // override createdAt เพื่อไม่ render object
        };
      });

      setState(prev => ({ ...prev, shops: shopList }));
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const filteredShops = state.shops.filter(shop =>
    (shop.shopName || '').toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <MainLayout activeMenu="shop">
      <div style={{ padding: '30px', width: '100%' }}>
        <h1 style={{
          color: '#333',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          ร้านค้าในระบบ
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px',
          gap: '20px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="ค้นหาร้านค้า..."
            name="searchTerm"
            value={state.searchTerm}
            onChange={handleChange}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              minWidth: '250px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {filteredShops.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '16px',
              gridColumn: '1 / -1',
              padding: '40px 0'
            }}>
              ไม่พบร้านค้าที่ตรงกับคำค้นหา
            </p>
          ) : (
            filteredShops.map((shop) => (
              <ShopCard
                key={shop.docId} // ✅ ใช้ docId เป็น key
                shop={shop}
                fetchShops={fetchShops}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

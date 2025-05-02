'use client';  // Ensure this file works on the client-side

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from "@/firebase";  // import Firebase config
import { collection, getDocs } from 'firebase/firestore'; // ดึงข้อมูลจาก Firestore
import Image from 'next/image';

const UserListPage = () => {
  const router = useRouter();

  const [shops, setShops] = useState([]);  // สถานะเก็บข้อมูลร้านค้า
  const [searchTerm, setSearchTerm] = useState("");  // Search term for shops

  // ฟังก์ชันสำหรับดึงข้อมูลจาก Firestore
  const fetchShops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shops')); // ดึงข้อมูลจากคอลเล็กชัน 'shops'
      const shopList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // ดึงข้อมูลจาก doc
      setShops(shopList); // เก็บข้อมูลร้านค้าในสถานะ
    } catch (error) {
      console.error("Error fetching shops:", error); // แสดงข้อผิดพลาดถ้าไม่สามารถดึงข้อมูลได้
    }
  };

  // ดึงข้อมูลร้านค้าเมื่อเริ่มหน้า
  useEffect(() => {
    fetchShops();
  }, []);

  // ฟังก์ชันจัดการเมื่อเปลี่ยนข้อความในช่องค้นหา
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // กรองข้อมูลร้านค้าตามคำค้นหา
  const filteredShops = shops.filter(shop =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) // เปรียบเทียบกับคำค้นหา
  );

  return (
    <div style={styles.container}>
      {/* Sidebar Menu */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>เมนูระบบ</h2>
        <button style={styles.button}>จัดการความรู้ในระบบ</button>
        <button style={styles.button}>ร้านค้าในระบบ</button>
        <button style={styles.button}>จัดการโพส</button>
        <button style={styles.button} onClick={() => router.push('/userlist')}>ผู้ใช้ในระบบ</button>
        <button style={styles.button} onClick={() => router.push('/dashboard')}>แดชบอร์ด</button>

        {/* Logout Button */}
        <div style={styles.logoutContainer}>
          <button
            onClick={() => alert('ออกจากระบบ')}
            style={styles.logoutButton}
          >
            <Image src="/Logout.png" alt="Logout Icon" width={24} height={24} />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>ร้านค้าในระบบ</h1>

        {/* Search and Add Shop button */}
        <div style={styles.topRightContainer}>
          <input
            type="text"
            placeholder="ค้นหาร้านค้า..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <button style={styles.addButton} onClick={() => router.push('/userlist/add')}>เพิ่มร้านค้า</button>
        </div>

        {/* Display Shops */}
        <div style={styles.userGrid}>
          {filteredShops.length === 0 ? (
            <p>ไม่พบร้านค้าที่ตรงกับคำค้นหา</p>
          ) : (
            filteredShops.map((shop) => (
              <div key={shop.id} style={styles.userCard}>
                <p>ชื่อร้าน: {shop.shopName}</p>
                <p>ที่อยู่: {shop.address}</p>
                <p>ประเภท: {shop.category}</p>
                <p>เบอร์โทร: {shop.phone}</p>
                <button
                  style={styles.editButton}
                  onClick={() => router.push(`/userlist/edit/${shop.id}`)}  // Go to edit shop page
                >
                  แก้ไข
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => alert('ลบร้านค้านี้')}
                >
                  ลบ
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
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
    top: 0,
  },
  sidebarTitle: {
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
    marginBottom: '20px',
  },
  button: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingTop: '20px',
  },
  logoutButton: {
    padding: '10px',
    backgroundColor: '#ff4444',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  mainContent: {
    marginLeft: '250px',
    padding: '30px',
    width: 'calc(100% - 250px)',
  },
  heading: {
    color: '#333',
    marginBottom: '30px',
  },
  topRightContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px',
    gap: '20px',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '5px',
    width: '200px',
  },
  addButton: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  userCard: {
    backgroundColor: "#ADD8E6",
    padding: "15px",
    margin: "10px",
    borderRadius: "8px",
    width: "200px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  editButton: {
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
  },
  deleteButton: {
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
  },
};

export default UserListPage;

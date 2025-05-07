'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { MainLayout } from "../components/layout/MainLayout";
import Image from 'next/image';
import { shopListStyles } from './ShopListStyles';

const ShopListPage = () => {
  // State Management
  const [state, setState] = useState({
    shops: [],
    searchTerm: "",
    isDeleting: false,
    editingShop: null
  });

  const router = useRouter();
  const styles = shopListStyles;

  // Fetch shops data
  const fetchShops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shops'));
      const shopList = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // แปลง Timestamp เป็น String ถ้ามีค่า
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || ''
      }));
      setState(prev => ({ ...prev, shops: shopList }));
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  useEffect(() => { fetchShops(); }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (shop) => {
    setState(prev => ({ ...prev, editingShop: shop }));
  };

  const handleCancelEdit = () => {
    setState(prev => ({ ...prev, editingShop: null }));
  };

  const handleUpdateShop = async (updatedData) => {
    try {
      await updateDoc(doc(db, 'shops', state.editingShop.id), updatedData);
      setState(prev => ({ ...prev, editingShop: null }));
      fetchShops();
      alert('อัพเดตข้อมูลร้านค้าสำเร็จแล้ว');
    } catch (error) {
      console.error("Error updating shop:", error);
      alert('เกิดข้อผิดพลาดในการอัพเดตข้อมูลร้านค้า');
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (state.isDeleting) return;
    
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบร้านค้านี้?')) return;

    setState(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await deleteDoc(doc(db, 'shops', shopId));
      setState(prev => ({
        ...prev,
        shops: prev.shops.filter(shop => shop.id !== shopId),
        isDeleting: false
      }));
      alert('ลบร้านค้าสำเร็จแล้ว');
    } catch (error) {
      console.error("Error deleting shop:", error);
      alert('เกิดข้อผิดพลาดในการลบร้านค้า');
      setState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Filter shops based on search term
  const filteredShops = state.shops.filter(shop =>
    shop.shopName.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <MainLayout activeMenu="shop">
      <div style={styles.container}>
        <h1 style={styles.heading}>ร้านค้าในระบบ</h1>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="ค้นหาร้านค้า..."
            name="searchTerm"
            value={state.searchTerm}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.grid}>
          {filteredShops.length === 0 ? (
            <p style={styles.noResults}>ไม่พบร้านค้าที่ตรงกับคำค้นหา</p>
          ) : (
            filteredShops.map((shop) => (
              <div key={shop.id} style={styles.card}>
                <p style={styles.cardText}><strong>ชื่อร้าน:</strong> {shop.shopName}</p>
                <p style={styles.cardText}><strong>เจ้าของ:</strong> {shop.ownerName}</p>
                <p style={styles.cardText}><strong>ที่อยู่:</strong> {shop.address}</p>
                <p style={styles.cardText}><strong>จังหวัด:</strong> {shop.province}</p>
                <p style={styles.cardText}><strong>อำเภอ/เขต:</strong> {shop.district}</p>
                <p style={styles.cardText}><strong>ตำบล:</strong> {shop.amphoe}</p>
                <p style={styles.cardText}><strong>รหัสไปรษณีย์:</strong> {shop.zipcode}</p>
                <p style={styles.cardText}><strong>เบอร์โทร:</strong> {shop.phone}</p>
                <p style={styles.cardText}><strong>PIN ที่อยู่:</strong> {shop.pinAddress}</p>
                <p style={styles.cardText}><strong>รายละเอียด:</strong> {shop.detail}</p>
                <p style={styles.cardText}><strong>วันที่สร้าง:</strong> {shop.createdAt}</p>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.button('#4CAF50')}
                    onClick={() => handleEditClick(shop)}
                  >
                    แก้ไข
                  </button>
                  <button
                    style={styles.button('#f44336')}
                    onClick={() => handleDeleteShop(shop.id)}
                    disabled={state.isDeleting}
                  >
                    {state.isDeleting ? 'กำลังลบ...' : 'ลบ'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Shop Modal */}
        {state.editingShop && (
          <EditShopModal 
            shop={state.editingShop} 
            onClose={handleCancelEdit}
            onSave={handleUpdateShop}
            styles={styles}
          />
        )}
      </div>
    </MainLayout>
  );
};

// Edit Shop Modal Component
function EditShopModal({ shop, onClose, onSave, styles }) {
  const [formData, setFormData] = useState({
    shopName: shop.shopName || '',
    ownerName: shop.ownerName || '',
    address: shop.address || '',
    province: shop.province || '',
    district: shop.district || '',
    amphoe: shop.amphoe || '',
    zipcode: shop.zipcode || '',
    phone: shop.phone || '',
    pinAddress: shop.pinAddress || '',
    detail: shop.detail || '',
    // createdAt ไม่ต้องรวมใน formData เพราะไม่ต้องการให้แก้ไข
  });

  const fields = [
    { name: 'shopName', label: 'ชื่อร้าน', icon: '/Shop.png', required: true },
    { name: 'ownerName', label: 'ชื่อเจ้าของร้าน', icon: '/User.png', required: true },
    { name: 'address', label: 'ที่อยู่ร้าน', icon: '/Location.png', required: true },
    { name: 'province', label: 'จังหวัด', icon: '/Province.png', required: true },
    { name: 'district', label: 'อำเภอ/เขต', icon: '/District.png', required: true },
    { name: 'amphoe', label: 'ตำบล', icon: '/Amphoe.png', required: true },
    { name: 'zipcode', label: 'รหัสไปรษณีย์', icon: '/Zipcode.png', required: true },
    { name: 'phone', label: 'เบอร์โทรติดต่อ', icon: '/Call.png', required: true },
    { name: 'pinAddress', label: 'ตำแหน่งที่อยู่ที่ปักหมุด', icon: '/Pin.png' },
    { name: 'detail', label: 'รายละเอียดของร้าน', icon: '/Detail.png', type: 'textarea' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={styles.modalHeading}>แก้ไขข้อมูลร้านค้า</h2>

        {/* แสดงวันที่สร้าง (อ่านอย่างเดียว) */}
        {shop.createdAt && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>วันที่สร้าง:</p>
            <p>{shop.createdAt}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  style={{
                    ...styles.modalInput,
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  required={field.required}
                />
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  style={styles.modalInput}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div style={styles.modalButtonGroup}>
            <button 
              type="button" 
              onClick={onClose} 
              style={styles.cancelButton}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              style={styles.confirmButton}
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShopListPage;
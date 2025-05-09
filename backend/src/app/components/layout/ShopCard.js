'use client';

import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function ShopCard({ shop, fetchShops }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ ...shop });

  const handleDelete = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบร้านค้านี้?")) return;
    try {
      await deleteDoc(doc(db, 'shops', shop.id));
      alert("ลบร้านค้าสำเร็จแล้ว");
      fetchShops(); // เรียกใช้ fetchShops หลังจากลบร้านค้า
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleUpdate = async () => {
    try {
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== undefined && v !== null)
      );
      await updateDoc(doc(db, 'shops', shop.id), cleanFormData);
      alert("อัปเดตร้านค้าแล้ว");
      setShowModal(false);
      fetchShops(); // เรียกใช้ fetchShops หลังจากอัปเดตร้านค้า
    } catch (err) {
      console.error("Update Error:", err);
      alert("อัปเดตล้มเหลว");
    }
  };

  return (
    <>
      {/* Card */}
      <div style={cardStyle}>
        <p><strong>ชื่อร้าน:</strong> {shop.shopName}</p>
        <p><strong>เจ้าของ:</strong> {shop.ownerName}</p>
        <p><strong>ที่อยู่:</strong> {shop.address}</p>
        <p><strong>จังหวัด:</strong> {shop.province}</p>
        <p><strong>อำเภอ/เขต:</strong> {shop.district}</p>
        <p><strong>ตำบล:</strong> {shop.amphoe}</p>
        <p><strong>รหัสไปรษณีย์:</strong> {shop.zipcode}</p>
        <p><strong>เบอร์โทร:</strong> {shop.phone}</p>
        <p><strong>PIN ที่อยู่:</strong> {shop.pinAddress}</p>
        <p><strong>รายละเอียด:</strong> {shop.detail}</p>
        <p><strong>วันที่สร้าง:</strong> {shop.createdAt}</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
          <button style={btnStyle('#4CAF50')} onClick={() => setShowModal(true)}>แก้ไข</button>
          <button style={btnStyle('#f44336')} onClick={handleDelete}>ลบ</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: '15px' }}>แก้ไขข้อมูลร้านค้า</h3>
            {["shopName", "ownerName", "address", "province", "district", "amphoe", "zipcode", "phone", "pinAddress", "detail"]
              .map((field) => (
                <div key={field}>
                  <label>{labelMap[field]}</label>
                  <input
                    style={inputStyle}
                    value={formData[field] || ''}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </div>
              ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button style={btnStyle('#4CAF50')} onClick={handleUpdate}>บันทึก</button>
              <button style={btnStyle('#999')} onClick={() => setShowModal(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const labelMap = {
  shopName: 'ชื่อร้าน',
  ownerName: 'เจ้าของ',
  address: 'ที่อยู่',
  province: 'จังหวัด',
  district: 'อำเภอ',
  amphoe: 'ตำบล',
  zipcode: 'รหัสไปรษณีย์',
  phone: 'เบอร์โทร',
  pinAddress: 'PIN',
  detail: 'รายละเอียด'
};

const cardStyle = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px'
};

const btnStyle = (bg) => ({
  padding: '10px 20px',
  backgroundColor: bg,
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  cursor: 'pointer'
});

const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999
};

const modalBox = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '500px'
};

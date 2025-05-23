'use client';

import { useEffect, useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import Image from "next/image";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("โหลดผู้ใช้ล้มเหลว:", error);
    }
  };

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?');
    if (!confirmDelete) return;
    try {
      await fetch(`/api/users/${uid}`, { method: 'DELETE' });
      setUsers(users.filter((user) => user.uid !== uid));
      alert('ลบสำเร็จแล้ว');
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleSaveEdit = async (newData) => {
    try {
      await fetch(`/api/users/${editingUser.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      setEditingUser(null);
      fetchUsers();
      alert('แก้ไขข้อมูลสำเร็จ');
    } catch (error) {
      console.error('แก้ไขไม่สำเร็จ:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไข');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout activeMenu="users">
      <div style={{ padding: '40px', backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>ผู้ใช้ในระบบ</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา..."
            style={{ padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={thStyle}>ไอดี</th>
              <th style={thStyle}>ชื่อ</th>
              <th style={thStyle}>อีเมล</th>
              <th style={thStyle}>รหัสผ่าน</th>
              <th style={thStyle}>Facebook</th>
              <th style={thStyle}>Instagram</th>
              <th style={thStyle}>Line</th>
              <th style={thStyle}>เบอร์โทร</th>
              <th style={thStyle}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.uid}>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.password}</td>
                <td style={tdStyle}>{user.facebook}</td>
                <td style={tdStyle}>{user.ig}</td>
                <td style={tdStyle}>{user.idline}</td>
                <td style={tdStyle}>{user.phoneNumber}</td>
                <td style={tdStyle}>
                  <button style={editButtonStyle} onClick={() => setEditingUser(user)}>แก้ไข</button>
                  <button style={deleteButtonStyle} onClick={() => handleDelete(user.uid)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </MainLayout>
  );
}

function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState(user);

  const fields = [
    { name: 'name', label: 'ชื่อผู้ใช้', icon: '/User.png' },
    { name: 'email', label: 'อีเมล', icon: '/Email.png' },
    { name: 'password', label: 'รหัสผ่าน', icon: '/Lock.png' },
    { name: 'phoneNumber', label: 'เบอร์โทร', icon: '/Call.png' },
    { name: 'facebook', label: 'Facebook', icon: '/fackbook.png' },
    { name: 'ig', label: 'Instagram', icon: '/ig.png' },
    { name: 'idline', label: 'Line', icon: '/Line.png' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2 style={{ marginBottom: '20px' }}>แก้ไขผู้ใช้ในระบบ</h2>

        {fields.map((field, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <Image src={field.icon} alt="icon" width={24} height={24} style={{ marginRight: "10px" }} />
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.label}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid black',
                borderRadius: '5px',
                padding: '8px',
                flex: 1
              }}
            />
          </div>
        ))}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={cancelButtonStyle}>ยกเลิก</button>
          <button onClick={handleSubmit} style={confirmButtonStyle}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
  textAlign: 'center'
};

const editButtonStyle = {
  backgroundColor: '#FFC107',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  marginRight: '5px',
  cursor: 'pointer'
};

const deleteButtonStyle = {
  backgroundColor: '#f44336',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  color: 'white'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContent = {
  backgroundColor: '#FFF9C4',
  padding: '30px',
  borderRadius: '10px',
  width: '400px'
};

const cancelButtonStyle = {
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#ddd',
  width: '45%',
  border: 'none',
  cursor: 'pointer'
};

const confirmButtonStyle = {
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#4CAF50',
  color: 'white',
  width: '45%',
  border: 'none',
  cursor: 'pointer'
};

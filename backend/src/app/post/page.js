'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminPostScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <div style={{ padding: '40px', backgroundColor: '#f2f2f2' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>จัดการโพส</h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button style={{ backgroundColor: '#0f0', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', color: 'white' }}>
            โพสต์ซื้อขาย
          </button>
          <button style={{ backgroundColor: '#0c8', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', color: 'white' }}>
            โพสบริจาค
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '1px solid #ccc',
          padding: '8px 12px',
          marginBottom: '30px',
          maxWidth: '400px'
        }}>
          <input type="text" placeholder="ค้นหา" style={{ flex: 1, border: 'none', outline: 'none' }} />
          <img src="/search.png" alt="search" style={{ width: 20, height: 20, marginLeft: 8 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                <img
                  src={post.userAvatarUrl || '/default-avatar.png'}
                  alt="avatar"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
                <div>
                  <strong>{post.username || 'ไม่ระบุชื่อ'}</strong>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    {post.date || 'ไม่ระบุวันที่'} 📍 {post.location || 'ไม่ระบุที่อยู่'}
                  </p>
                </div>
              </div>

              <p>{post.caption}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '10px' }}
                />
              )}

              <p style={{ fontSize: 12, color: '#666' }}>💬 ติดต่อ</p>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button style={{
                  backgroundColor: 'orange',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  width: '48%'
                }}>
                  แก้ไข
                </button>
                <button style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  width: '48%'
                }}>
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
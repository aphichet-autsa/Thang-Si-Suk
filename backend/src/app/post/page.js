'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

export default function AdminPostScreen() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [activeTab, setActiveTab] = useState('PostSale');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, activeTab));
    const postData = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const post = { id: docSnap.id, ...docSnap.data() };

        if (post.uid) {
          try {
            const userDoc = await getDoc(doc(db, 'users', post.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();

              // ✅ ใช้ fallback หลายชื่อ field
              post.ownerName =
                userData.username || userData.name || userData.displayName || 'ไม่ระบุชื่อ';
              post.profileImageUrl = userData.profileImageUrl || '/default-avatar.png';
            } else {
              post.ownerName = 'ไม่ระบุชื่อ';
              post.profileImageUrl = '/default-avatar.png';
            }
          } catch (error) {
            console.error("❌ ดึงข้อมูล user ล้มเหลว:", error);
            post.ownerName = 'ไม่ระบุชื่อ';
            post.profileImageUrl = '/default-avatar.png';
          }
        } else {
          post.ownerName = 'ไม่ระบุชื่อ';
          post.profileImageUrl = '/default-avatar.png';
        }

        return post;
      })
    );
    setPosts(postData);
  };

  const handleDelete = async (id) => {
    if (confirm('คุณต้องการลบโพสต์นี้ใช่หรือไม่?')) {
      await deleteDoc(doc(db, activeTab, id));
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditCaption(post.caption || '');
  };

  const handleUpdate = async (id) => {
    await updateDoc(doc(db, activeTab, id), { caption: editCaption });
    setEditingPostId(null);
    setEditCaption('');
    fetchPosts();
  };

  const filteredPosts = posts.filter(post => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (post.ownerName?.toLowerCase().includes(lowerSearch) || false) ||
      (post.caption?.toLowerCase().includes(lowerSearch) || false)
    );
  });

  return (
    <MainLayout>
      <div style={{ padding: '40px', backgroundColor: '#f2f2f2' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          จัดการโพสต์{activeTab === 'PostSale' ? 'ซื้อขาย' : 'บริจาค'}
        </h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('PostSale')}
            style={{
              backgroundColor: activeTab === 'PostSale' ? '#0f0' : '#ccc',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            โพสต์ซื้อขาย
          </button>
          <button
            onClick={() => setActiveTab('PostDonate')}
            style={{
              backgroundColor: activeTab === 'PostDonate' ? '#0c8' : '#ccc',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            โพสต์บริจาค
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid #ccc',
            padding: '8px 12px',
            marginBottom: '30px',
            maxWidth: '400px'
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาโดยชื่อเจ้าของหรือคำอธิบายโพสต์"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none' }}
          />
          <img src="/search.png" alt="search" style={{ width: 20, height: 20, marginLeft: 8 }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredPosts.map((post) => {
            const isEditing = editingPostId === post.id;
            const showAllImages = isEditing || post.imageUrls?.length <= 2;
            const imagesToShow = showAllImages ? post.imageUrls : post.imageUrls.slice(0, 2);
            const extraCount = post.imageUrls?.length - 2;

            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                      gap: '10px'
                    }}
                  >
                    <img
                      src={post.profileImageUrl || '/default-avatar.png'}
                      alt="avatar"
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div>
                      <strong>{post.ownerName || 'ไม่ระบุชื่อ'}</strong>
                      <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                        📍 {post.address || 'ไม่ระบุที่อยู่'}
                      </p>
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        marginBottom: '10px'
                      }}
                    />
                  ) : (
                    <p>{post.caption || '-'}</p>
                  )}

                  {post.imageUrls?.length > 0 && (
                    <div
                      style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        marginBottom: '10px',
                        borderRadius: '10px'
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '10px'
                        }}
                      >
                        {imagesToShow.map((url, index) => (
                          <div
                            key={index}
                            style={{
                              width: '100%',
                              height: '200px',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <img
                              src={url}
                              alt={`post-${index}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '10px'
                              }}
                            />
                            {!isEditing && index === 1 && extraCount > 0 && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '10px',
                                  fontSize: '24px',
                                  fontWeight: 'bold'
                                }}
                              >
                                +{extraCount}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: '#666' }}>💬 ติดต่อ</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                  }}
                >
                  {isEditing ? (
                    <button
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        width: '48%'
                      }}
                      onClick={() => handleUpdate(post.id)}
                    >
                      บันทึก
                    </button>
                  ) : (
                    <button
                      style={{
                        backgroundColor: 'orange',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        width: '48%'
                      }}
                      onClick={() => handleEdit(post)}
                    >
                      แก้ไข
                    </button>
                  )}

                  <button
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '10px',
                      border: 'none',
                      width: '48%'
                    }}
                    onClick={() => handleDelete(post.id)}
                  >
                    ลบ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "@/firebase"; // Import firebase config

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Login Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. ดึงข้อมูล role จาก Firestore
      const userDocRef = doc(db, "useradmin", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.role === 'admin') {
          // ✅ ถ้าเป็น admin ไปหน้า home
          router.push('/home');
        } else {
          // ❌ ไม่ใช่ admin
          setError('คุณไม่มีสิทธิ์เข้าถึงระบบนี้');
          await signOut(auth);
        }
      } else {
        // ❌ ไม่มีข้อมูลใน Firestore
        setError('ไม่พบข้อมูลสิทธิ์ผู้ใช้');
        await signOut(auth);
      }

    } catch (err) {
      console.error(err);
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin} style={{ display: 'inline-block', marginTop: '20px' }}>
        <div>
          <input 
            type="email" 
            placeholder="ชื่อผู้ใช้หรืออีเมล" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '250px' }}
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="รหัสผ่าน" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '250px' }}
          />
        </div>
        <button 
          type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#00C853', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}
        >
          เข้าสู่ระบบ
        </button>
      </form>

      {/* แสดง error */}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
}

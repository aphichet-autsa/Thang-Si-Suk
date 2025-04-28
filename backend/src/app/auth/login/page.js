'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/home'); // กดแล้วไปหน้า Home
  };

  return (
    <div style={{
      backgroundImage: "url('/bg-login.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      {/* โลโก้ */}
      <Image 
        src="/thangsisuk.png" 
        alt="Thangsisuk Logo" 
        width={150} 
        height={150} 
        style={{ marginBottom: 20 }} 
        priority 
      />

      {/* กล่อง Login */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: '30px',
        borderRadius: '20px',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>เข้าสู่ระบบ</h2>
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="ชื่อผู้ใช้หรืออีเมล" 
            required 
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
          <input 
            type="password" 
            placeholder="รหัสผ่าน" 
            required 
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit"
            style={{
              backgroundColor: '#00C853',
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '18px',
              marginTop: '10px'
            }}
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}

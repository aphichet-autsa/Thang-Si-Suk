// src/app/auth/page.tsx

'use client';  // ระบุว่าเป็น Client Component

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";  // ใช้ next/navigation สำหรับ Next.js
import "./auth.css";  // นำเข้า CSS เท่าเดิม

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();  // ใช้ router จาก Next.js

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (email === "test@example.com" && password === "password123") {
      setSuccessMessage("✅ ล็อกอินสำเร็จ (Mock) !");
      setErrorMessage("");
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } else {
      setErrorMessage("❌ อีเมลหรือรหัสผ่านผิด (Mock)");
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-container">
      <div className="background-bar"></div>

      <div className="form-wrapper">
        <img src="/logo2.png" alt="Thang Si Suk" className="logo" />
        <h2>เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="form-container">
          <div className="container">
            <input type="email" name="email" placeholder="อีเมล" required ref={emailRef} />
            <input type="password" name="password" placeholder="รหัสผ่าน" required ref={passwordRef} />
            <button type="submit">ยืนยัน</button>

            <p className="register-text">หากยังไม่ได้สมัครสมาชิก?</p>
            <button
              type="button"
              className="register-btn"
              onClick={() => router.push("/register")}
            >
              สมัครสมาชิก
            </button>
          </div>

          {/* ข้อความแจ้งเตือน */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;

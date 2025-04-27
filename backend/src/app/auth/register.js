// src/app/auth/register/page.tsx
import { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';  // ใช้ useRouter แทน useNavigate
import { auth } from "../../libs/firebase";
import "./auth.css"; // ปรับ path ให้ถูกต้อง

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();  // ใช้ router จาก Next.js

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage("สมัครสมาชิกสำเร็จ! กำลังนำทางไปยังหน้าเข้าสู่ระบบ...");
      setTimeout(() => {
        router.push("/login"); // เปลี่ยนหน้าไป login หลังจาก 2 วินาที
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrorMessage("สมัครสมาชิกไม่สำเร็จ: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="background-bar"></div>

      <div className="form-wrapper">
        <img src="/logo2.png" alt="Thang Si Suk" className="logo" />
        <h2>สมัครสมาชิก</h2>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="container">
            <input type="email" name="email" placeholder="อีเมล" required ref={emailRef} />
            <input type="password" name="password" placeholder="รหัสผ่าน" required ref={passwordRef} />
            <input type="password" name="confirmPassword" placeholder="ยืนยันรหัสผ่าน" required ref={confirmPasswordRef} />

            <button type="submit">ยืนยัน</button>
            <button className="register-btn" onClick={() => router.push("/login")}>
              เข้าสู่ระบบ
            </button>
          </div>

          {/* ✅ แสดงข้อความแจ้งเตือน */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;

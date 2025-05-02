'use client';

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [knowledges, setKnowledges] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email.split("@")[0]);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchKnowledges();
  }, []);

  const fetchKnowledges = async () => {
    const querySnapshot = await getDocs(collection(db, "knowledges"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setKnowledges(data);
  };

  const handleUpload = async (e, position = "top") => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dd0ro6iov/image/upload",
        formData
      );

      const url = res.data.secure_url;
      await addDoc(collection(db, "knowledges"), {
        imageUrl: url,
        position,
      });
      alert("อัปโหลดสำเร็จ");
      fetchKnowledges();
    } catch (error) {
      alert("อัปโหลดล้มเหลว");
    }
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "knowledges", id);
    await deleteDoc(docRef);
    fetchKnowledges();
  };

  const handleLogout = () => {
    auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ fontFamily: "sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#91E2FF", padding: "0px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "80px" }}>
        <h2 style={{ margin: "0", fontWeight: "bold" }}>THANGSISUK</h2>
        <Image src="/minilogo.png" alt="Mini Logo" width={40} height={40} />
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: "250px", backgroundColor: "#E2E2E2", padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ backgroundColor: "#E0E0E0", width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px" }}>
              <Image src="/profile.png" alt="Profile" width={50} height={50} />
            </div>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>{userName}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={buttonStyle}>จัดการความรู้ในระบบ</button>
            <button style={buttonStyle} onClick={() => router.push("/shop")} >ร้านค้าในระบบ</button>
            <button style={buttonStyle}>จัดการโพส</button>
            <button style={buttonStyle} onClick={() => router.push("/userlist")}>
              ผู้ใช้ในระบบ
            </button>
            <button style={buttonStyle} onClick={() => router.push('/dashboard')}>แดชบอร์ด</button>
            <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: "red", color: "white", marginTop: "10px" }}>
              <Image src="/Logout.png" alt="Logout Icon" width={24} height={24} /> ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, backgroundColor: "#FFF9C4", padding: "30px" }}>
          <h1>ข้อมูลความรู้ในระบบ</h1>

          {/* Banner Image Upload */}
          <section style={sectionStyle}>
            <label style={labelStyle}>รูปภาพแถวบน <b>(Banner)</b></label>
            <div style={uploadBox}>
              <label style={iconButton}>
                ➕
                <input type="file" hidden onChange={(e) => handleUpload(e, "top")} />
              </label>
            </div>
          </section>

          {/* Infographic Image Upload */}
          <section style={sectionStyle}>
            <label style={labelStyle}>รูปภาพแถวล่าง <b>(Infographic)</b></label>
            <div style={uploadBox}>
              <label style={iconButton}>
                ➕
                <input type="file" hidden onChange={(e) => handleUpload(e, "bottom")} />
              </label>
            </div>
          </section>

          {/* Display Uploaded Images */}
          <div style={imageContainer}>
            {knowledges.map((item) => (
              <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={imageBox}>
                  <img src={item.imageUrl} alt="Uploaded Image" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />
                  <button style={closeButton} onClick={() => handleDelete(item.id)}>❌</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontWeight: "bold",
};

const sectionStyle = {
  marginBottom: 30,
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: 10,
  display: "block",
  fontSize: 16,
};

const uploadBox = {
  width: 200,
  height: 100,
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const iconButton = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  backgroundColor: "#e0e0e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  cursor: "pointer",
};

const imageContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "flex-start",
};

const imageBox = {
  width: "320px",
  height: "200px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px",
  position: "relative",
  overflow: "hidden", // ซ่อนส่วนที่เกินจากกรอบ
};

const closeButton = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#ff0000", // ปรับสีให้เหมาะสม
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // ทำให้ภาพไม่เกินกรอบและไม่บิดเบี้ยว
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // เพิ่มเงาที่ภาพ
};
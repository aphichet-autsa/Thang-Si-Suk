'use client';

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { MainLayout } from "../components/layout/MainLayout";

export default function HomePage() {
  const [knowledges, setKnowledges] = useState([]);

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

      // หาจำนวนของตำแหน่งปัจจุบันเพื่อตั้งชื่อ doc เช่น top1, bottom3
      const querySnapshot = await getDocs(collection(db, "knowledges"));
      const filtered = querySnapshot.docs.filter(d => d.data().position === position);
      const docId = `${position}${filtered.length + 1}`;

      await setDoc(doc(db, "knowledges", docId), {
        imageUrl: url,
        position,
      });

      alert("อัปโหลดสำเร็จ");
      fetchKnowledges();
    } catch (error) {
      alert("อัปโหลดล้มเหลว");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "knowledges", id));
    fetchKnowledges();
  };

  return (
    <MainLayout activeMenu="home">
      <h1>ข้อมูลความรู้ในระบบ</h1>

      {/* ================= Banner Section ================= */}
      <h2 style={{ marginTop: 30 }}>ภาพแถวบน (Banner)</h2>
      <div style={imageContainer}>
        <div style={imageBox}>
          <label style={iconButton}>
            ➕
            <input type="file" hidden onChange={(e) => handleUpload(e, "top")} />
          </label>
        </div>

        {knowledges
          .filter(item => item.position === 'top')
          .map(item => (
            <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={imageBox}>
                <img src={item.imageUrl} alt="Uploaded" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />
                <button style={closeButton} onClick={() => handleDelete(item.id)}>❌</button>
              </div>
            </div>
          ))}
      </div>

      {/* ================= Infographic Section ================= */}
      <h2 style={{ marginTop: 30 }}>ภาพแถวล่าง (Infographic)</h2>
      <div style={imageContainer}>
        <div style={imageBox}>
          <label style={iconButton}>
            ➕
            <input type="file" hidden onChange={(e) => handleUpload(e, "bottom")} />
          </label>
        </div>

        {knowledges
          .filter(item => item.position === 'bottom')
          .map(item => (
            <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={imageBox}>
                <img src={item.imageUrl} alt="Uploaded" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />
                <button style={closeButton} onClick={() => handleDelete(item.id)}>❌</button>
              </div>
            </div>
          ))}
      </div>
    </MainLayout>
  );
}

// ================= STYLE =================

const imageContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "flex-start",
  marginBottom: "40px",
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
  overflow: "hidden",
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

const closeButton = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#ff0000",
};

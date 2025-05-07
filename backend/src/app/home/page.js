'use client';

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
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

  return (
    <MainLayout activeMenu="home">
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
    </MainLayout>
  );
}

// สไตล์ต่างๆ ที่ใช้เฉพาะในหน้านี้
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
  overflow: "hidden",
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
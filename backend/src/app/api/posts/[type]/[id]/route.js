import { db } from '@/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// DELETE: ลบโพสต์
export async function DELETE(_, { params }) {
  const { type, id } = params;
  try {
    await deleteDoc(doc(db, type, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'ลบโพสต์ไม่สำเร็จ', detail: err.message },
      { status: 500 }
    );
  }
}

// PUT: แก้ไขโพสต์
export async function PUT(req, { params }) {
  const { type, id } = params;
  const data = await req.json();

  try {
    await updateDoc(doc(db, type, id), data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'อัปเดตโพสต์ไม่สำเร็จ', detail: err.message },
      { status: 500 }
    );
  }
}

// src/app/api/shops/route.js
import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'shops'));
    const shops = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        docId: doc.id,
        ...d,
        createdAt:
          d.createdAt instanceof Timestamp
            ? d.createdAt.toDate().toLocaleString()
            : d.createdAt || '',
      };
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error loading shops:', error);
    return NextResponse.json({ error: 'โหลดร้านค้าไม่สำเร็จ', detail: error.message }, { status: 500 });
  }
}

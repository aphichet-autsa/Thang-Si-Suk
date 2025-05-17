// components/StackedBarByArea.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarByArea = ({ data }) => {
  if (!data) return <p style={{ textAlign: 'center' }}>ไม่มีข้อมูลพื้นที่</p>;

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: 400
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: 20 }}>เปรียบเทียบโพสต์บริจาค vs ขาย แยกตามพื้นที่</h3>
      <div style={{ height: '85%' }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
              },
              legend: {
                position: 'top'
              }
            },
            scales: {
              x: { stacked: true },
              y: {
                beginAtZero: true,
                stacked: true,
              },
            }
          }}
        />
      </div>
    </div>
  );
};

export default StackedBarByArea;

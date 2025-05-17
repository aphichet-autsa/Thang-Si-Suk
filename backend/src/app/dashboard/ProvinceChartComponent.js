// components/ProvinceChartComponent.js
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

const ProvinceChartComponent = ({ data }) => {
  if (!data) return <p style={{ textAlign: 'center' }}>ไม่มีข้อมูลจังหวัด</p>;

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: 350
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: 20 }}>จำนวนร้านค้าต่อจังหวัด</h3>
      <div style={{ height: '85%' }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.raw}`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProvinceChartComponent;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ userStats }) => {
  const data = {
    labels: ['ผู้ใช้งาน', 'ร้านค้า', 'โพสต์ขาย', 'โพสต์บริจาค'],
    datasets: [
      {
        label: 'จำนวน',
        data: [userStats.users, userStats.shops, userStats.posts, userStats.donations],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: 350,
      }}
    >
      <h3 style={{ marginBottom: 20, textAlign: 'center' }}>สถิติรวมทั้งหมด</h3>
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
                  label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => value.toLocaleString(),
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartComponent;

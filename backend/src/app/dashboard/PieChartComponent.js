import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ data }) => {
  return (
    <div style={{ height: '100%' }}>
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false, // ให้ขยายเต็มกรอบ
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((context.raw / total) * 100);
                  return `${context.label}: ${context.raw} (${percentage}%)`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChartComponent;

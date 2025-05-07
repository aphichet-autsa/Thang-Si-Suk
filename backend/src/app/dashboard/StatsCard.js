'use client';

export const StatsCard = ({ title, value, color }) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h3 style={{ marginBottom: '10px', color: '#666' }}>{title}</h3>
      <p style={{ 
        fontSize: '32px',
        fontWeight: 'bold',
        color: color
      }}>{value}</p>
    </div>
  );
};
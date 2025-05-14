'use client';

export const StatsCard = ({ title, value, color, icon }) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '10px'
      }}>
        <span style={{ 
          fontSize: '24px',
          marginRight: '8px'
        }}>{icon}</span>
        <h3 style={{ 
          margin: 0,
          color: '#666',
          fontSize: '16px'
        }}>{title}</h3>
      </div>
      <p style={{ 
        fontSize: '32px',
        fontWeight: 'bold',
        color: color,
        margin: 0
      }}>{value.toLocaleString()}</p>
    </div>
  );
};
'use client';

export const StatsCard = ({ title, value, color, icon }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        textAlign: "center",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 24, marginRight: 8 }}>{icon}</span>
        <h3 style={{ margin: 0, color: "#666", fontSize: 16 }}>{title}</h3>
      </div>
      <p
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: color,
          margin: 0,
        }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
};

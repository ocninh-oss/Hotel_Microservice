import React from 'react';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: '#fff',
    borderRadius: '16px',
    padding: '22px 24px',
    flex: '1 1 180px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: color + '22',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {React.cloneElement(icon, { size: 22, color })}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '500' }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: '700', color: '#0F2E5A' }}>{value}</p>
      {sub && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>{sub}</p>}
    </div>
  </div>
);

export default StatCard;

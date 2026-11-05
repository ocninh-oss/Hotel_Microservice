import React from 'react';
import { LayoutDashboard, Users, BedDouble, CalendarCheck, Tag, Newspaper, ConciergeBell, Shield } from 'lucide-react';

const menuBtn = {
  width: '100%',
  padding: '12px 20px',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#334155',
  fontWeight: '500',
  borderRadius: '8px',
  marginBottom: '4px',
};

const activeMenuBtn = {
  ...menuBtn,
  background: '#F0F6FF',
  color: '#2563EB',
  fontWeight: '600',
};

const AdminSidebar = ({ activeTab, setActiveTab }) => (
  <div style={{
    width: '250px',
    background: '#fff',
    borderRight: '1px solid #E2E8F0',
    padding: '20px 0',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
  }}>
    <div style={{
      padding: '0 20px 20px',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <Shield size={20} color="#2563EB" />
      <h3 style={{ margin: 0, fontSize: '16px', color: '#0F2E5A' }}>Quản trị</h3>
    </div>
    <nav style={{ padding: '20px 0' }}>
      {[
        { key: 'dashboard', icon: <LayoutDashboard size={16} style={{ marginRight: '8px' }} />, label: 'Dashboard' },
        { key: 'bookings', icon: <CalendarCheck size={16} style={{ marginRight: '8px' }} />, label: 'Đặt phòng' },
        { key: 'rooms', icon: <BedDouble size={16} style={{ marginRight: '8px' }} />, label: 'Phòng nghỉ' },
        { key: 'services', icon: <ConciergeBell size={16} style={{ marginRight: '8px' }} />, label: 'Dịch vụ' },
        { key: 'users', icon: <Users size={16} style={{ marginRight: '8px' }} />, label: 'Người dùng' },
        { key: 'vouchers', icon: <Tag size={16} style={{ marginRight: '8px' }} />, label: 'Voucher' },
        { key: 'news', icon: <Newspaper size={16} style={{ marginRight: '8px' }} />, label: 'Tin tức' },
      ].map(item => (
        <button
          key={item.key}
          onClick={() => setActiveTab(item.key)}
          style={activeTab === item.key ? activeMenuBtn : menuBtn}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  </div>
);

export default AdminSidebar;

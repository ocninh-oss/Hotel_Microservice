import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const API_BASE = 'http://localhost:8080';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId') || '';

  const [formData, setFormData] = useState({
    roomId: roomId,
    checkInDate: '',
    checkOutDate: '',
    voucherCode: '',
    services: []
  });

 const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Vui lòng đăng nhập để đặt phòng!");
      navigate('/login');
      return;
    }

    try {
      // 1. Sửa URL: bỏ /api
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok || res.status === 201) {
        alert("Đặt phòng thành công!");
        navigate('/booking-history');
      } else {
        // 2. Đọc message linh hoạt cả text lẫn json
        let errMsg = "Không thể đặt phòng";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await res.json();
            errMsg = errData.message || errMsg;
          } else {
            errMsg = await res.text() || errMsg;
          }
        } catch (_) {}
        alert(`Lỗi: ${errMsg}`);
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '24px', textAlign: 'center' }}>Xác nhận đặt phòng</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Mã phòng (ID)</label>
              <input type="text" value={formData.roomId} readOnly style={{...inputStyle, background: '#F1F5F9'}} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Ngày nhận phòng</label>
                <input type="date" required style={inputStyle} 
                  onChange={e => setFormData({...formData, checkInDate: e.target.value})} />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Ngày trả phòng</label>
                <input type="date" required style={inputStyle}
                  onChange={e => setFormData({...formData, checkOutDate: e.target.value})} />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Mã giảm giá (nếu có)</label>
              <input type="text" placeholder="Nhập mã voucher" style={inputStyle}
                onChange={e => setFormData({...formData, voucherCode: e.target.value})} />
            </div>

            <button type="submit" style={btnStyle}>Tiến hành đặt phòng</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const formGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' };
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #CBD5E1',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box'
};
const btnStyle = {
  width: '100%',
  padding: '14px',
  background: '#3B82F6',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '10px'
};
export default Booking;
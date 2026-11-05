import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RoomCard from '../components/rooms/RoomCard';
import { Sparkles, Calendar, Search, Filter, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState('');

  const loadRooms = () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (checkInDate) params.set('checkInDate', checkInDate);
    if (checkOutDate) {
      const date = new Date(checkOutDate);
      date.setDate(date.getDate() + 1);
      params.set('checkOutDate', date.toISOString().split('T')[0]);
    }
    if (selectedType) params.set('type', selectedType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`${API_BASE}/rooms?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Lấy phòng thất bại');
        return res.json();
      })
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi tải phòng:', err);
        setError('Không thể tải dữ liệu phòng. Vui lòng thử lại.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSearch = () => {
    if (checkInDate && checkOutDate && checkOutDate < checkInDate) {
      setError('Ngày trả phải sau ngày nhận.');
      return;
    }
    loadRooms();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />

      {/* Premium Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0F2E5A 0%, #1E40AF 100%)',
        padding: '100px 2rem 160px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '40%', height: '80%',
          background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(120px)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%', width: '40%', height: '80%',
          background: 'rgba(30, 64, 175, 0.2)', filter: 'blur(120px)', borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
            padding: '6px 16px', borderRadius: '20px', color: '#BFDBFE',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={14} /> KHÔNG GIAN NGHỈ DƯỠNG ĐẲNG CẤP
          </div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#FFFFFF', 
            marginBottom: '20px', lineHeight: '1.2', fontWeight: '700'
          }}>
            Danh sách phòng nghỉ
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Khám phá không gian nghỉ dưỡng tinh tế, mang lại sự thư giãn tuyệt đối cho kỳ nghỉ của bạn.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-80px auto 80px', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
        
        {/* Main Search Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '24px',
          alignItems: 'flex-end',
          marginBottom: '32px',
          padding: '32px',
          borderRadius: '24px',
          background: '#fff',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.08)',
          border: '1px solid #F1F5F9'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#3B82F6" /> NGÀY NHẬN PHÒNG
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={e => {
                const checkIn = e.target.value;
                setCheckInDate(checkIn);
                if (checkIn) {
                  const date = new Date(checkIn);
                  date.setDate(date.getDate() + 1);
                  setCheckOutDate(date.toISOString().split('T')[0]);
                }
              }}
              style={{
                padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0',
                background: '#F8FAFC', color: '#0F172A', outline: 'none', transition: 'all 0.2s',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#3B82F6" /> NGÀY TRẢ PHÒNG
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={e => setCheckOutDate(e.target.value)}
              style={{
                padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0',
                background: '#F8FAFC', color: '#0F172A', outline: 'none', transition: 'all 0.2s',
                fontSize: '15px'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              padding: '16px 40px', borderRadius: '14px', border: 'none',
              background: '#2563EB', color: '#fff', cursor: 'pointer',
              fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s'
            }}
          >
            <Search size={18} /> TÌM PHÒNG NGAY
          </button>
        </div>

        {/* BỘ LỌC NÂNG CAO */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '48px',
          padding: '24px 32px',
          borderRadius: '20px',
          background: 'rgba(37, 99, 235, 0.03)',
          border: '1px solid rgba(37, 99, 235, 0.1)',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: '700', fontSize: '14px' }}>
              <Filter size={16} /> LỌC THEO:
            </div>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{ 
                padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', 
                background: '#fff', fontSize: '14px', color: '#475569', outline: 'none',
                minWidth: '180px'
              }}
            >
              <option value="">Tất cả loại phòng</option>
              <option value="STANDARD">Standard</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
              <option value="PRESIDENTIAL">Presidential</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="number"
                placeholder="Giá từ (₫)"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{ width: '140px', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '14px', outline: 'none' }}
              />
              <ArrowRight size={14} color="#94A3B8" />
              <input
                type="number"
                placeholder="Giá đến (₫)"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ width: '140px', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <button
            onClick={loadRooms}
            style={{ 
              background: '#2563EB', color: '#fff', padding: '10px 24px', 
              borderRadius: '12px', fontSize: '14px', fontWeight: '700', 
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            ÁP DỤNG LỌC
          </button>
        </div>

        {error && (
          <div style={{
            marginBottom: '24px', padding: '14px 18px', borderRadius: '14px',
            background: '#FEF3F2', color: '#B91C1C', border: '1px solid #FECACA'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải danh sách phòng...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '60px' }}>
            Hiện tại không có phòng nào khả dụng.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Rooms;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Maximize, ArrowRight } from 'lucide-react';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      borderRadius: '18px',
      border: '1px solid #DBEAFE',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      <div style={{ height: '200px', background: '#E2E8F0', position: 'relative' }}>
        {/* Nhãn loại phòng - Luôn hiển thị trên cùng */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '4px 14px', background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '20px', fontSize: '11px', fontWeight: '800', 
          color: '#1E40AF', zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {room.type}
        </div>

        {room.images && room.images.length > 0 ? (
          <img 
            src={room.images[0]} 
            alt={`Ảnh phòng ${room.roomNumber}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ 
            width: '100%', height: '100%', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', color: '#94A3B8',
            fontSize: '14px', fontWeight: '500'
          }}>
            Ảnh phòng {room.roomNumber}
          </div>
        )}
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F2E5A' }}>Phòng {room.roomNumber}</h3>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563EB' }}>{room.basePrice?.toLocaleString()}đ</span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>/đêm</span>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {room.description || 'Không có mô tả cho phòng này.'}
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
            <Users size={14} /> {room.maxOccupancy} người
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: 'auto' }}>
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            style={{
              padding: '10px', borderRadius: '10px', border: '1px solid #DBEAFE',
              background: '#F8FBFF', color: '#2563EB', fontWeight: '600',
              fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = '#EFF6FF'}
            onMouseLeave={e => e.target.style.background = '#F8FBFF'}
          >
            Chi tiết <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
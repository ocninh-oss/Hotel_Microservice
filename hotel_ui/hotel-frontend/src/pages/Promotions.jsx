import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Gift, AlertCircle, Sparkles, Ticket, Copy, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:8083';

const Promotions = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(`${API_BASE}/vouchers`);
        if (!res.ok) throw new Error('Không thể tải danh sách khuyến mãi');
        const data = await res.json();
        setVouchers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const voucherVisuals = [
    { bg: '#F0F9FF', border: '#BAE6FD', iconBg: '#E0F2FE', iconColor: '#0284C7', titleColor: '#0369A1' },
    { bg: '#F0FDF4', border: '#BBF7D0', iconBg: '#DCFCE7', iconColor: '#16A34A', titleColor: '#15803D' },
    { bg: '#FDF4FF', border: '#F5D0FE', iconBg: '#FAE8FF', iconColor: '#A21CAF', titleColor: '#86198F' },
    { bg: '#FFF7ED', border: '#FFEDD5', iconBg: '#FFEDD5', iconColor: '#EA580C', titleColor: '#C2410C' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />

      {/* Premium Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        padding: '100px 2rem 160px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '30%', height: '50%',
          background: 'rgba(99, 102, 241, 0.2)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '50%',
          background: 'rgba(79, 70, 229, 0.3)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
            padding: '6px 16px', borderRadius: '20px', color: '#C7D2FE',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={14} /> ƯU ĐÃI ĐẶC QUYỀN
          </div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#FFFFFF', 
            marginBottom: '20px', lineHeight: '1.2', fontWeight: '700'
          }}>
            Chương trình Khuyến mãi
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Tận hưởng kỳ nghỉ mơ ước với những ưu đãi hấp dẫn dành riêng cho thành viên và khách hàng thân thiết.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ maxWidth: '1200px', margin: '-80px auto 80px', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#ffffffff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
             <div className="spinner" style={{ 
              width: '40px', height: '40px', border: '4px solid #F1F5F9', 
              borderTop: '4px solid #4F46E5', borderRadius: '50%', margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748B', fontWeight: '500' }}>Đang tìm kiếm những ưu đãi tốt nhất...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: '#FFF1F2', borderRadius: '24px', border: '1px solid #FECACA' }}>
            <AlertCircle size={40} color="#EF4444" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#B91C1C', fontWeight: '600' }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 24px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Thử lại</button>
          </div>
        ) : vouchers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: '#fff', borderRadius: '24px', color: '#94A3B8', border: '1px solid #F1F5F9' }}>
            <div style={{ width: '80px', height: '80px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Ticket size={40} color="#CBD5E1" />
            </div>
            <p style={{ fontSize: '18px' }}>Hiện tại không có chương trình khuyến mãi nào.</p>
            <p style={{ fontSize: '14px' }}>Quay lại sau nhé!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
            {vouchers.map((v, i) => {
              const visual = voucherVisuals[i % voucherVisuals.length];
              const isCopied = copiedCode === v.code;

              return (
                <div key={v.id || i} className="promo-card" style={{ 
                  background: visual.bg, 
                  border: `1px solid ${visual.border}`, 
                  borderRadius: '24px', 
                  padding: '32px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default'
                }}>
                  {/* Decorative circle */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: visual.iconBg, borderRadius: '50%', opacity: 0.5 }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                      <Gift size={30} color={visual.iconColor} />
                    </div>
                    <div>
                      <div style={{ color: visual.iconColor, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>ƯU ĐÃI THÁNG</div>
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: visual.titleColor, margin: 0 }}>
                        Giảm {v.discountPercent}%
                      </h3>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(227, 213, 213, 0.5)', 
                    padding: '20px', 
                    borderRadius: '16px', 
                    marginBottom: '24px',
                    border: '1px solid #fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Giảm tối đa</span>
                      <span style={{ fontWeight: '700', color: '#1E293B' }}>{v.maxDiscountAmount?.toLocaleString()}đ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Đơn tối thiểu</span>
                      <span style={{ fontWeight: '700', color: '#1E293B' }}>{v.minOrderValue?.toLocaleString()}đ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Hạn dùng</span>
                      <span style={{ fontWeight: '700', color: '#1E293B' }}>{v.expiryDate || 'Vô thời hạn'}</span>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#fff',
                    padding: '8px 8px 8px 20px',
                    borderRadius: '16px',
                    border: `1.5px dashed ${visual.border}`
                  }}>
                    <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: visual.titleColor, letterSpacing: '1px' }}>
                      {v.code}
                    </div>
                    <button 
                      onClick={() => handleCopy(v.code)}
                      style={{ 
                        background: isCopied ? '#10B981' : visual.iconColor, 
                        color: '#fff', 
                        padding: '10px 20px', 
                        borderRadius: '12px', 
                        fontWeight: '700', 
                        fontSize: '13px', 
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                      }}
                    >
                      {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {isCopied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP MÃ'}
                    </button>
                  </div>

                  <style>{`
                    .promo-card:hover {
                      transform: translateY(-10px);
                      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Promotions;

import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Calendar, CreditCard, Info, ChevronRight,
  MapPin, Clock, Package, Gift, X, Sparkles, Receipt, CheckCircle2, AlertCircle
} from 'lucide-react';
const API_BASE = 'http://localhost:8080';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để xem lịch sử đặt phòng.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        let errorMsg = `Lỗi ${res.status}: Không thể tải lịch sử`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errData.error || errorMsg;
        } catch (_) {
          // Bỏ qua nếu không parse được JSON
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt phòng này?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn');
        return;
      }

      // Bỏ /api trong route hủy đơn
      const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Đã hủy đơn đặt phòng thành công');
        setSelectedBooking(null);
        loadBookings();
      } else {
        let msg = 'Không thể hủy đơn';
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch (_) {
          msg = await res.text() || msg;
        }
        alert('Lỗi: ' + msg);
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };  

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FFF7ED', text: '#C2410C', label: 'Chờ xác nhận', dot: '#F97316' };
      case 'CONFIRMED':
        return { bg: '#EFF6FF', text: '#1D4ED8', label: 'Đã xác nhận', dot: '#3B82F6' };
      case 'COMPLETED':
        return { bg: '#F0FDF4', text: '#15803D', label: 'Hoàn tất', dot: '#22C55E' };
      case 'CANCELLED':
        return { bg: '#FEF2F2', text: '#B91C1C', label: 'Đã hủy', dot: '#EF4444' };
      default:
        return { bg: '#F8FAFC', text: '#475569', label: status, dot: '#CBD5E1' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#244f86ff', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />

      {/* Premium Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '100px 2rem 160px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '30%', height: '50%',
          background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '50%',
          background: 'rgba(30, 64, 175, 0.15)', filter: 'blur(100px)', borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
            padding: '6px 16px', borderRadius: '20px', color: '#CBD5E1',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Receipt size={14} /> QUẢN LÝ GIAO DỊCH
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#FFFFFF',
            marginBottom: '20px', lineHeight: '1.2', fontWeight: '700'
          }}>
            Lịch sử đặt phòng
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Quản lý và xem lại tất cả các giao dịch của bạn một cách chi tiết và minh bạch.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-80px auto 80px', padding: '0 2rem', position: 'relative', zIndex: 2 }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
            <div className="spinner" style={{
              width: '40px', height: '40px', border: '4px solid #F1F5F9',
              borderTop: '4px solid #2563EB', borderRadius: '50%', margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748B', fontWeight: '500' }}>Đang tải lịch sử giao dịch...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#FFF1F2', borderRadius: '32px', border: '1px solid #FECACA' }}>
            <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#B91C1C', fontWeight: '600', fontSize: '18px' }}>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: '#fff', borderRadius: '32px', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Calendar size={40} color="#CBD5E1" />
            </div>
            <h3 style={{ fontSize: '22px', color: '#1E293B', marginBottom: '12px', fontWeight: '700' }}>Bạn chưa có đơn đặt phòng nào</h3>
            <p style={{ color: '#64748B', marginBottom: '32px' }}>Hãy bắt đầu kỳ nghỉ của bạn bằng cách khám phá những căn phòng tuyệt vời nhất.</p>
            <button
              onClick={() => window.location.href = '/rooms'}
              style={{
                padding: '16px 40px', background: '#2563EB', color: '#fff',
                border: 'none', borderRadius: '16px', fontWeight: '800',
                cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              ĐẶT PHÒNG NGAY <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '32px' }}>
            {bookings.map((b) => {
              const status = getStatusColor(b.status);
              return (
                <div key={b.id} className="booking-card" style={{
                  background: '#F0F7FF',
                  borderRadius: '28px',
                  padding: '32px',
                  border: '1px solid #DBEAFE',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  cursor: 'default'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Receipt size={14} color="#2563EB" />
                        <span style={{ fontWeight: '800', fontSize: '15px', color: '#1E3A8A' }}>ĐƠN #{b.id}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Ngày đặt: {new Date(b.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div style={{
                      background: status.bg, color: status.text, padding: '8px 16px',
                      borderRadius: '14px', fontSize: '12px', fontWeight: '800',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ width: '6px', height: '6px', background: status.dot, borderRadius: '50%' }} />
                      {status.label.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{
                      width: '56px', height: '56px', background: '#FFFFFF',
                      borderRadius: '18px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.1)'
                    }}>
                      <MapPin size={26} color="#2563EB" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#1E3A8A', fontSize: '18px', marginBottom: '2px' }}>Phòng {b.roomNumber || 'N/A'}</div>
                      <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{b.roomType || 'Phòng nghỉ cao cấp'}</div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
                    padding: '20px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '20px',
                    border: '1px solid #fff'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Thời gian lưu trú</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1E3A8A', fontWeight: '600' }}>
                        <Clock size={14} />
                        <span>{b.checkInDate} - {b.checkOutDate}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Tổng thanh toán</span>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#2563EB' }}>
                        {b.totalPrice?.toLocaleString()} <small style={{ fontSize: '12px' }}>VNĐ</small>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="detail-btn"
                    style={{
                      marginTop: '8px', padding: '14px', background: '#fff', border: '1.5px solid #DBEAFE',
                      borderRadius: '16px', color: '#2563EB', fontWeight: '700', fontSize: '14px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', transition: 'all 0.3s'
                    }}
                  >
                    XEM CHI TIẾT ĐƠN <ChevronRight size={18} />
                  </button>

                  <style>{`
                    .booking-card:hover {
                      transform: translateY(-10px);
                      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                      border-color: #DBEAFE;
                    }
                    .detail-btn:hover {
                      background: #F8FAFC;
                      border-color: #CBD5E1;
                      color: #0F172A;
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
      </div>

      {/* DETAIL MODAL - Premium Redesign */}
      {selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedBooking(null)}>
          <div style={{ background: '#fff', borderRadius: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'modalIn 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Chi tiết giao dịch</span>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>Mã đơn #{selectedBooking.id}</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ border: 'none', background: '#F8FAFC', color: '#64748B', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={22} /></button>
            </div>

            <div style={{ padding: '32px' }}>
              {/* Customer Info Section */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#94A3B8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}><Info size={16} /> THÔNG TIN KHÁCH ĐẶT</h4>
                <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748B', fontWeight: '500' }}>Họ và tên</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>{selectedBooking.customerName || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748B', fontWeight: '500' }}>Số điện thoại</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>{selectedBooking.customerPhone || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontWeight: '500' }}>Email</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>{selectedBooking.customerEmail || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Room Section */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#94A3B8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}><MapPin size={16} /> CHI TIẾT LƯU TRÚ</h4>
                <div style={{ padding: '24px', background: '#F0F9FF', borderRadius: '24px', border: '1px solid #E0F2FE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={24} color="#0369A1" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '18px', color: '#0369A1' }}>Phòng {selectedBooking.roomNumber}</div>
                      <div style={{ color: '#0EA5E9', fontSize: '13px', fontWeight: '600' }}>{selectedBooking.roomType}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#fff', padding: '14px', borderRadius: '16px', border: '1px solid #E0F2FE' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Ngày nhận</span>
                      <span style={{ display: 'block', fontSize: '15px', fontWeight: '800', color: '#1E293B' }}>{selectedBooking.checkInDate}</span>
                    </div>
                    <div style={{ background: '#fff', padding: '14px', borderRadius: '16px', border: '1px solid #E0F2FE' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Ngày trả</span>
                      <span style={{ display: 'block', fontSize: '15px', fontWeight: '800', color: '#1E293B' }}>{selectedBooking.checkOutDate}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', color: '#0369A1', fontSize: '13px', fontWeight: '600', background: 'rgba(255,255,255,0.5)', padding: '10px 16px', borderRadius: '12px' }}>
                    <span>Số lượng khách:</span>
                    <span>{selectedBooking.occupancy || 2} người</span>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              {selectedBooking.services && selectedBooking.services.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#94A3B8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}><Package size={16} /> DỊCH VỤ ĐÃ ĐẶT</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedBooking.services.map((s, idx) => {
                      const total = s.price * s.quantity * (s.numberOfPeople || 1) * (s.numberOfDays || 1);
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', border: '1.5px solid #F1F5F9', borderRadius: '20px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '800', color: '#1E293B', fontSize: '15px' }}>{s.serviceName}</div>
                            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>
                              {s.price.toLocaleString()}đ × {s.quantity}
                              {s.numberOfPeople ? ` × ${s.numberOfPeople} người` : ''}
                              {s.numberOfDays ? ` × ${s.numberOfDays} ngày` : ''}
                            </div>
                          </div>
                          <div style={{ fontWeight: '800', color: '#2563EB', fontSize: '15px' }}>{total.toLocaleString()}đ</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payment Section */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#94A3B8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}><CreditCard size={16} /> CHI TIẾT THANH TOÁN</h4>
                <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '24px', border: '1.5px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#64748B' }}>
                    <span>Tiền phòng</span>
                    <span style={{ fontWeight: '700', color: '#1E293B' }}>{selectedBooking.totalRoomPrice?.toLocaleString()}đ</span>
                  </div>
                  {selectedBooking.totalServicePrice > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#64748B' }}>
                      <span>Tổng tiền dịch vụ</span>
                      <span style={{ fontWeight: '700', color: '#1E293B' }}>{selectedBooking.totalServicePrice?.toLocaleString()}đ</span>
                    </div>
                  )}
                  {selectedBooking.voucherCode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#059669', background: '#ECFDF5', padding: '10px 16px', borderRadius: '14px', margin: '12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
                        <Gift size={16} />
                        <span>Mã giảm giá: {selectedBooking.voucherCode}</span>
                      </div>
                      <span style={{ fontWeight: '800' }}>-{selectedBooking.discountAmount?.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1.5px dashed #E2E8F0', fontWeight: '900', fontSize: '24px', color: '#0F172A' }}>
                    <span>Tổng cộng</span>
                    <span style={{ color: '#2563EB' }}>{selectedBooking.totalPrice?.toLocaleString()}đ</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                    <div style={{ padding: '8px 16px', borderRadius: '12px', background: selectedBooking.paymentStatus ? '#ECFDF5' : '#FFF7ED', color: selectedBooking.paymentStatus ? '#059669' : '#C2410C', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {selectedBooking.paymentStatus ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {selectedBooking.paymentStatus ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                    </div>

                    {selectedBooking.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelBooking(selectedBooking.id)}
                        style={{ padding: '10px 20px', background: '#FFF1F2', color: '#E11D48', border: '1.5px solid #FFE4E6', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FFE4E6'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FFF1F2'; }}
                      >
                        HỦY ĐƠN HÀNG
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookingHistory;

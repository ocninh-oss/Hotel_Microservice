import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import {
  User, Mail, Phone, Calendar, MapPin,
  ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, MessageSquare
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const getStoredToken = () => {
  // Thử lấy trực tiếp nếu bạn lưu riêng lẻ
  const token = localStorage.getItem('token');
  if (token) return token;

  // Lấy từ object 'user' mà bạn đã lưu khi đăng nhập
  const stored = localStorage.getItem('user');
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    // Dựa trên JSON bạn gửi: token nằm trực tiếp trong data
    return data.token || null;
  } catch (e) {
    console.error("Lỗi parse JSON từ localStorage:", e);
    return null;
  }
};

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Lấy thông tin user từ localStorage để hiển thị mặc định
  // Lưu ý: authData thường chứa { token, email, role, fullName }. 
  // Nếu phone không có trong AuthResponse, nó sẽ mặc định là chuỗi rỗng.

const authData = JSON.parse(localStorage.getItem('user') || '{}');

  const [contactInfo, setContactInfo] = useState({
    fullName: authData.fullName || '',
    email: authData.email || '',
    phone: authData.phone || ''
  });

  // TỰ ĐỘNG LẤY THÔNG TIN TỪ PROFILE (BAO GỒM SỐ ĐIỆN THOẠI)
  useEffect(() => {
    const loadProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setContactInfo({
            fullName: data.fullName || authData.fullName || '',
            email: data.email || authData.email || '',
            phone: data.phone || ''
          });

          // Cập nhật lại localStorage luôn để các trang khác cùng dùng
          localStorage.setItem('user', JSON.stringify({ ...authData, ...data }));
        }
      } catch (e) {
        console.error("Không thể tải thông tin profile:", e);
      }
    };

    loadProfileData();
  }, []);
  
  if (!state || !state.room) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <p>Không tìm thấy dữ liệu đặt phòng.</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  const { room, checkIn, checkOut, selectedServices, selectedVoucher, invoice } = state;

  const validateForm = () => {
    if (!contactInfo.fullName.trim()) return "Vui lòng nhập họ tên người nhận phòng";
    if (!contactInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Email không hợp lệ";
    if (!contactInfo.phone.match(/^\d{10,11}$/)) return "Số điện thoại phải từ 10-11 chữ số";
    return null;
  };

  const handleFinalBooking = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    // SỬA LỖI 1: Hàm getStoredToken() của bạn viết không đúng, ta lấy trực tiếp token đã lưu ở Login
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setLoading(false);
      navigate('/login');
      return;
    }

    const payload = {
      roomId: room.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      services: selectedServices
    };
    
    try {
      // SỬA LỖI 2: Đổi URL API thành `${API_BASE}/bookings` thay vì `${API_BASE}/api/bookings` để khớp với Gateway
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Đính kèm JWT thật lấy từ localStorage
        },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 201) {
        setShowSuccessModal(true);
      } else {
        const data = await res.text(); // Đọc lỗi dạng text từ Quarkus
        const msg = data || `Lỗi ${res.status}: Không thể hoàn tất đặt phòng`;
        setError(msg);
        alert(msg);
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '20px', fontWeight: '600' }}
        >
          <ArrowLeft size={18} /> Quay lại chỉnh sửa
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>

          {/* BÊN TRÁI: THÔNG TIN LIÊN LẠC */}
          <section>
            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}><User size={20} /> Thông tin khách hàng</h3>

              {error && (
                <div style={{ color: '#EF4444', background: '#FEF2F2', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div style={infoGroupStyle}>
                <label style={labelStyle}>Họ và tên</label>
                <div style={readOnlyBoxStyle}>{contactInfo.fullName}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={infoGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <div style={readOnlyBoxStyle}>{contactInfo.email}</div>
                </div>
                <div style={infoGroupStyle}>
                  <label style={labelStyle}>Số điện thoại</label>
                  <div style={readOnlyBoxStyle}>{contactInfo.phone}</div>
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: '25px', background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <ShieldCheck color="#0284C7" />
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#0369A1' }}>Chính sách đảm bảo</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#075985', lineHeight: 1.5 }}>
                    Thông tin cá nhân của bạn được bảo mật tuyệt đối. Chúng tôi sẽ gửi mã xác nhận đặt phòng qua Email và SMS sau khi thanh toán thành công.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BÊN PHẢI: TÓM TẮT ĐẶT PHÒNG */}
          <aside>
            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}><CheckCircle2 size={20} /> Tóm tắt đặt phòng</h3>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', fontSize: '18px', color: '#0F2E5A' }}>Phòng {room.roomNumber}</div>
                <div style={{ color: '#64748B', fontSize: '14px' }}>{room.type}</div>
              </div>

              <div style={summaryRowStyle}>
                <div style={summaryItemStyle}>
                  <Calendar size={14} /> <span>{checkIn}</span>
                </div>
                <div style={{ color: '#CBD5E1' }}>|</div>
                <div style={summaryItemStyle}>
                  <Calendar size={14} /> <span>{checkOut}</span>
                </div>
              </div>

              <div style={{ margin: '20px 0', borderTop: '1px solid #F1F5F9', paddingTop: '15px' }}>
                <div style={priceRowStyle}>
                  <span>Tiền phòng ({invoice.nights} đêm)</span>
                  <span>{invoice.roomTotal.toLocaleString()}đ</span>
                </div>
                {invoice.serviceTotal > 0 && (
                  <div style={priceRowStyle}>
                    <span>Dịch vụ bổ sung</span>
                    <span>{invoice.serviceTotal.toLocaleString()}đ</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div style={{ ...priceRowStyle, color: '#059669' }}>
                    <span>Giảm giá</span>
                    <span>-{invoice.discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div style={{ ...priceRowStyle, marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #F8FAFC', fontWeight: '800', fontSize: '20px', color: '#2563EB' }}>
                  <span>Tổng tiền</span>
                  <span>{invoice.total.toLocaleString()}đ</span>
                </div>
              </div>

              <button
                onClick={handleFinalBooking}
                disabled={loading}
                style={paymentButtonStyle}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'} <CreditCard size={20} />
              </button>
            </div>
          </aside>

        </div>

        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <div style={modalIconStyle}>
                <CheckCircle2 size={48} color="#10B981" />
              </div>
              <h2 style={{ color: '#0F2E5A', margin: '0 0 12px 0' }}>Đặt phòng thành công!</h2>
              <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <p style={{ color: '#14532D', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                  Hệ thống đã ghi nhận yêu cầu của bạn. Nhân viên tư vấn sẽ liên lạc qua <strong>Zalo</strong> hoặc
                  <strong> số điện thoại</strong> ({contactInfo.phone}) trong vòng 15 phút để hướng dẫn thực hiện
                  đặt cọc và hoàn tất thanh toán.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
                <MessageSquare size={16} /> Chúng tôi hỗ trợ qua Zalo 24/7
              </div>
              <button
                onClick={() => navigate('/booking-history')}
                style={{
                  width: '100%', padding: '14px', background: '#2563EB', color: '#fff',
                  border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                Xem lịch sử đặt phòng
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const cardStyle = {
  background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
};
const sectionTitleStyle = {
  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '700', color: '#0F2E5A', margin: '0 0 20px 0'
};
const formGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' };
const infoGroupStyle = { marginBottom: '15px' };
const readOnlyBoxStyle = { padding: '12px 16px', background: '#F1F5F9', borderRadius: '12px', color: '#1E293B', fontSize: '15px', fontWeight: '500', border: '1px solid #E2E8F0' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '15px', outline: 'none', transition: '0.2s' };
const summaryRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#64748B' };
const summaryItemStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '500'
};
const priceRowStyle = {
  display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#64748B'
};
const paymentButtonStyle = {
  width: '100%', padding: '18px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s'
};

// Modal Styles
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(15, 46, 90, 0.6)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  padding: '20px'
};
const modalContentStyle = {
  background: '#fff', padding: '40px', borderRadius: '28px', maxWidth: '450px',
  width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  animation: 'modalSlideUp 0.3s ease-out'
};
const modalIconStyle = {
  width: '80px', height: '80px', background: '#DCFCE7', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
};

// Thêm CSS Animation vào cuối file index.css hoặc dùng thẻ style
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes modalSlideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(styleTag);

export default BookingConfirmation;
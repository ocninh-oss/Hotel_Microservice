import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import {
  Mail, Lock, AlertCircle, ChevronRight, Heart,
  ShieldCheck, History, Eye, EyeOff
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Email hoặc mật khẩu không chính xác');
      }

      // 1. Nhận dữ liệu dạng JSON thay vì text
      const data = await response.json();
      
      // Lấy đích danh chuỗi JWT (bỏ qua các trường như email, role đính kèm)
      const tokenString = data.token || data.jwt || data;
      const cleanToken = typeof tokenString === 'string' ? tokenString.replace(/^"|"$/g, '') : tokenString;

      // Lưu chuỗi token thuần túy
      localStorage.setItem('token', cleanToken);

      // 2. Giải mã payload của JWT để trích xuất role, username, email...
      try {
        const payloadBase64 = cleanToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        // Lưu object user để Admin.jsx và Navbar.jsx sử dụng
        localStorage.setItem('user', JSON.stringify({
          email: decodedPayload.upn || decodedPayload.sub || formData.email,
          role: decodedPayload.groups ? decodedPayload.groups[0] : (decodedPayload.role || 'USER'),
          fullName: decodedPayload.fullName || decodedPayload.name || formData.email,
          username: decodedPayload.preferred_username || decodedPayload.upn || formData.email
        }));
      } catch (parseErr) {
        console.warn("Không thể decode JWT, lưu user fallback:", parseErr);
        localStorage.setItem('user', JSON.stringify({ email: formData.email, role: 'USER' }));
      }

      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const benefits = [
    { icon: <Heart size={20} />, title: "Đặt phòng dễ dàng", desc: "Tìm kiếm, so sánh và đặt phòng khách sạn chỉ trong vài cú nhấp chuột" },
    { icon: <History size={20} />, title: "Quản lý chuyến đi", desc: "Dễ dàng xem lại lịch sử đặt phòng và hóa đơn điện tử." },
    { icon: <ShieldCheck size={20} />, title: "Thanh toán an toàn", desc: "Bảo mật thông tin tuyệt đối và đặt phòng nhanh chóng hơn." }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={containerStyle}>
        <div style={wrapperStyle}>
          {/* Bên trái: Lợi ích */}
          <div style={benefitsSideStyle}>
            <h2 style={benefitsTitleStyle}>Chào mừng bạn quay lại!</h2>
            <p style={{ color: '#BFDBFE', marginBottom: '40px', fontSize: '15px' }}>
              Đăng nhập để tiếp tục trải nghiệm những dịch vụ đẳng cấp nhất tại Hotel 22.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={benefitIconStyle}>{b.icon}</div>
                  <div>
                    <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '16px' }}>{b.title}</h4>
                    <p style={{ color: '#BFDBFE', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bên phải: Form */}
          <div style={formSideStyle}>
            <div style={headerStyle}>
              <h1 style={titleStyle}>Đăng nhập</h1>
              <p style={subtitleStyle}>Nhập thông tin tài khoản của bạn</p>
            </div>

            {error && (
              <div style={errorBoxStyle}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Địa chỉ Email</label>
                <div style={inputWrapperStyle}>
                  <Mail style={iconStyle} size={18} />
                  <input
                    type="email"
                    placeholder="vidu@email.com"
                    style={inputStyle}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Mật khẩu</label>
                <div style={inputWrapperStyle}>
                  <Lock style={iconStyle} size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={inputStyle}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeButtonStyle}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'} <ChevronRight size={18} />
              </button>
            </form>

            <p style={footerTextStyle}>
              Chưa có tài khoản? <Link to="/register" style={linkStyle}>Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 68px)' };
const wrapperStyle = { display: 'flex', width: '100%', maxWidth: '960px', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(15, 46, 90, 0.1)' };

const benefitsSideStyle = { flex: 1, background: 'linear-gradient(135deg, #0F2E5A 0%, #1E40AF 100%)', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const benefitsTitleStyle = { color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '15px' };
const benefitIconStyle = { width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93C5FD', flexShrink: 0 };

const formSideStyle = { flex: 1.1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const headerStyle = { marginBottom: '32px' };
const titleStyle = { fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#0F2E5A', marginBottom: '8px', margin: 0 };
const subtitleStyle = { fontSize: '15px', color: '#64748B' };

const errorBoxStyle = {
  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
  background: '#FEF2F2', color: '#EF4444', borderRadius: '12px',
  fontSize: '14px', marginBottom: '24px', border: '1px solid #FCA5A5'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#1E293B' };
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const iconStyle = { position: 'absolute', left: '14px', color: '#94A3B8' };
const inputStyle = { width: '100%', padding: '12px 40px 12px 44px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', transition: '0.2s', boxSizing: 'border-box' };
const eyeButtonStyle = { position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' };
const buttonStyle = {
  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff',
  fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px'
};
const footerTextStyle = { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B' };
const linkStyle = { color: '#2563EB', fontWeight: '700', textDecoration: 'none' };

export default Login;
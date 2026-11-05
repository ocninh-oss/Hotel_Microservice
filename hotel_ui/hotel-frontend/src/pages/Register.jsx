import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import {
  Mail, Lock, User, Phone, AlertCircle,
  ChevronRight, Gift, Star, ShieldCheck, Eye, EyeOff
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', fullName: '', email: '', phone: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{6,}$/;

    if (!formData.username.trim()) return "Tên đăng nhập không được để trống";
    if (!formData.fullName.trim()) return "Họ và tên không được để trống";
    if (!phoneRegex.test(formData.phone)) return "Số điện thoại phải đúng 10 chữ số";
    if (!passwordRegex.test(formData.password)) return "Mật khẩu phải từ 6 ký tự và có ít nhất 1 ký tự đặc biệt";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setError('');
    setLoading(true);

    try {
      // 1. Sửa URL: Bỏ /api -> http://localhost:8080/auth/register
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // 2. Đọc lỗi an toàn cho cả định dạng JSON lẫn plain text
        let errorMsg = 'Đăng ký thất bại';
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            errorMsg = data.message || errorMsg;
          } else {
            errorMsg = await response.text() || errorMsg;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <Gift size={20} />, title: "Đăng ký thành viên", desc: "đăng ký để nhận phòng." },
    { icon: <Star size={20} />, title: "Đặt phòng dễ dàng", desc: "Tìm kiếm, so sánh và đặt phòng khách sạn chỉ trong vài cú nhấp chuột" },
    { icon: <ShieldCheck size={20} />, title: "Ưu tiên dịch vụ", desc: "Nhận tin khuyến mãi sớm nhất và hỗ trợ check-in nhanh tại quầy." }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={containerStyle}>
        <div style={wrapperStyle}>
          {/* Bên trái: Benefits */}
          <div style={benefitsSideStyle}>
            <h2 style={benefitsTitleStyle}>Quyền lợi thành viên</h2>
            <p style={{ color: '#DCFCE7', marginBottom: '40px', fontSize: '15px' }}>
              Gia nhập cộng đồng Hotel 22 để tận hưởng những đặc quyền nghỉ dưỡng đẳng cấp nhất.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={benefitIconStyle}>{b.icon}</div>
                  <div>
                    <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '16px' }}>{b.title}</h4>
                    <p style={{ color: '#DCFCE7', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bên phải: Form đăng ký */}
          <div style={formSideStyle}>
            <div style={headerStyle}>
              <h1 style={titleStyle}>Đăng ký</h1>
              <p style={subtitleStyle}>Điền thông tin để tạo tài khoản mới</p>
            </div>

            {error && (
              <div style={errorBoxStyle}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Username</label>
                  <div style={inputWrapperStyle}>
                    <User style={iconStyle} size={18} />
                    <input
                      type="text"
                      style={inputStyle}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Họ và tên</label>
                  <div style={inputWrapperStyle}>
                    <User style={iconStyle} size={18} />
                    <input
                      type="text"
                      style={inputStyle}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email</label>
                <div style={inputWrapperStyle}>
                  <Mail style={iconStyle} size={18} />
                  <input
                    type="email"
                    style={inputStyle}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Số điện thoại</label>
                <div style={inputWrapperStyle}>
                  <Phone style={iconStyle} size={18} />
                  <input
                    type="text"
                    placeholder="09xxx..."
                    style={inputStyle}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    placeholder="Ít nhất 6 ký tự & 1 ký tự đặc biệt"
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
                {loading ? 'Đang tạo tài khoản...' : 'Đăng ký thành viên'} <ChevronRight size={18} />
              </button>
            </form>

            <p style={footerTextStyle}>
              Đã có tài khoản? <Link to="/login" style={linkStyle}>Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles 
const containerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 68px)' };
const wrapperStyle = { display: 'flex', width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(15, 46, 90, 0.1)' };
const benefitsSideStyle = { flex: 1, background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const benefitsTitleStyle = { color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '15px' };
const benefitIconStyle = { width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6EE7B7', flexShrink: 0 };
const formSideStyle = { flex: 1.2, padding: '50px' };
const headerStyle = { marginBottom: '30px' };
const titleStyle = { fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' };
const subtitleStyle = { color: '#64748B', fontSize: '15px', margin: 0 };
const errorBoxStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#FEF2F2', color: '#EF4444', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', border: '1px solid #FCA5A5' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#1E293B' };
const inputWrapperStyle = { position: 'relative' };
const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' };
const inputStyle = { width: '100%', padding: '11px 40px 11px 44px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const eyeButtonStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', zIndex: 2 };
const buttonStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' };
const footerTextStyle = { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B' };
const linkStyle = { color: '#059669', fontWeight: '700', textDecoration: 'none' };

export default Register;
import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, UserCircle, Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setMessage({ type: 'error', text: 'Không thể tải thông tin người dùng.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          phone: profile.phone,
          username: profile.username
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(updatedUser);
        
        // Update localStorage user data
        const storedData = JSON.parse(localStorage.getItem('user'));
        if (storedData) {
          let newData;
          if (storedData.user) {
            // Case where stored data is { user: {...}, token: "..." } or similar
            newData = { ...storedData, user: { ...storedData.user, ...updatedUser } };
          } else {
            // Case where stored data is just the user object
            newData = { ...storedData, ...updatedUser };
          }
          localStorage.setItem('user', JSON.stringify(newData));
          
          // Notify other components (Navbar) to re-read from localStorage
          window.dispatchEvent(new Event('authChange'));
        }
        
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      } else {
        // Parse error message from backend if possible
        let errorMsg = 'Cập nhật thất bại.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          console.error('Không thể parse lỗi', e);
        }
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 68px)' }}>
          <Loader2 className="animate-spin" size={40} color="#3B82F6" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '3rem' }}>
      <Navbar />
      
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              background: '#fff', border: '1px solid #E2E8F0', padding: '8px', 
              borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' 
            }}
          >
            <ArrowLeft size={18} color="#64748B" />
          </button>
          <h1 style={{ 
            fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: 0,
            fontFamily: "'Playfair Display', serif" 
          }}>Thông tin tài khoản</h1>
        </div>

        {/* Profile Card */}
        <div style={{ 
          background: '#fff', borderRadius: '20px', padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9'
        }}>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '32px', fontWeight: '600'
            }}>
              {profile.fullName?.charAt(0) || profile.username?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '0 0 4px' }}>
                {profile.username}
              </h2>
              <span style={{ 
                fontSize: '13px', fontWeight: '600', color: '#D97706',
                background: '#FEF3C7', padding: '2px 10px', borderRadius: '20px'
              }}>
                {profile.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Editable fields */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Tên đăng nhập</label>
                <div className="input-wrapper" style={inputWrapperStyle}>
                  <UserCircle size={18} color="#64748B" />
                  <input 
                    type="text" 
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    style={inputStyle}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email</label>
                <div style={readOnlyInputStyle}>
                  <Mail size={18} color="#94A3B8" />
                  <span>{profile.email}</span>
                </div>
              </div>

              {/* Editable fields */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Họ và tên</label>
                <div className="input-wrapper" style={inputWrapperStyle}>
                  <User size={18} color="#64748B" />
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    style={inputStyle}
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Số điện thoại</label>
                <div className="input-wrapper" style={inputWrapperStyle}>
                  <Phone size={18} color="#64748B" />
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    style={inputStyle}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>

            {/* Alert Message */}
            {message.text && (
              <div style={{ 
                padding: '12px 16px', borderRadius: '10px', marginBottom: '24px',
                background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                color: message.type === 'success' ? '#166534' : '#991B1B',
                fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : null}
                {message.text}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit"
                disabled={saving}
                style={{ 
                  background: '#2563EB', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: '10px', fontSize: '15px',
                  fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => !saving && (e.currentTarget.style.background = '#1D4ED8')}
                onMouseLeave={e => !saving && (e.currentTarget.style.background = '#2563EB')}
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Cập nhật thông tin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          .input-wrapper:focus-within {
            border-color: #3B82F6 !important;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important;
          }
        `}
      </style>
    </div>
  );
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#475569'
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: '10px',
  padding: '0 14px',
  height: '46px',
  transition: 'all 0.2s',
};

const inputStyle = {
  border: 'none',
  outline: 'none',
  width: '100%',
  fontSize: '15px',
  color: '#1E293B',
  background: 'transparent'
};

const readOnlyInputStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '10px',
  padding: '0 14px',
  height: '46px',
  fontSize: '15px',
  color: '#64748B'
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { Menu, User, LogIn, UserPlus, X, Settings, History, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authState, setAuthState] = useState({ isLoggedIn: false, user: null });
  const currentPath = window.location.pathname;

  const readAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const data = JSON.parse(storedUser);
        setAuthState({
          isLoggedIn: true,
          user: data.user || data,
        });
      } catch (e) {
        console.error('Lỗi parse user data', e);
      }
    } else {
      setAuthState({ isLoggedIn: false, user: null });
    }
  };

  useEffect(() => {
    readAuth();
    window.addEventListener('authChange', readAuth);
    window.addEventListener('storage', readAuth);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('authChange', readAuth);
      window.removeEventListener('storage', readAuth);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const { isLoggedIn, user } = authState;
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token'); //[cite: 15]
      // SỬA: Xóa /api -> http://localhost:8080/auth/logout
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, //[cite: 15]
      });
    } catch (err) {
      console.error('Logout API failed', err); //[cite: 15]
    } finally {
      localStorage.removeItem('token'); //[cite: 15]
      localStorage.removeItem('user'); //[cite: 15]
      window.dispatchEvent(new Event('authChange')); //[cite: 15]
      window.location.href = '/login'; //[cite: 15]
    }
  };

  const navItems = [
    { label: 'Trang chủ',  href: '/'                },
    { label: 'Phòng nghỉ', href: '/rooms'           },
    { label: 'Dịch vụ',   href: '/services'         },
    { label: 'Khuyến mãi', href: '/promotions'      },
    { label: 'Tin tức',   href: '/news'            },
    ...(isLoggedIn ? [{ label: 'Lịch sử',   href: '/booking-history'  }] : []),
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #DBEAFE',
      boxShadow: scrolled ? '0 2px 16px rgba(59,130,246,0.09)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '68px',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LOGO ─────────────────────────────────────────────────── */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '14px', fontWeight: '700',
          color: '#fff', letterSpacing: '-0.5px', fontFamily: "'DM Sans', sans-serif",
        }}>H22</div>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '22px', fontWeight: '700', color: '#0F2E5A', letterSpacing: '-0.3px',
        }}>Hotel 22</span>
      </a>

      {/* ── DESKTOP NAV LINKS ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {navItems.map(item => {
          const isActive = currentPath === item.href;
          return (
            <a key={item.label} href={item.href} style={{
              color: isActive ? '#2563EB' : '#475569',
              fontSize: '14px', fontWeight: isActive ? '600' : '500',
              padding: '6px 2px',
              borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
              transition: 'all 0.2s', textDecoration: 'none',
            }}
              onMouseEnter={e => { e.target.style.color = '#2563EB'; e.target.style.borderBottomColor = '#93C5FD'; }}
              onMouseLeave={e => { e.target.style.color = isActive ? '#2563EB' : '#475569'; e.target.style.borderBottomColor = isActive ? '#2563EB' : 'transparent'; }}
            >{item.label}</a>
          );
        })}
        {isAdmin && (
          <a href="/admin" style={{ color: '#D97706', fontSize: '14px', fontWeight: '600', padding: '6px 10px', background: '#FEF3C7', borderRadius: '6px', textDecoration: 'none' }}>
            Quản trị
          </a>
        )}
      </div>

      {/* ── RIGHT: tên user + hamburger ──────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Tên người dùng (chỉ hiện khi đã login) */}
        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Tên */}
            <span style={{
              fontSize: '14px', fontWeight: '600', color: '#1E40AF',
              maxWidth: '130px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
              Xin chào, {user?.fullName || user?.username || user?.email || 'Khách'}
</span>
          </div>
        )}

        {/* ── HAMBURGER + DROPDOWN ─────────────────────────────── */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              border: '1px solid #DBEAFE',
              background: isMenuOpen ? '#EFF6FF' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', color: '#1D4ED8',
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {isMenuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 10px)',
              width: '220px', background: '#fff',
              border: '1px solid #DBEAFE', borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(59,130,246,0.14)',
              padding: '8px', overflow: 'hidden',
            }}>

              {/* ── CHƯA LOGIN ── */}
              {!isLoggedIn && (
                <>
                  <a href="/login" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#EFF6FF' }}>
                      <LogIn size={15} color="#3B82F6" />
                    </div>
                    Đăng nhập
                  </a>
                  <a href="/register" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#F0FDF4' }}>
                      <UserPlus size={15} color="#22C55E" />
                    </div>
                    Đăng ký
                  </a>
                </>
              )}

              {/* ── ĐÃ LOGIN ── */}
              {isLoggedIn && (
                <>
                  {/* header tên */}
                  <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid #EFF6FF', marginBottom: '6px' }}>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>Đã đăng nhập</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#0F2E5A', margin: '2px 0 0' }}>
                      {user?.username}
                    </p>
                    {isAdmin && (
                      <span style={{
                        display: 'inline-block', marginTop: '4px',
                        fontSize: '11px', fontWeight: '700', color: '#D97706',
                        background: '#FEF3C7', padding: '2px 8px', borderRadius: '20px',
                        letterSpacing: '0.3px',
                      }}>
                        ADMIN
                      </span>
                    )}
                  </div>

                  {/* Trang cá nhân */}
                  <a
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      ...menuItemStyle,
                      background: currentPath === '/profile' ? '#EFF6FF' : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                    onMouseLeave={e => e.currentTarget.style.background = currentPath === '/profile' ? '#EFF6FF' : 'transparent'}
                  >
                    <div style={{ ...iconWrap, background: '#DBEAFE' }}>
                      <User size={15} color="#3B82F6" />
                    </div>
                    Tài khoản
                  </a>

                  {/* Trang quản trị — chỉ hiện với ADMIN */}
                  {isAdmin && (
                    <a
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        ...menuItemStyle,
                        color: '#92400E',
                        background: currentPath === '/admin' ? '#FEF3C7' : 'transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'}
                      onMouseLeave={e => e.currentTarget.style.background = currentPath === '/admin' ? '#FEF3C7' : 'transparent'}
                    >
                      <div style={{ ...iconWrap, background: '#FDE68A' }}>
                        <LayoutDashboard size={15} color="#D97706" />
                      </div>
                      Trang quản trị
                    </a>
                  )}

                  {/* Đường kẻ phân cách trước Logout */}
                  <div style={{ height: '1px', background: '#EFF6FF', margin: '6px 0' }} />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '10px 10px', borderRadius: '8px',
                      border: 'none', background: 'none', cursor: 'pointer',
                      color: '#EF4444', fontSize: '14px', fontWeight: '600',
                      fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ ...iconWrap, background: '#FEE2E2' }}>
                      <LogOut size={15} color="#EF4444" />
                    </div>
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '9px 10px', borderRadius: '8px',
  color: '#334155', fontSize: '14px', fontWeight: '500',
  textDecoration: 'none', transition: 'background 0.15s', cursor: 'pointer',
};

const iconWrap = {
  width: '28px', height: '28px', borderRadius: '7px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

export default Navbar;
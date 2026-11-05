import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="support" style={{ background: '#0F2E5A', color: '#94A3B8', padding: '64px 2rem 0', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', paddingBottom: '48px' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Hotel 22</div>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#64748B' }}>Nghỉ dưỡng sang trọng giữa lòng thành phố Hà Nội. Nơi mỗi khoảnh khắc đều trở nên đáng nhớ.</p>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '20px' }}>Liên hệ</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[{ Icon: Phone, text: '090 000 0000' }, { Icon: Mail, text: 'support@hotel22.com' }, { Icon: MapPin, text: '12 , ngách 43, ngõ 59, Mễ Trì Hạ, Nam Từ Liêm, Hà Nội' }].map(({ Icon, text }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#60A5FA" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '20px' }}>Chính sách</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Chính sách hủy phòng', 'Điều khoản sử dụng', 'Bảo mật thông tin'].map(item => (
              <li key={item}>
                <a href="#" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#93C5FD'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                >{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '12px' }}>Đăng ký nhận tin</h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>Nhận ưu đãi sớm nhất thẳng vào hộp thư của bạn.</p>
          <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.3)' }}>
            <input type="email" placeholder="Email của bạn" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', padding: '11px 14px', color: '#E2E8F0', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} />
            <button style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '11px 18px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}
              onMouseEnter={e => e.target.style.background = '#2563EB'}
              onMouseLeave={e => e.target.style.background = '#3B82F6'}
            >Gửi</button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '24px 0', textAlign: 'center', fontSize: '13px', color: '#334155', maxWidth: '1200px', margin: '0 auto' }}>
        © 2026 Hotel 22. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

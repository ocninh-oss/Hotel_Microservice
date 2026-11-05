import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronRight, Sparkles, Newspaper, Calendar, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE}/news`);
        if (!res.ok) throw new Error(`Lỗi tải tin tức: ${res.status}`);
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />
      
      {/* Premium Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        padding: '100px 2rem 160px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '30%', height: '50%',
          background: 'rgba(59, 130, 246, 0.2)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '50%',
          background: 'rgba(30, 58, 138, 0.3)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
            padding: '6px 16px', borderRadius: '20px', color: '#BFDBFE',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={14} /> KHÁM PHÁ CÙNG HOTEL 22
          </div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#FFFFFF', 
            marginBottom: '20px', lineHeight: '1.2', fontWeight: '700'
          }}>
            Tin tức & Sự kiện
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Cập nhật những thông tin mới nhất và các hoạt động sôi nổi tại Hotel 22 - Nơi cảm xúc thăng hoa.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '-80px auto 80px', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="spinner" style={{ 
              width: '40px', height: '40px', border: '4px solid #F1F5F9', 
              borderTop: '4px solid #2563EB', borderRadius: '50%', margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748B', fontWeight: '500' }}>Đang tải tin tức mới nhất...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: '#FFF1F2', borderRadius: '24px', border: '1px solid #FECACA' }}>
            <AlertCircle size={40} color="#EF4444" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#B91C1C', fontWeight: '600' }}>{error}</p>
          </div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: '#fff', borderRadius: '24px', color: '#94A3B8', border: '1px solid #F1F5F9' }}>
            <Newspaper size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px' }}>Hiện chưa có tin tức nào được đăng tải.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
            {news.map(n => (
              <div key={n.id} className="news-card" style={{ 
                background: '#ffffffff', 
                borderRadius: '24px', 
                border: '1px solid #F1F5F9', 
                overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', 
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/news/${n.id}`)}
              >
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={n.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
                    alt={n.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} 
                    className="news-image"
                  />
                  <div style={{ 
                    position: 'absolute', top: '20px', left: '20px', 
                    background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', 
                    padding: '6px 14px', borderRadius: '12px', fontSize: '11px', 
                    fontWeight: '800', color: '#1E40AF', textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    BẢN TIN KHÁCH SẠN
                  </div>
                </div>
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B', fontSize: '13px', marginBottom: '16px' }}>
                    <Calendar size={14} />
                    <span>{new Date(n.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                  </div>
                  <h3 style={{ 
                    fontSize: '22px', fontWeight: '800', color: '#0F172A', 
                    marginBottom: '16px', lineHeight: 1.4, 
                    height: '62px', overflow: 'hidden', display: '-webkit-box', 
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' 
                  }}>
                    {n.title}
                  </h3>
                  <div style={{ 
                    marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #F8FAFC', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                  }}>
                    <span style={{ 
                      color: '#2563EB', fontWeight: '800', fontSize: '14px', 
                      display: 'flex', alignItems: 'center', gap: '6px' 
                    }}>
                      Khám phá ngay <ChevronRight size={18} />
                    </span>
                  </div>
                </div>

                <style>{`
                  .news-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    border-color: #DBEAFE;
                  }
                  .news-card:hover .news-image {
                    transform: scale(1.05);
                  }
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default News;

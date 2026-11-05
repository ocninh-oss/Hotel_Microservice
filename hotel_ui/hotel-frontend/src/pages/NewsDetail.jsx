import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`${API_BASE}/news/${id}`);
        if (!res.ok) throw new Error('Không thể tải chi tiết bài viết');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải nội dung...</div>
      <Footer />
    </div>
  );

  if (error || !news) return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <p style={{ color: '#EF4444' }}>{error || 'Bài viết không tồn tại'}</p>
        <button onClick={() => navigate('/news')} style={{ marginTop: '20px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Quay lại danh sách</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 2rem 80px' }}>
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate('/news')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '14px', fontWeight: '600' }}
        >
          <ChevronLeft size={20} /> Quay lại danh sách
        </button>

        {/* Header bài viết */}
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#3B82F6', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
            Tin tức khách sạn
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '700', color: '#0F2E5A', lineHeight: 1.2, marginBottom: '24px' }}>
            {news.title}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '20px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
              <Calendar size={16} /> {new Date(news.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
              <User size={16} /> Ban quản trị Hotel 22
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px' }}>
              <Clock size={16} /> 5 phút đọc
            </div>
          </div>
        </header>

        {/* Ảnh bìa */}
        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', marginBottom: '48px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <img 
            src={news.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'} 
            alt={news.title} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Nội dung bài viết */}
        <article style={{ fontSize: '18px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line' }}>
          {news.content || 'Nội dung đang được cập nhật...'}
        </article>

        {/* Footer bài viết */}
        <div style={{ marginTop: '60px', padding: '40px', background: '#F8FBFF', borderRadius: '24px', textAlign: 'center' }}>
          <h3 style={{ color: '#0F2E5A', marginBottom: '12px' }}>Bạn quan tâm đến dịch vụ của chúng tôi?</h3>
          <p style={{ color: '#64748B', marginBottom: '24px' }}>Liên hệ ngay để nhận được tư vấn tốt nhất cho kỳ nghỉ của bạn.</p>
          <button onClick={() => navigate('/rooms')} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
            Đặt phòng ngay
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;

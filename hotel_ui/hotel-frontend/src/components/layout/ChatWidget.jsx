import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

const ChatWidget = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Kính chào quý khách! Em là lễ tân AI của khách sạn. Quý khách cần hỗ trợ đặt phòng hay tìm hiểu chính sách ạ?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    // Thêm tin nhắn của user vào UI
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      // Gọi API sang Gateway Python cổng 8080
      const res = await axios.post('http://localhost:8080/api/chat', { message: userMsg });
      // Thêm câu trả lời của Bot vào UI
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Dạ hệ thống đang bận, quý khách vui lòng thử lại sau ít phút nhé!", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
    const res = await axios.post('http://localhost:8080/api/chat', { message: userMsg }, { timeout: 45000 });
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: 'sans-serif' }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          <MessageCircle size={32} />
        </button>
      ) : (
        <div style={{ width: '350px', height: '500px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: '#4F46E5', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Lễ tân Khách sạn AI</span>
            <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          
          {/* Body Chat */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F8FAFC' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end', marginBottom: '12px' }}>
                <div style={{ maxWidth: '80%', padding: '12px', borderRadius: '12px', background: msg.isBot ? 'white' : '#4F46E5', color: msg.isBot ? '#1E293B' : 'white', border: msg.isBot ? '1px solid #E2E8F0' : 'none', lineHeight: '1.5', fontSize: '14px' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>Lễ tân đang nhập...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu */}
          <div style={{ padding: '12px', background: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi..."
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px' }}
            />
            <button onClick={handleSend} style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer' }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
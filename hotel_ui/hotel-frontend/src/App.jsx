import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Promotions from './pages/Promotions';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import BookingConfirmation from './pages/BookingConfirmation';
import Admin from './pages/Admin';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Profile from './pages/Profile';
import ChatWidget from "./components/layout/ChatWidget";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ... các thẻ Route của bạn giữ nguyên ... */}
          <Route path="/" element={<Home />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        
        {/* THÊM DÒNG NÀY: Đặt ngoài Routes nhưng trong div.App để nó hiện ở mọi trang */}
        <ChatWidget />
        
      </div>
    </Router>
  );
}

export default App; //[cite: 12]
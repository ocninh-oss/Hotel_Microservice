import React, { useState } from 'react';
import { Menu, User, LogIn, UserPlus, Heart, BookOpen } from 'lucide-react';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 cursor-pointer">
        HOTEL 22
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex space-x-8 font-medium text-gray-600">
        <a href="/" className="hover:text-blue-600 transition">Trang chủ</a>
        <a href="/rooms" className="hover:text-blue-600 transition">Phòng</a>
        <a href="#vouchers" className="hover:text-blue-600 transition">Khuyến mãi</a>
        <a href="#support" className="hover:text-blue-600 transition">Hỗ trợ</a>
      </div>

      {/* Hamburger Menu Icon */}
      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <Menu size={28} className="text-gray-700" />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
            {!isLoggedIn ? (
              <>
                <a href="/login" className="flex items-center px-4 py-3 hover:bg-blue-50 text-gray-700">
                  <LogIn size={18} className="mr-3 text-blue-500" /> Đăng nhập
                </a>
                <a href="/register" className="flex items-center px-4 py-3 hover:bg-blue-50 text-gray-700">
                  <UserPlus size={18} className="mr-3 text-green-500" /> Đăng ký
                </a>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold">Xin chào, Người dùng!</p>
                </div>
                <a href="/profile" className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700">
                  <User size={18} className="mr-3" /> Tài khoản
                </a>
                <a href="/bookings" className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700">
                  <BookOpen size={18} className="mr-3" /> Đơn đặt phòng
                </a>
                <a href="/wishlist" className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700">
                  <Heart size={18} className="mr-3 text-red-500" /> Yêu thích
                </a>
                <button className="w-full text-left flex items-center px-4 py-3 hover:bg-red-50 text-red-600 border-t mt-1">
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
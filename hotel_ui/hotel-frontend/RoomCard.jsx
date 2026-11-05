import React from 'react';
import { Users, Info } from 'lucide-react';

const RoomCard = ({ room }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 border border-gray-100">
      <img 
        src={room.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"} 
        alt={room.roomType}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{room.roomType} - {room.roomNumber}</h3>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Mới</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{room.description}</p>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Users size={16} className="mr-1" /> Tối đa {room.capacity} người
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-lg font-bold text-blue-600">{room.price.toLocaleString()} VNĐ <small className="text-gray-400 font-normal">/ đêm</small></span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
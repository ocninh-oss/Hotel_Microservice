import React from 'react';
import { CalendarCheck, BedDouble, Users, TrendingUp, Tag, ConciergeBell } from 'lucide-react';
import StatCard from './StatCard';

const AdminDashboard = ({ bookings, rooms, users, services, vouchers, lastFetch }) => {
  const totalRevenue = bookings
    .filter(b => b.status === 'COMPLETED' && b.paymentStatus === true)
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const activeVouchers  = vouchers.filter(v => v.active).length;

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <StatCard
        icon={<CalendarCheck />} color="#2563EB"
        label="Tổng đặt phòng" value={bookings.length}
        sub={`${pendingBookings} chờ duyệt`}
      />
      <StatCard
        icon={<BedDouble />} color="#3B82F6"
        label="Phòng nghỉ" value={rooms.length}
        sub={`${rooms.filter(r => r.status === 'AVAILABLE').length} phòng trống`}
      />
      <StatCard
        icon={<Users />} color="#2563EB"
        label="Người dùng" value={users.length}
        sub={`${users.filter(u => u.active !== false).length} đang hoạt động`}
      />
      <StatCard
        icon={<TrendingUp />} color="#1D4ED8"
        label="Doanh thu hoàn tất" value={totalRevenue.toLocaleString('vi-VN') + '₫'}
      />
      <StatCard
        icon={<Tag />} color="#3B82F6"
        label="Voucher" value={vouchers.length}
        sub={`${activeVouchers} đang kích hoạt`}
      />
      <StatCard
        icon={<ConciergeBell />} color="#2563EB"
        label="Dịch vụ" value={services.length}
      />
      {lastFetch && (
        <p style={{ width: '100%', marginTop: '0', color: '#64748B', fontSize: '13px' }}>
          Cập nhật lúc {lastFetch}
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;

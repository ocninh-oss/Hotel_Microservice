import React from 'react';

const STATUS_MAP = {
  CONFIRMED:  { bg: '#DBEAFE', color: '#1E40AF', label: 'Xác nhận' },
  PENDING:    { bg: '#E0F2FE', color: '#0369A1', label: 'Chờ duyệt' },
  CANCELLED:  { bg: '#FEE2E2', color: '#991B1B', label: 'Đã huỷ' },
  CHECKED_IN: { bg: '#DBEAFE', color: '#1E40AF', label: 'Đang ở' },
  COMPLETED:  { bg: '#F3F4F6', color: '#374151', label: 'Đã trả phòng' },
  PAID:       { bg: '#DBEAFE', color: '#1E40AF', label: 'Đã thanh toán' },
  UNPAID:     { bg: '#FEE2E2', color: '#991B1B', label: 'Chưa TT' },
  ACTIVE:     { bg: '#DBEAFE', color: '#1E40AF', label: 'Hoạt động' },
  INACTIVE:   { bg: '#F3F4F6', color: '#374151', label: 'Tắt' },
  AVAILABLE:  { bg: '#DBEAFE', color: '#1E40AF', label: 'Sẵn sàng' },
  BOOKED:     { bg: '#E0F2FE', color: '#0369A1', label: 'Đã đặt' },
};

const StatusBadge = ({ value }) => {
  const badge = STATUS_MAP[value] || { bg: '#F3F4F6', color: '#374151', label: value };
  return (
    <span style={{
      background: badge.bg,
      color: badge.color,
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    }}>
      {badge.label}
    </span>
  );
};

export default StatusBadge;

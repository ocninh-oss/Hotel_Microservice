import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Menu, Info,
  User, Calendar, CreditCard, Package, X, Copy, Check, Gift
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const actionBtnStyle = {
  padding: '6px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', transition: '0.2s',
};

const AdminBookings = ({ bookings, onUpdateStatus }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomSearchTerm, setRoomSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  const filteredBookings = bookings.filter(b => {
    const phoneTerm = searchTerm.toLowerCase().trim();
    const roomTerm = roomSearchTerm.toLowerCase().trim();
    
    // Khớp số điện thoại
    const matchPhone = phoneTerm === '' || (b.customerPhone || '').toLowerCase().includes(phoneTerm);
    
    // Khớp số phòng (bỏ tiền tố "P." hoặc "p." hoặc "p")
    const cleanRoomNum = (b.roomNumber || '').toLowerCase().replace(/^p\.?/, '');
    const cleanSearch = roomTerm.replace(/^p\.?/, '');
    const matchRoom = cleanSearch === '' || cleanRoomNum.includes(cleanSearch);
    
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    
    return matchPhone && matchRoom && matchStatus;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'NEWEST') {
      return b.id - a.id;
    }
    if (sortBy === 'OLDEST') {
      return a.id - b.id;
    }
    if (sortBy === 'CHECKIN_ASC') {
      return new Date(a.checkInDate) - new Date(b.checkInDate);
    }
    if (sortBy === 'CHECKIN_DESC') {
      return new Date(b.checkInDate) - new Date(a.checkInDate);
    }
    return 0;
  });


  const handleApprove = (id) => {
    onUpdateStatus(id, 'CONFIRMED');
  };

  const handleCancel = (id) => {
    onUpdateStatus(id, 'CANCELLED');
  };

  const handleCheckIn = (id) => {
    onUpdateStatus(id, 'CHECKED_IN');
  };

  const handleCheckOut = (id) => {
    onUpdateStatus(id, 'COMPLETED');
  };

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Quản lý Đặt phòng ({sortedBookings.length})</h2>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CHECKED_IN">Đang ở (Đã nhận)</option>
            <option value="COMPLETED">Đã trả phòng (Xong)</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <option value="NEWEST">Sắp xếp: Mới nhất</option>
            <option value="OLDEST">Sắp xếp: Cũ nhất</option>
            <option value="CHECKIN_ASC">Sắp xếp: Nhận phòng (Tăng dần)</option>
            <option value="CHECKIN_DESC">Sắp xếp: Nhận phòng (Giảm dần)</option>
          </select>

          <div style={{ position: 'relative', width: '180px' }}>
            <input
              type="text"
              placeholder="Tìm theo số ĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                outline: 'none',
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative', width: '180px' }}>
            <input
              type="text"
              placeholder="Tìm theo số phòng..."
              value={roomSearchTerm}
              onChange={(e) => setRoomSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                outline: 'none',
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Khách hàng', 'Phòng', 'Nhận/Trả', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Thao tác'].map(h => (
                <th key={h} style={thStyle(h)}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedBookings.length === 0 ? (
              <tr><td colSpan={8} style={emptyTdStyle}>Không tìm thấy đơn đặt phòng nào phù hợp</td></tr>
            ) : sortedBookings.map(b => (
              <tr key={b.id} style={trStyle} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={tdStyle}><strong>#{b.id}</strong></td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '600' }}>{b.customerName || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{b.customerPhone || ''}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '600' }}>P.{b.roomNumber || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{b.roomType}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '12px' }}>{b.checkInDate}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{b.checkOutDate}</div>
                </td>
                <td style={{ ...tdStyle, color: '#2563EB', fontWeight: '700' }}>
                  {b.totalPrice?.toLocaleString()}₫
                </td>
                <td style={tdStyle}><StatusBadge value={b.status} /></td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge value={b.paymentStatus ? 'PAID' : 'UNPAID'} />
                    <button
                      onClick={() => onUpdateStatus(b.id, b.status, !b.paymentStatus)}
                      style={{
                        border: 'none', background: '#F1F5F9', color: '#059669',
                        borderRadius: '4px', width: '24px', height: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: '0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#DCFCE7'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
                      title={b.paymentStatus ? 'Đánh dấu chưa thanh toán' : 'Đánh dấu đã thanh toán'}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    <button
                      title="Xem chi tiết"
                      style={{ ...actionBtnStyle, color: '#2563EB' }}
                      onClick={() => setSelectedBooking(b)}
                    >
                      <Menu size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setSelectedBooking(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Chi tiết Đơn hàng #{selectedBooking.id}</h3>
              <button onClick={() => setSelectedBooking(null)} style={closeButtonStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={infoBoxStyle}>
                  <h4 style={sectionTitleStyle}><User size={16} /> Khách hàng</h4>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#0F2E5A' }}>{selectedBooking.customerName || 'N/A'}</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{selectedBooking.customerEmail || 'N/A'}</div>

                  <div style={{
                    marginTop: '12px', padding: '8px 12px', background: '#fff', borderRadius: '10px',
                    border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                      {selectedBooking.customerPhone || 'N/A'}
                    </span>
                    <button
                      onClick={() => handleCopyPhone(selectedBooking.customerPhone)}
                      style={{
                        border: 'none', background: copied ? '#DCFCE7' : '#EFF6FF',
                        color: copied ? '#15803D' : '#2563EB', padding: '6px',
                        borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', fontWeight: '700', transition: '0.2s'
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
                <div style={infoBoxStyle}>
                  <h4 style={sectionTitleStyle}><Calendar size={16} /> Thời gian</h4>
                  <div style={{ fontSize: '14px' }}><strong>Nhận:</strong> {selectedBooking.checkInDate}</div>
                  <div style={{ fontSize: '14px' }}><strong>Trả:</strong> {selectedBooking.checkOutDate}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Ngày đặt: {new Date(selectedBooking.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={infoBoxStyle}>
                <h4 style={sectionTitleStyle}><Package size={16} /> Dịch vụ & Thanh toán</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #E2E8F0' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#1E293B' }}>Tiền phòng {selectedBooking.roomNumber}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedBooking.roomType}</div>
                  </div>
                  <div style={{ fontWeight: '700' }}>{selectedBooking.totalRoomPrice?.toLocaleString()}đ</div>
                </div>

                {/* Detailed Services */}
                {selectedBooking.services && selectedBooking.services.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Dịch vụ bổ sung</div>
                    {selectedBooking.services.map((s, i) => {
                      const total = s.price * s.quantity * (s.numberOfPeople || 1) * (s.numberOfDays || 1);
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                          <div style={{ color: '#475569' }}>
                            <div>{s.serviceName}</div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                              {s.price.toLocaleString()}đ x {s.quantity}
                              {s.numberOfPeople ? ` x ${s.numberOfPeople} người` : ''}
                              {s.numberOfDays ? ` x ${s.numberOfDays} ngày` : ''}
                            </div>
                          </div>
                          <div style={{ fontWeight: '600', color: '#1E293B' }}>{total.toLocaleString()}đ</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Voucher & Total */}
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #E2E8F0' }}>
                  {selectedBooking.totalServicePrice > 0 && (
                    <div style={priceRowStyle}>
                      <span>Tổng tiền dịch vụ</span>
                      <span>{selectedBooking.totalServicePrice?.toLocaleString()}đ</span>
                    </div>
                  )}
                  {selectedBooking.voucherCode && (
                    <div style={{ ...priceRowStyle, color: '#059669', background: '#ECFDF5', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Gift size={14} />
                        <span>Voucher: <strong>{selectedBooking.voucherCode}</strong></span>
                      </div>
                      <span>-{selectedBooking.discountAmount?.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F2E5A' }}>Tổng thanh toán</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#2563EB' }}>{selectedBooking.totalPrice?.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              {selectedBooking.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={() => { handleApprove(selectedBooking.id); setSelectedBooking(null); }}
                    style={{ flex: 1, padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Duyệt & Xác nhận
                  </button>
                  <button
                    onClick={() => { handleCancel(selectedBooking.id); setSelectedBooking(null); }}
                    style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              )}

              {selectedBooking.status === 'CONFIRMED' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={() => { handleCheckIn(selectedBooking.id); setSelectedBooking(null); }}
                    style={{ flex: 1, padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Xác nhận khách đã nhận phòng
                  </button>
                </div>
              )}

              {selectedBooking.status === 'CHECKED_IN' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={() => { handleCheckOut(selectedBooking.id); setSelectedBooking(null); }}
                    style={{ flex: 1, padding: '12px', background: '#475569', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Xác nhận Khách trả phòng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = (h) => ({
  padding: '12px 16px', background: '#F8FAFC', fontSize: '11px', fontWeight: '700', color: '#64748B',
  textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Thao tác' ? 'center' : 'left', borderBottom: '1px solid #E2E8F0'
});

const tdStyle = { padding: '16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' };
const trStyle = { transition: 'background 0.15s' };
const emptyTdStyle = { padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const modalContentStyle = { background: '#fff', borderRadius: '20px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const modalHeaderStyle = { padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeButtonStyle = { border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const infoBoxStyle = { padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' };
const sectionTitleStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px', margin: 0 };
const priceRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#475569' };

export default AdminBookings;

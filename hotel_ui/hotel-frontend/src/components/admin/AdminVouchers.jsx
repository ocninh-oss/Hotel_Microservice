import React from 'react';
import { Plus, Edit, RefreshCw, Trash2 } from 'lucide-react';

const th = {
  padding: '12px 16px',
  background: '#F8FAFC',
  fontSize: '12px',
  fontWeight: '700',
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  textAlign: 'left',
  borderBottom: '1px solid #E2E8F0'
};

const td = {
  padding: '12px 16px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #F1F5F9'
};

const actionBtnStyle = {
  padding: '6px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: '0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const addBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '8px 16px',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const AdminVouchers = ({ vouchers, onAdd, onEdit, onToggle }) => (
  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Quản lý Voucher ({vouchers.length})</h2>
      <button style={{ ...addBtnStyle, background: '#3B82F6' }} onClick={onAdd}>
        <Plus size={14} /> Thêm mới
      </button>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Mã', 'Giảm (%)', 'Giảm tối đa', 'Đơn tối thiểu', 'Số lượng', 'Hết hạn', 'Trạng thái', 'Thao tác'].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vouchers.length === 0 ? (
            <tr><td colSpan={8} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
          ) : vouchers.map(v => (
            <tr key={v.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ ...td, fontWeight: '700', color: '#1E40AF', fontFamily: 'monospace' }}>{v.code}</td>
              <td style={td}>{v.discountPercent}%</td>
              <td style={td}>{v.maxDiscountAmount?.toLocaleString()}₫</td>
              <td style={td}>{v.minOrderValue?.toLocaleString()}₫</td>
              <td style={td}>{v.quantity}</td>
              <td style={td}>{v.expiryDate || '—'}</td>
              <td style={td}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  background: v.status ? '#DCFCE7' : '#FEE2E2',
                  color: v.status ? '#16A34A' : '#EF4444'
                }}>
                  {v.status ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </span>
              </td>
              <td style={td}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => onEdit(v)} style={{ ...actionBtnStyle, color: '#2563EB' }} title="Sửa">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onToggle(v.id)} style={{ ...actionBtnStyle, color: v.status ? '#EF4444' : '#10B981' }} title={v.status ? "Tắt" : "Bật"}>
                    <RefreshCw size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminVouchers;

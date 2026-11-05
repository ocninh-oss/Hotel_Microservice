import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const actionBtnStyle = {
  padding: '6px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: '0.2s',
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

const AdminServices = ({ services }) => (
  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Dịch vụ khách sạn ({services.length})</h2>
      <button style={{ ...addBtnStyle, background: '#2563EB' }} onClick={() => alert('Chức năng thêm dịch vụ chưa được triển khai')}>
        <Plus size={14} /> Thêm mới
      </button>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Tên dịch vụ', 'Giá', 'Đơn vị', 'Trạng thái', 'Thao tác'].map(h => (
              <th key={h} style={{ padding: '10px 16px', background: '#F8FAFC', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Thao tác' ? 'center' : 'left', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>Không có dữ liệu</td></tr>
          ) : services.map(s => (
            <tr key={s.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9', fontWeight: '600' }}>{s.serviceName}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{s.price?.toLocaleString()}₫</td>
              <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>{s.unit}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                {s.available !== false
                  ? <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600' }}>Đang bán</span>
                  : <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>Ngừng</span>}
              </td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <button style={{ ...actionBtnStyle, color: '#2563EB' }} onMouseEnter={e => e.currentTarget.style.background='#DBEAFE'} onMouseLeave={e => e.currentTarget.style.background='none'}><Edit size={16} /></button>
                  <button style={{ ...actionBtnStyle, color: '#EF4444' }} onMouseEnter={e => e.currentTarget.style.background='#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background='none'}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminServices;

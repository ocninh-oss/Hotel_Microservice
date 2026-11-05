import React from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

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

const AdminUsers = ({ users }) => (
  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Người dùng ({users.length})</h2>
      <button style={{ ...addBtnStyle, background: '#1E40AF' }} onClick={() => alert('Chức năng thêm người dùng chưa được triển khai')}>
        <Plus size={14} /> Thêm mới
      </button>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['ID', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái'].map(h => (
              <th key={h} style={{ padding: '10px 16px', background: '#F8FAFC', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>Không có dữ liệu</td></tr>
          ) : users.map(u => (
            <tr key={u.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>#{u.id}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{u.fullName || '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{u.email || '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{
                  background: u.role === 'ADMIN' ? '#DBEAFE' : '#EFF6FF',
                  color: u.role === 'ADMIN' ? '#1E40AF' : '#2563EB',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>{u.role || 'USER'}</span>
              </td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                {u.active === false
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '13px' }}><XCircle size={14} /> Bị khoá</span>
                  : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '13px' }}><CheckCircle size={14} /> Hoạt động</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminUsers;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import {
  LayoutDashboard, Users, BedDouble, CalendarCheck,
  Tag, Newspaper, AlertTriangle, RefreshCw,
  Shield, Edit, Trash2,
  Plus, ConciergeBell, Eye, CheckCircle, XCircle,
} from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminBookings from '../components/admin/AdminBookings';
import AdminRooms from '../components/admin/AdminRooms';
import AdminServices from '../components/admin/AdminServices';
import AdminUsers from '../components/admin/AdminUsers';
import AdminVouchers from '../components/admin/AdminVouchers';
import AdminNews from '../components/admin/AdminNews';
import StatusBadge from '../components/admin/StatusBadge';
import RoomCalendar from '../components/admin/RoomCalendar';

const API_BASE = 'http://localhost:8080';

/* ─────────────────────────────────────────────
   Helper: fetch với Bearer token
───────────────────────────────────────────── */
const getStoredToken = () => {
  // Thử lấy trực tiếp nếu bạn lưu riêng lẻ
  const token = localStorage.getItem('token');
  if (token) return token;

  // Lấy từ object 'user' mà bạn đã lưu khi đăng nhập
  const stored = localStorage.getItem('user');
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    // Dựa trên JSON bạn gửi: token nằm trực tiếp trong data
    return data.token || null;
  } catch (e) {
    console.error("Lỗi parse JSON từ localStorage:", e);
    return null;
  }
};

const authFetch = (path) => {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  // SỬA LỖI URL: Xóa /api
  return fetch(`${API_BASE}${path}`, { headers });
};

const actionBtnStyle = {
  padding: '6px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', transition: '0.2s'
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

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif"
};

/* ─────────────────────────────────────────────
   MAIN ADMIN PAGE
───────────────────────────────────────────── */
const Admin = () => {
  const navigate = useNavigate();

  /* Auth guard */
  const [authOk, setAuthOk] = useState(null); // null=loading, true/false
  useEffect(() => {
    const token = getStoredToken();
    const stored = localStorage.getItem('user');
    if (!token || !stored) { setAuthOk(false); return; }
    try {
      const data = JSON.parse(stored);
      const role = (data.user || data)?.role;
      setAuthOk(role === 'ADMIN');
    } catch { setAuthOk(false); }
  }, []);

  /* Data states */
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [news, setNews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastFetch, setLastFetch] = useState(null);

  /* Modal states */
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [deleteCheckResult, setDeleteCheckResult] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: '',
    basePrice: '',
    address: '',
    description: '',
    maxOccupancy: '',
    amenities: '',
    images: ''
  });
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [updatingRoom, setUpdatingRoom] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* News states */
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    thumbnail: '',
    content: '',
    expiryDate: ''
  });  /* User states */
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', fullName: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
  const [userLoading, setUserLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);
  
  /* Voucher states */
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discountPercent: '',
    maxDiscountAmount: '',
    minOrderValue: '',
    expiryDate: '',
    quantity: ''
  });
  const [voucherLoading, setVoucherLoading] = useState(false);


  const handleUpdateBookingStatus = async (id, status, paymentStatus) => {
    const confirmMsg = status 
      ? `Bạn có chắc muốn chuyển trạng thái đơn hàng #${id} sang ${status}?`
      : `Bạn có chắc muốn cập nhật trạng thái thanh toán cho đơn hàng #${id}?`;
      
    if (!window.confirm(confirmMsg)) return;
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getStoredToken()}` 
        },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (!res.ok) {
        let errMsg = 'Lỗi khi cập nhật trạng thái';
        try {
          const errData = await res.json();
          if (errData && errData.message) {
            errMsg = errData.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      setBookings(prev => prev.map(b => b.id === id ? data : b));
      alert('Cập nhật thành công!');
    } catch (e) {
      alert(e.message);
    }
  };


  /* Service states */
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    serviceName: '',
    description: '',
    price: '',
    unit: '',
    isAvailable: true
  });
  const [serviceLoading, setServiceLoading] = useState(false);



  const openEditService = (s) => {
    setEditingService(s);
    setServiceForm({
      serviceName: s.serviceName || '',
      description: s.description || '',
      price: s.price || '',
      unit: s.unit || '',
      isAvailable: s.isAvailable !== false
    });
    setShowEditServiceModal(true);
  };

  const handleCreateService = async () => {
    if (!serviceForm.serviceName.trim() || !serviceForm.price) { alert('Vui lòng điền tên và giá dịch vụ'); return; }
    setServiceLoading(true);
   try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredToken()}` },
        body: JSON.stringify({ ...serviceForm, price: parseFloat(serviceForm.price) })
      });
      if (!res.ok) throw new Error('Lỗi khi tạo dịch vụ');
      const data = await res.json();
      setServices(prev => [...prev, data]);
      setShowAddServiceModal(false);
      setServiceForm({ serviceName: '', description: '', price: '', unit: '', isAvailable: true });
      alert('Thêm dịch vụ thành công!');
    } catch (e) { alert(e.message); } finally { setServiceLoading(false); }
  };

  const handleUpdateService = async () => {
    if (!serviceForm.serviceName.trim() || !serviceForm.price) { alert('Vui lòng điền tên và giá dịch vụ'); return; }
    setServiceLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredToken()}` },
        body: JSON.stringify({ ...serviceForm, price: parseFloat(serviceForm.price) })
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật dịch vụ');
      const data = await res.json();
      setServices(prev => prev.map(s => s.id === editingService.id ? data : s));
      setShowEditServiceModal(false);
      setEditingService(null);
      alert('Cập nhật thành công!');
    } catch (e) { alert(e.message); } finally { setServiceLoading(false); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa dịch vụ');
      setServices(prev => prev.filter(s => s.id !== id));
      alert('Xóa thành công!');
    } catch (e) { alert(e.message); }
  };

  const [uploadingNewsImage, setUploadingNewsImage] = useState(false);

  const handleNewsImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingNewsImage(true);
    const formData = new FormData();
    formData.append('file', file);
    
   try {
      // SỬA LỖI URL: Xóa /api
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload ảnh thất bại');
      const data = await response.json();
      if (data.url) {
        setNewsForm(prev => ({
          ...prev,
          thumbnail: data.url
        }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingNewsImage(false);
      e.target.value = null;
    }
  };

  const openEditNews = (n) => {
    setEditingNews(n);
    setNewsForm({
      title: n.title || '',
      thumbnail: n.thumbnail || '',
      content: n.content || '',
      expiryDate: n.expiryDate ? n.expiryDate.split('.')[0] : ''
    });
    setShowEditNewsModal(true);
  };

  const handleCreateNews = async () => {
    if (!newsForm.title.trim()) { alert('Tiêu đề không được để trống'); return; }
    setNewsLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredToken()}` },
        body: JSON.stringify(newsForm)
      });
      if (!res.ok) throw new Error('Lỗi khi tạo tin tức');
      const data = await res.json();
      setNews(prev => [...prev, data]);
      setShowAddNewsModal(false);
      setNewsForm({ title: '', thumbnail: '', content: '', expiryDate: '' });
      alert('Thêm tin tức thành công!');
    } catch (e) { alert(e.message); } finally { setNewsLoading(false); }
  };

  const handleUpdateNews = async () => {
    if (!newsForm.title.trim()) { alert('Tiêu đề không được để trống'); return; }
    setNewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/news/${editingNews.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredToken()}` },
        body: JSON.stringify(newsForm)
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật tin tức');
      const data = await res.json();
      setNews(prev => prev.map(n => n.id === editingNews.id ? data : n));
      setShowEditNewsModal(false);
      setEditingNews(null);
      alert('Cập nhật thành công!');
    } catch (e) { alert(e.message); } finally { setNewsLoading(false); }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin tức này?')) return;
    try {
        // SỬA LỖI URL: Xóa /api
        const res = await fetch(`${API_BASE}/admin/news/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getStoredToken()}` }
        });
        if (!res.ok) throw new Error('Lỗi khi xóa tin tức');
        setNews(prev => prev.filter(n => n.id !== id));
        alert('Xóa thành công!');
      } catch (e) { alert(e.message); }
  };

  /* Voucher functions */
  const openEditVoucher = (v) => {
    setEditingVoucher(v);
    setVoucherForm({
      code: v.code || '',
      discountPercent: v.discountPercent || '',
      maxDiscountAmount: v.maxDiscountAmount || '',
      minOrderValue: v.minOrderValue || '',
      expiryDate: v.expiryDate || '',
      quantity: v.quantity || ''
    });
    setShowEditVoucherModal(true);
  };

  const handleCreateVoucher = async () => {
    if (!voucherForm.code.trim() || !voucherForm.discountPercent) { alert('Vui lòng điền mã và phần trăm giảm'); return; }
    setVoucherLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/vouchers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredToken()}` },
        body: JSON.stringify({
          ...voucherForm,
          discountPercent: parseInt(voucherForm.discountPercent),
          maxDiscountAmount: parseFloat(voucherForm.maxDiscountAmount || 0),
          minOrderValue: parseFloat(voucherForm.minOrderValue || 0),
          quantity: parseInt(voucherForm.quantity || 0)
        })
      });
      if (!res.ok) throw new Error('Lỗi khi tạo voucher');
      const data = await res.json();
      setVouchers(prev => [...prev, data]);
      setShowAddVoucherModal(false);
      setVoucherForm({ code: '', discountPercent: '', maxDiscountAmount: '', minOrderValue: '', expiryDate: '', quantity: '' });
      alert('Thêm voucher thành công!');
    } catch (e) { alert(e.message); } finally { setVoucherLoading(false); }
  };

  const handleUpdateVoucher = async () => {
    setVoucherLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/vouchers/${editingVoucher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredToken()}` },
        body: JSON.stringify({
          ...voucherForm,
          discountPercent: parseInt(voucherForm.discountPercent),
          maxDiscountAmount: parseFloat(voucherForm.maxDiscountAmount || 0),
          minOrderValue: parseFloat(voucherForm.minOrderValue || 0),
          quantity: parseInt(voucherForm.quantity || 0)
        })
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật voucher');
      const data = await res.json();
      setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? data : v));
      setShowEditVoucherModal(false);
      setEditingVoucher(null);
      alert('Cập nhật thành công!');
    } catch (e) { alert(e.message); } finally { setVoucherLoading(false); }
  };

  const handleToggleVoucher = async (id) => {
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/vouchers/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      // SỬA LỖI URL: Xóa /api
      const resList = await fetch(`${API_BASE}/admin/vouchers`, {
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      const data = await resList.json();
      setVouchers(data);
      alert('Đã thay đổi trạng thái voucher!');
    } catch (e) { alert(e.message); }
  };


  const handleCreateUser = async () => {
    if (!userForm.username || !userForm.email || !userForm.password || !userForm.fullName) {
      alert('Vui lòng điền đầy đủ: Tên đăng nhập, Họ tên, Email và Mật khẩu');
      return;
    }
    setUserLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getStoredToken()}` 
        },
        body: JSON.stringify(userForm)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi khi tạo người dùng');
      }
      const data = await res.json();
      setUsers(prev => [...prev, data]);
      setShowAddUserModal(false);
      setUserForm({ username: '', fullName: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
      alert('Thêm người dùng thành công!');
    } catch (e) {
      alert(e.message);
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa người dùng');
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('Xóa thành công!');
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleUserStatus = async (id) => {
    try {
      // SỬA LỖI URL: Xóa /api
      const res = await fetch(`${API_BASE}/admin/users/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      if (!res.ok) throw new Error('Lỗi khi thay đổi trạng thái');
      const data = await res.json();
      setUsers(prev => prev.map(u => u.id === id ? data : u));
    } catch (e) {
      alert(e.message);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bRes, uRes, vRes, nRes, rRes, sRes] = await Promise.all([
        authFetch('/admin/bookings'),
        authFetch('/admin/users'),
        authFetch('/admin/vouchers'),
        authFetch('/admin/news'),
        authFetch('/admin/rooms'),
        authFetch('/admin/services'),
      ]);
      const responses = [bRes, uRes, vRes, nRes, rRes, sRes];
      const failed = responses.find(res => !res.ok);
      if (failed) {
        if (failed.status === 401 || failed.status === 403) {
          throw new Error('Không có quyền truy cập hoặc token không hợp lệ. Vui lòng đăng nhập lại bằng tài khoản Admin.');
        }
        throw new Error(`Server trả về lỗi ${failed.status}`);
      }
      const [b, u, v, n, r, s] = await Promise.all([bRes.json(), uRes.json(), vRes.json(), nRes.json(), rRes.json(), sRes.json()]);
      setBookings(Array.isArray(b) ? b : []);
      setUsers(Array.isArray(u) ? u : []);
      setVouchers(Array.isArray(v) ? v : []);
      setNews(Array.isArray(n) ? n : []);
      setRooms(Array.isArray(r) ? r : []);
      setServices(Array.isArray(s) ? s : []);
      setLastFetch(new Date().toLocaleTimeString('vi-VN'));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openRoomDetail = (room) => {
    setSelectedRoom(room);
    setShowRoomDetailModal(true);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber || '',
      type: room.type || room.roomType || '',
      basePrice: room.basePrice || '',
      address: room.address || '',
      description: room.description || '',
      maxOccupancy: room.maxOccupancy || '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join('\n') : '',
      images: Array.isArray(room.images) ? room.images.join('\n') : ''
    });
    setShowEditRoomModal(true);
  };

  const handleCreateRoom = async () => {
    if (!roomForm.roomNumber.trim() || !roomForm.type.trim() || !roomForm.basePrice) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc: Số phòng, Loại phòng, Giá cơ bản');
      return;
    }

    setCreatingRoom(true);
    try {
      const requestData = {
        roomNumber: roomForm.roomNumber.trim(),
        type: roomForm.type.trim(),
        basePrice: parseFloat(roomForm.basePrice),
        address: roomForm.address.trim() || null,
        description: roomForm.description.trim() || null,
        maxOccupancy: roomForm.maxOccupancy ? parseInt(roomForm.maxOccupancy) : null,
        amenities: roomForm.amenities.split('\n').map(a => a.trim()).filter(a => a !== ''),
        images: roomForm.images.split('\n').map(i => i.trim()).filter(i => i !== '')
      };

      const response = await fetch(`${API_BASE}/admin/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getStoredToken()}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Không có quyền truy cập hoặc token không hợp lệ');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      const newRoom = await response.json();
      setRooms(prev => [...prev, newRoom]);
      setShowAddRoomModal(false);
      setRoomForm({
        roomNumber: '',
        type: '',
        basePrice: '',
        address: '',
        description: '',
        maxOccupancy: '',
        amenities: '',
        images: ''
      });
      alert('Thêm phòng thành công!');
    } catch (e) {
      alert('Lỗi khi thêm phòng: ' + e.message);
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleUpdateRoom = async () => {
    if (!roomForm.roomNumber.trim() || !roomForm.type.trim() || !roomForm.basePrice) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc: Số phòng, Loại phòng, Giá cơ bản');
      return;
    }

    setUpdatingRoom(true);
    try {
      const requestData = {
        roomNumber: roomForm.roomNumber.trim(),
        type: roomForm.type.trim(),
        basePrice: parseFloat(roomForm.basePrice),
        address: roomForm.address.trim() || null,
        description: roomForm.description.trim() || null,
        maxOccupancy: roomForm.maxOccupancy ? parseInt(roomForm.maxOccupancy) : null,
        amenities: roomForm.amenities.split('\n').map(a => a.trim()).filter(a => a !== ''),
        images: roomForm.images.split('\n').map(i => i.trim()).filter(i => i !== '')
      };

      const response = await fetch(`${API_BASE}/admin/rooms/${editingRoom.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getStoredToken()}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Không có quyền truy cập hoặc token không hợp lệ');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      const updatedRoom = await response.json();
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? updatedRoom : r));
      setShowEditRoomModal(false);
      setEditingRoom(null);
      setRoomForm({
        roomNumber: '',
        type: '',
        basePrice: '',
        address: '',
        description: '',
        maxOccupancy: '',
        amenities: '',
        images: ''
      });
      alert('Cập nhật phòng thành công!');
    } catch (e) {
      alert('Lỗi khi cập nhật phòng: ' + e.message);
    } finally {
      setUpdatingRoom(false);
    }
  };

  const openDeleteRoom = async (room) => {
    setDeletingRoom(room);
    setDeleteCheckResult(null);
    setDeletingLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const response = await fetch(`${API_BASE}/admin/rooms/${room.id}/check-deletion`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      if (!response.ok) throw new Error('Không thể kiểm tra phòng');
      const result = await response.json();
      setDeleteCheckResult(result);
      setShowDeleteRoomModal(true);
    } catch (e) {
      alert('Lỗi khi kiểm tra phòng: ' + e.message);
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;
    setDeletingLoading(true);
    try {
      // SỬA LỖI URL: Xóa /api
      const response = await fetch(`${API_BASE}/admin/rooms/${deletingRoom.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Không có quyền truy cập');
        }
        throw new Error('Không thể xoá phòng');
      }
      setRooms(prev => prev.filter(r => r.id !== deletingRoom.id));
      setShowDeleteRoomModal(false);
      setDeletingRoom(null);
      setDeleteCheckResult(null);
      alert('Xoá phòng thành công!');
    } catch (e) {
      alert('Lỗi khi xoá phòng: ' + e.message);
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // SỬA LỖI URL: Xóa /api
      const response = await fetch(`${API_BASE}/files/room/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getStoredToken()}` },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload ảnh thất bại');
      const data = await response.json();
      if (data.url) {
        setRoomForm(prev => ({
          ...prev,
          images: prev.images ? prev.images + '\n' + data.url : data.url
        }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = null;
    }
  };

  useEffect(() => {
    if (authOk === true) loadData();
  }, [authOk]);

  const serviceUnits = [
    { value: 'LUOT', label: 'Lượt' },
    { value: 'NGAY', label: 'Ngày' },
    { value: 'NGUOI', label: 'Người' },
    { value: 'NGUOI_NGAY', label: 'Người/Ngày' }
  ];

  const uniqueUnits = useMemo(() => {
    const dbUnits = services.map(s => s.unit).filter(u => u);
    const all = [...serviceUnits];
    dbUnits.forEach(dbU => {
      if (!all.find(a => a.value === dbU || a.label === dbU)) {
        all.push({ value: dbU, label: dbU });
      }
    });
    return all;
  }, [services]);

  /* ── Render: loading auth ── */
  if (authOk === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 68px)' }}>
          <p style={{ color: '#64748B' }}>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  /* ── Render: not admin ── */
  if (authOk === false) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
        <Navbar />
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', height: 'calc(100vh - 68px)', gap: '16px',
        }}>
          <AlertTriangle size={48} color="#EF4444" />
          <h2 style={{ color: '#0F2E5A', margin: 0 }}>Không có quyền truy cập</h2>
          <p style={{ color: '#64748B', margin: 0 }}>Bạn cần đăng nhập bằng tài khoản Admin.</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 24px', background: '#2563EB', color: '#fff',
              border: 'none', borderRadius: '10px', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px',
            }}
          >Đăng nhập</button>
        </div>
      </div>
    );
  }

  /* ── Derived stats ── */
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const activeVouchers = vouchers.filter(v => v.active).length;

  /* ── TABLE STYLES ── */
  const th = {
    padding: '10px 16px', background: '#F8FAFC',
    fontSize: '12px', fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    textAlign: 'left', borderBottom: '1px solid #E2E8F0',
  };
  const td = {
    padding: '12px 16px', fontSize: '13px',
    color: '#334155', borderBottom: '1px solid #F1F5F9',
  };

  const menuBtn = {
    width: '100%', padding: '12px 20px', border: 'none',
    background: 'transparent', textAlign: 'left', cursor: 'pointer',
    fontSize: '14px', color: '#334155', fontWeight: '500',
    borderRadius: '8px', marginBottom: '4px',
  };

  const activeMenuBtn = { ...menuBtn, background: '#F0F6FF', color: '#2563EB', fontWeight: '600' };

  const getTabTitle = (tab) => {
    const titles = {
      dashboard: 'Dashboard',
      bookings: 'Đặt phòng',
      rooms: 'Quản lý Phòng',
      services: 'Dịch vụ khách sạn',
      users: 'Người dùng',
      vouchers: 'Voucher',
      news: 'Tin tức',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F6FF', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px', background: '#fff', borderRight: '1px solid #E2E8F0',
          padding: '20px 0', boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            padding: '0 20px 20px', borderBottom: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Shield size={20} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0F2E5A' }}>Quản trị</h3>
          </div>

          <nav style={{ padding: '20px 0' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={activeTab === 'dashboard' ? activeMenuBtn : menuBtn}
            >
              <LayoutDashboard size={16} style={{ marginRight: '8px' }} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              style={activeTab === 'bookings' ? activeMenuBtn : menuBtn}
            >
              <CalendarCheck size={16} style={{ marginRight: '8px' }} />
              Đặt phòng
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              style={activeTab === 'rooms' ? activeMenuBtn : menuBtn}
            >
              <BedDouble size={16} style={{ marginRight: '8px' }} />
              Phòng nghỉ
            </button>
            <button
              onClick={() => setActiveTab('services')}
              style={activeTab === 'services' ? activeMenuBtn : menuBtn}
            >
              <ConciergeBell size={16} style={{ marginRight: '8px' }} />
              Dịch vụ
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={activeTab === 'users' ? activeMenuBtn : menuBtn}
            >
              <Users size={16} style={{ marginRight: '8px' }} />
              Người dùng
            </button>
            <button
              onClick={() => setActiveTab('vouchers')}
              style={activeTab === 'vouchers' ? activeMenuBtn : menuBtn}
            >
              <Tag size={16} style={{ marginRight: '8px' }} />
              Voucher
            </button>
            <button
              onClick={() => setActiveTab('news')}
              style={activeTab === 'news' ? activeMenuBtn : menuBtn}
            >
              <Newspaper size={16} style={{ marginRight: '8px' }} />
              Tin tức
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '28px',
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0F2E5A' }}>
                {getTabTitle(activeTab)}
              </h1>
              {lastFetch && activeTab === 'dashboard' && (
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                  Cập nhật lúc {lastFetch}
                </p>
              )}
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', background: '#2563EB', color: '#fff',
                border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600', fontSize: '14px', opacity: loading ? 0.7 : 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#FEF2F2', border: '1px solid #FCA5A5',
              color: '#EF4444', padding: '14px 18px', borderRadius: '12px',
              marginBottom: '24px', fontSize: '14px',
            }}>
              <AlertTriangle size={18} />
              <span>{error} — Kiểm tra kết nối backend và đăng nhập lại nếu cần.</span>
            </div>
          )}

          {/* Content based on activeTab */}
          {activeTab === 'dashboard' && (
            <AdminDashboard
              bookings={bookings}
              rooms={rooms}
              users={users}
              services={services}
              vouchers={vouchers}
              lastFetch={lastFetch}
            />
          )}

          {activeTab === 'bookings' && <AdminBookings bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />}

          {activeTab === 'rooms' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Quản lý Phòng ({rooms.length})</h2>
                <button style={{ ...addBtnStyle, background: '#3B82F6' }} onClick={() => setShowAddRoomModal(true)}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Số phòng', 'Loại phòng', 'Giá cơ bản', 'Trạng thái', 'Thao tác'].map(h => (
                        <th key={h} style={{ ...th, textAlign: h === 'Thao tác' ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : rooms.map(r => (
                      <tr key={r.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...td, fontWeight: '700' }}>P.{r.roomNumber}</td>
                        <td style={td}>{r.type || r.roomType}</td>
                        <td style={{ ...td, fontWeight: '600' }}>{r.basePrice?.toLocaleString()}₫</td>
                        <td style={td}><StatusBadge value={r.status || 'AVAILABLE'} /></td>
                        <td style={{ ...td, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button title="Xem chi tiết" style={{ ...actionBtnStyle, color: '#059669' }} onMouseEnter={e => e.currentTarget.style.background = '#D1FAE5'} onMouseLeave={e => e.currentTarget.style.background = 'none'} onClick={() => openRoomDetail(r)}><Eye size={16} /></button>
                            <button title="Chỉnh sửa" style={{ ...actionBtnStyle, color: '#2563EB' }} onMouseEnter={e => e.currentTarget.style.background = '#DBEAFE'} onMouseLeave={e => e.currentTarget.style.background = 'none'} onClick={() => openEditRoom(r)}><Edit size={16} /></button>
                            <button title="Xóa" style={{ ...actionBtnStyle, color: '#EF4444' }} onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background = 'none'} onClick={() => openDeleteRoom(r)}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Dịch vụ khách sạn ({services.length})</h2>
                <button style={{ ...addBtnStyle, background: '#2563EB' }} onClick={() => {
                  setServiceForm({ serviceName: '', description: '', price: '', unit: '', isAvailable: true });
                  setShowAddServiceModal(true);
                }}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Tên dịch vụ', 'Giá', 'Đơn vị', 'Trạng thái', 'Thao tác'].map(h => (
                        <th key={h} style={{ ...th, textAlign: h === 'Thao tác' ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : services.map(s => (
                      <tr key={s.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...td, fontWeight: '600' }}>{s.serviceName}</td>
                        <td style={td}>{s.price?.toLocaleString()}₫</td>
                        <td style={{ ...td, fontSize: '12px', color: '#64748B' }}>{s.unit}</td>
                        <td style={td}>
                          {s.isAvailable !== false
                            ? <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600' }}>Đang bán</span>
                            : <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>Ngừng</span>
                          }
                        </td>
                        <td style={{ ...td, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => openEditService(s)} style={{ ...actionBtnStyle, color: '#2563EB' }}><Edit size={16} /></button>
                            <button onClick={() => handleDeleteService(s.id)} style={{ ...actionBtnStyle, color: '#EF4444' }}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Người dùng ({users.length})</h2>
                   <div style={{ position: 'relative' }}>
                     <input 
                       type="text" 
                       placeholder="Tìm theo SĐT, Tên, Email..." 
                       value={userSearchTerm}
                       onChange={(e) => setUserSearchTerm(e.target.value)}
                       style={{
                         padding: '8px 12px 8px 36px',
                         borderRadius: '8px',
                         border: '1px solid #E2E8F0',
                         fontSize: '14px',
                         width: '240px',
                         outline: 'none'
                       }}
                     />
                     <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                       <Users size={16} />
                     </span>
                   </div>
                 </div>
                 <button style={{ ...addBtnStyle, background: '#1E40AF' }} onClick={() => setShowAddUserModal(true)}>
                   <Plus size={14} /> Thêm mới
                 </button>
               </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['ID', 'Họ tên', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Thao tác'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => 
                      (u.fullName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      (u.phone || '').includes(userSearchTerm)
                    ).length === 0 ? (
                      <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không tìm thấy người dùng phù hợp</td></tr>
                    ) : users.filter(u => 
                       (u.fullName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                       (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                       (u.phone || '').includes(userSearchTerm)
                    ).map(u => (
                      <tr key={u.id}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}>#{u.id}</td>
                        <td style={td}>{u.fullName || '—'}</td>
                        <td style={td}>{u.email || '—'}</td>
                        <td style={td}>{u.phone || '—'}</td>
                        <td style={td}>
                          <span style={{
                            background: u.role === 'ADMIN' ? '#DBEAFE' : '#EFF6FF',
                            color: u.role === 'ADMIN' ? '#1E40AF' : '#2563EB',
                            padding: '2px 10px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: '600',
                          }}>{u.role || 'USER'}</span>
                        </td>
                         <td style={td}>
                           {u.status === false
                             ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '13px' }}><XCircle size={14} /> Bị khoá</span>
                             : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '13px' }}><CheckCircle size={14} /> Hoạt động</span>
                           }
                         </td>
                         <td style={td}>
                           <div style={{ display: 'flex', gap: '8px' }}>
                             <button 
                               title={u.status ? "Khoá tài khoản" : "Mở khoá tài khoản"}
                               onClick={() => handleToggleUserStatus(u.id)}
                               style={{ ...actionBtnStyle, color: u.status ? '#EF4444' : '#059669' }}
                             >
                               {u.status ? <XCircle size={16} /> : <CheckCircle size={16} />}
                             </button>
                             <button 
                               title="Xoá người dùng"
                               onClick={() => handleDeleteUser(u.id)}
                               style={{ ...actionBtnStyle, color: '#DC2626' }}
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vouchers' && (
            <AdminVouchers 
              vouchers={vouchers} 
              onAdd={() => {
                setVoucherForm({ code: '', discountPercent: '', maxDiscountAmount: '', minOrderValue: '', expiryDate: '', quantity: '' });
                setShowAddVoucherModal(true);
              }}
              onEdit={openEditVoucher}
              onToggle={handleToggleVoucher}
            />
          )}

          {activeTab === 'news' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Tin tức ({news.length})</h2>
                <button style={{ ...addBtnStyle, background: '#2563EB' }} onClick={() => {
                  setNewsForm({ title: '', thumbnail: '', content: '', expiryDate: '' });
                  setShowAddNewsModal(true);
                }}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Ảnh', 'Tiêu đề', 'Ngày tạo', 'Hết hạn', 'Thao tác'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {news.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : news.map(n => (
                      <tr key={n.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={td}>
                          {n.thumbnail ? (
                            <img src={n.thumbnail} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94A3B8' }}>No pic</div>
                          )}
                        </td>
                        <td style={{ ...td, fontWeight: '600', maxWidth: '300px' }}>{n.title || '—'}</td>
                        <td style={td}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                        <td style={td}>{n.expiryDate ? new Date(n.expiryDate).toLocaleDateString('vi-VN') : '∞'}</td>
                        <td style={{ ...td, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => openEditNews(n)} style={{ ...actionBtnStyle, color: '#2563EB' }}><Edit size={16} /></button>
                            <button onClick={() => handleDeleteNews(n.id)} style={{ ...actionBtnStyle, color: '#EF4444' }}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm phòng */}
      {showAddRoomModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%',
            maxWidth: '600px', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{
              padding: '24px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0F2E5A' }}>Thêm phòng mới</h2>
              <button
                onClick={() => setShowAddRoomModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748B', padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Số phòng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    placeholder="VD: 101"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Loại phòng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="SUITE">Suite</option>
                    <option value="PRESIDENTIAL">Presidential</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Giá cơ bản (₫) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={roomForm.basePrice}
                    onChange={(e) => setRoomForm({ ...roomForm, basePrice: e.target.value })}
                    placeholder="VD: 500000"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Sức chứa tối đa
                  </label>
                  <input
                    type="number"
                    value={roomForm.maxOccupancy}
                    onChange={(e) => setRoomForm({ ...roomForm, maxOccupancy: e.target.value })}
                    placeholder="VD: 2"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={roomForm.address}
                  onChange={(e) => setRoomForm({ ...roomForm, address: e.target.value })}
                  placeholder="VD: Tầng 1, Khách sạn ABC"
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Mô tả
                </label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  placeholder="Mô tả chi tiết về phòng..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Tiện nghi (mỗi tiện nghi một dòng)
                </label>
                <textarea
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  placeholder="WiFi miễn phí&#10;Điều hòa&#10;Tivi&#10;Minibar"
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Hình ảnh phòng
                  </label>
                  <div>
                    <input 
                      type="file" 
                      id="upload-room-img" 
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label 
                      htmlFor="upload-room-img" 
                      style={{ 
                        fontSize: '13px', color: '#2563EB', cursor: 'pointer', fontWeight: '600',
                        opacity: uploadingImage ? 0.5 : 1, pointerEvents: uploadingImage ? 'none' : 'auto' 
                      }}
                    >
                      {uploadingImage ? 'Đang tải lên...' : '+ Tải ảnh từ thiết bị'}
                    </label>
                  </div>
                </div>
                <textarea
                  value={roomForm.images}
                  onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                  placeholder="Hoặc nhập URL trực tiếp (mỗi URL một dòng)&#10;https://example.com/image1.jpg"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddRoomModal(false)}
                  style={{
                    padding: '10px 20px', background: '#F3F4F6', color: '#374151',
                    border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600'
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={creatingRoom}
                  style={{
                    padding: '10px 20px', background: '#2563EB', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: creatingRoom ? 'not-allowed' : 'pointer',
                    fontSize: '14px', fontWeight: '600', opacity: creatingRoom ? 0.7 : 1
                  }}
                >
                  {creatingRoom ? 'Đang tạo...' : 'Tạo phòng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết phòng */}
      {showRoomDetailModal && selectedRoom && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%',
            maxWidth: '800px', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{
              padding: '24px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0F2E5A' }}>
                  Chi tiết phòng P.{selectedRoom.roomNumber}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
                  {selectedRoom.type || selectedRoom.roomType} - {selectedRoom.basePrice?.toLocaleString()}₫/đêm
                </p>
              </div>
              <button
                onClick={() => setShowRoomDetailModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748B', padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Thông tin phòng */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0F2E5A' }}>Thông tin phòng</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                      Địa chỉ
                    </label>
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
                      {selectedRoom.address || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                      Sức chứa
                    </label>
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
                      {selectedRoom.maxOccupancy ? `${selectedRoom.maxOccupancy} người` : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                      Trạng thái
                    </label>
                    <StatusBadge value={selectedRoom.status || 'AVAILABLE'} />
                  </div>
                </div>
                {selectedRoom.description && (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                      Mô tả
                    </label>
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
                      {selectedRoom.description}
                    </p>
                  </div>
                )}
                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                      Tiện nghi
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedRoom.amenities.map((a, idx) => (
                        <span key={idx} style={{ 
                          padding: '4px 10px', background: '#F1F5F9', border: '1px solid #E2E8F0', 
                          borderRadius: '6px', fontSize: '12px', color: '#475569' 
                        }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lịch đặt phòng */}
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0F2E5A' }}>Lịch đặt phòng</h3>
                <RoomCalendar roomId={selectedRoom.id} bookings={bookings} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa phòng */}
      {showEditRoomModal && editingRoom && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%',
            maxWidth: '600px', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{
              padding: '24px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0F2E5A' }}>Chỉnh sửa phòng P.{editingRoom.roomNumber}</h2>
              <button
                onClick={() => {
                  setShowEditRoomModal(false);
                  setEditingRoom(null);
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748B', padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Số phòng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    placeholder="VD: 101"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Loại phòng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="SUITE">Suite</option>
                    <option value="PRESIDENTIAL">Presidential</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Giá cơ bản (₫) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={roomForm.basePrice}
                    onChange={(e) => setRoomForm({ ...roomForm, basePrice: e.target.value })}
                    placeholder="VD: 500000"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Sức chứa tối đa
                  </label>
                  <input
                    type="number"
                    value={roomForm.maxOccupancy}
                    onChange={(e) => setRoomForm({ ...roomForm, maxOccupancy: e.target.value })}
                    placeholder="VD: 2"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={roomForm.address}
                  onChange={(e) => setRoomForm({ ...roomForm, address: e.target.value })}
                  placeholder="VD: Tầng 1, Khách sạn ABC"
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Mô tả
                </label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  placeholder="Mô tả chi tiết về phòng..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Tiện nghi (mỗi tiện nghi một dòng)
                </label>
                <textarea
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  placeholder="WiFi miễn phí&#10;Điều hòa&#10;Tivi&#10;Minibar"
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Hình ảnh phòng
                  </label>
                  <div>
                    <input 
                      type="file" 
                      id="upload-room-img" 
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label 
                      htmlFor="upload-room-img" 
                      style={{ 
                        fontSize: '13px', color: '#2563EB', cursor: 'pointer', fontWeight: '600',
                        opacity: uploadingImage ? 0.5 : 1, pointerEvents: uploadingImage ? 'none' : 'auto' 
                      }}
                    >
                      {uploadingImage ? 'Đang tải lên...' : '+ Tải ảnh từ thiết bị'}
                    </label>
                  </div>
                </div>
                <textarea
                  value={roomForm.images}
                  onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                  placeholder="Hoặc nhập URL trực tiếp (mỗi URL một dòng)&#10;https://example.com/image1.jpg"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowEditRoomModal(false);
                    setEditingRoom(null);
                  }}
                  style={{
                    padding: '10px 20px', background: '#F3F4F6', color: '#374151',
                    border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600'
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateRoom}
                  disabled={updatingRoom}
                  style={{
                    padding: '10px 20px', background: '#2563EB', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: updatingRoom ? 'not-allowed' : 'pointer',
                    fontSize: '14px', fontWeight: '600', opacity: updatingRoom ? 0.7 : 1
                  }}
                >
                  {updatingRoom ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </button>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: '#FEF3C7', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#92400E' }}>
                  <strong>Lưu ý:</strong> Chỉnh sửa thông tin phòng sẽ không ảnh hưởng đến các đơn đặt phòng hiện tại.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Room ── */}
      {showDeleteRoomModal && deletingRoom && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={24} color="#EF4444" />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0F2E5A' }}>
                Xác nhận xoá phòng
              </h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 12px', color: '#374151', fontSize: '16px' }}>
                Bạn có chắc muốn xoá phòng <strong>P.{deletingRoom.roomNumber}</strong>?
              </p>

              {deletingLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                  <div style={{
                    width: '16px', height: '16px', border: '2px solid #E5E7EB',
                    borderTop: '2px solid #2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }}></div>
                  Đang kiểm tra...
                </div>
              ) : deleteCheckResult ? (
                <div style={{
                  padding: '12px', borderRadius: '8px',
                  background: deleteCheckResult.canDelete ? '#D1FAE5' : '#FEF3C7',
                  border: `1px solid ${deleteCheckResult.canDelete ? '#10B981' : '#F59E0B'}`
                }}>
                  <p style={{ margin: 0, color: deleteCheckResult.canDelete ? '#065F46' : '#92400E' }}>
                    {deleteCheckResult.message}
                  </p>
                  {!deleteCheckResult.canDelete && deleteCheckResult.activeBookingIds && deleteCheckResult.activeBookingIds.length > 0 && (
                    <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#92400E' }}>
                      ID đơn đặt: {deleteCheckResult.activeBookingIds.join(', ')}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteRoomModal(false)}
                style={{
                  padding: '10px 20px', background: '#F3F4F6', color: '#374151',
                  border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600'
                }}
              >
                Hủy
              </button>
              {deleteCheckResult?.canDelete && (
                <button
                  onClick={handleDeleteRoom}
                  disabled={deletingLoading}
                  style={{
                    padding: '10px 20px', background: '#EF4444', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: deletingLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px', fontWeight: '600', opacity: deletingLoading ? 0.7 : 1
                  }}
                >
                  {deletingLoading ? 'Đang xoá...' : 'Xoá phòng'}
                </button>
              )}
              {!deleteCheckResult?.canDelete && (
                <button
                  onClick={() => {
                    // Chuyển sang trạng thái MAINTENANCE
                    alert('Chức năng chuyển sang trạng thái BẢO TRÌ sẽ được thêm sau');
                    setShowDeleteRoomModal(false);
                  }}
                  style={{
                    padding: '10px 20px', background: '#F59E0B', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600'
                  }}
                >
                  Chuyển sang Bảo trì
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal Tin tức */}
      {(showAddNewsModal || showEditNewsModal) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ margin: '0 0 20px', color: '#0F2E5A' }}>{showEditNewsModal ? 'Sửa tin tức' : 'Thêm tin tức mới'}</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Tiêu đề</label>
              <input type="text" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600' }}>Ảnh thu nhỏ</label>
                <div>
                  <input 
                    type="file" 
                    id="upload-news-img" 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleNewsImageUpload}
                  />
                  <label 
                    htmlFor="upload-news-img" 
                    style={{ 
                      fontSize: '13px', color: '#2563EB', cursor: 'pointer', fontWeight: '600',
                      opacity: uploadingNewsImage ? 0.5 : 1, pointerEvents: uploadingNewsImage ? 'none' : 'auto' 
                    }}
                  >
                    {uploadingNewsImage ? 'Đang tải lên...' : '+ Tải ảnh từ thiết bị'}
                  </label>
                </div>
              </div>
              <input type="text" value={newsForm.thumbnail || ''} onChange={e => setNewsForm({ ...newsForm, thumbnail: e.target.value })} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} placeholder="Hoặc nhập URL trực tiếp..." />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Nội dung chi tiết</label>
              <textarea 
                value={newsForm.content} 
                onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} 
                style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} 
                placeholder="Nhập nội dung bài viết..."
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Ngày hết hạn (Để trống nếu không hết hạn)</label>
              <input type="datetime-local" value={newsForm.expiryDate} onChange={e => setNewsForm({ ...newsForm, expiryDate: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddNewsModal(false); setShowEditNewsModal(false); }} style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }}>Hủy</button>
              <button onClick={showEditNewsModal ? handleUpdateNews : handleCreateNews} disabled={newsLoading} style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {newsLoading ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dịch vụ */}
      {(showAddServiceModal || showEditServiceModal) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ margin: '0 0 20px', color: '#0F2E5A' }}>{showEditServiceModal ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Tên dịch vụ</label>
              <input type="text" value={serviceForm.serviceName} onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Mô tả</label>
              <textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', minHeight: '80px' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Giá (₫)</label>
                <input type="number" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Đơn vị</label>
                <select 
                  value={serviceForm.unit} 
                  onChange={e => setServiceForm({...serviceForm, unit: e.target.value})} 
                  style={{...inputStyle, width: '100%', boxSizing: 'border-box'}}
                >
                  <option value="">-- Chọn đơn vị --</option>
                  {uniqueUnits.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="isAvailable" checked={serviceForm.isAvailable} onChange={e => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })} />
              <label htmlFor="isAvailable" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Đang kinh doanh</label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddServiceModal(false); setShowEditServiceModal(false); }} style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }}>Hủy</button>
              <button onClick={showEditServiceModal ? handleUpdateService : handleCreateService} disabled={serviceLoading} style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {serviceLoading ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Voucher */}
      {(showAddVoucherModal || showEditVoucherModal) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ margin: '0 0 20px', color: '#0F2E5A' }}>{showEditVoucherModal ? 'Sửa Voucher' : 'Thêm Voucher mới'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Mã Voucher</label>
                <input type="text" value={voucherForm.code} onChange={e => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })} style={inputStyle} placeholder="VD: SUMMER2024" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Giảm (%)</label>
                <input type="number" value={voucherForm.discountPercent} onChange={e => setVoucherForm({ ...voucherForm, discountPercent: e.target.value })} style={inputStyle} placeholder="VD: 10" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Giảm tối đa (₫)</label>
                <input type="number" value={voucherForm.maxDiscountAmount} onChange={e => setVoucherForm({ ...voucherForm, maxDiscountAmount: e.target.value })} style={inputStyle} placeholder="VD: 50000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Đơn tối thiểu (₫)</label>
                <input type="number" value={voucherForm.minOrderValue} onChange={e => setVoucherForm({ ...voucherForm, minOrderValue: e.target.value })} style={inputStyle} placeholder="VD: 200000" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Số lượng</label>
                <input type="number" value={voucherForm.quantity} onChange={e => setVoucherForm({ ...voucherForm, quantity: e.target.value })} style={inputStyle} placeholder="VD: 100" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Ngày hết hạn</label>
                <input type="date" value={voucherForm.expiryDate} onChange={e => setVoucherForm({ ...voucherForm, expiryDate: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddVoucherModal(false); setShowEditVoucherModal(false); }} style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }}>Hủy</button>
              <button onClick={showEditVoucherModal ? handleUpdateVoucher : handleCreateVoucher} disabled={voucherLoading} style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {voucherLoading ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal User */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ margin: '0 0 20px', color: '#0F2E5A' }}>Thêm người dùng mới</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Tên đăng nhập <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="text" value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} style={inputStyle} placeholder="VD: user123" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Họ tên <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="text" value={userForm.fullName} onChange={e => setUserForm({ ...userForm, fullName: e.target.value })} style={inputStyle} placeholder="VD: Nguyễn Văn A" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Email <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} style={inputStyle} placeholder="email@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Mật khẩu <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} style={inputStyle} placeholder="••••••••" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Số điện thoại</label>
                <input type="text" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} style={inputStyle} placeholder="0123456789" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Vai trò</label>
                <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={inputStyle}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddUserModal(false)} style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }}>Hủy</button>
              <button onClick={handleCreateUser} disabled={userLoading} style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {userLoading ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Admin;
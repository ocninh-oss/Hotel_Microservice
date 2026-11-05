import React, { useState, useEffect } from 'react';

const RoomCalendar = ({ roomId, bookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [settingMaintenance, setSettingMaintenance] = useState(false);
  const [maintenanceDates, setMaintenanceDates] = useState(new Set());

  // Fetch maintenance dates cho phòng
  const fetchMaintenanceDates = async () => {
    if (!roomId) return;

    try {
      const API_BASE = 'http://localhost:8080';
      const response = await fetch(`${API_BASE}/api/admin/rooms/${roomId}/availability`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const availabilities = await response.json();
        const maintenanceSet = new Set();
        availabilities.forEach(avail => {
          if (avail.status === 'MAINTENANCE') {
            // Parse chuỗi YYYY-MM-DD theo local date để tránh lệch múi giờ
            const dateParts = avail.date.split('-');
            if (dateParts.length === 3) {
              const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
              maintenanceSet.add(dateObj.toDateString());
            }
          }
        });
        setMaintenanceDates(maintenanceSet);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu maintenance:', error);
    }
  };

  // Fetch data khi component mount hoặc roomId thay đổi
  useEffect(() => {
    fetchMaintenanceDates();
  }, [roomId]);

  // Listen for data changes
  useEffect(() => {
    const handleDataChange = () => {
      fetchMaintenanceDates();
    };

    window.addEventListener('roomDataChanged', handleDataChange);
    return () => window.removeEventListener('roomDataChanged', handleDataChange);
  }, [roomId]);

  // Kiểm tra ngày có đang bảo trì không
  const isMaintenance = (date) => {
    return date && maintenanceDates.has(date.toDateString());
  };

  // Lọc bookings của phòng này và chỉ lấy những đơn đang hoạt động (không bị hủy)
  const roomBookings = bookings.filter(b => 
    (b.room?.id === roomId || b.roomId === roomId) && 
    b.status !== 'CANCELLED'
  );

  // Tạo set các ngày đã đặt
  const bookedDates = new Set();
  roomBookings.forEach(booking => {
    if (booking.checkInDate && booking.checkOutDate) {
      // Parse chuỗi date từ backend theo local time
      const startParts = booking.checkInDate.split('-');
      const endParts = booking.checkOutDate.split('-');
      
      const start = new Date(startParts[0], startParts[1] - 1, startParts[2]);
      const end = new Date(endParts[0], endParts[1] - 1, endParts[2]);
      const current = new Date(start);

      while (current < end) {
        bookedDates.add(current.toDateString());
        current.setDate(current.getDate() + 1);
      }
    }
  });
  const handleDateClick = (date) => {
    if (!date || isPast(date)) return; // Không cho click ngày quá khứ
    setSelectedDate(date);
    setShowDateMenu(true);
  };

  // Set maintenance cho ngày cụ thể
  const handleSetMaintenance = async () => {
    if (!selectedDate) return;

    setSettingMaintenance(true);
    try {
      const API_BASE = 'http://localhost:8080';
      
      // Định dạng YYYY-MM-DD theo giờ địa phương thay vì sử dụng toISOString()
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;

      const response = await fetch(`${API_BASE}/api/admin/rooms/${roomId}/set-maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: localDateStr,
          status: 'MAINTENANCE'
        })
      });

      if (response.ok) {
        alert(`Đã đặt bảo trì cho ngày ${selectedDate.toLocaleDateString('vi-VN')}`);
        setShowDateMenu(false);
        setSelectedDate(null);
        // Có thể emit event để refresh data ở parent component
        window.dispatchEvent(new CustomEvent('roomDataChanged'));
      } else {
        const error = await response.json();
        alert('Lỗi: ' + (error.message || 'Không thể đặt bảo trì'));
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + error.message);
    } finally {
      setSettingMaintenance(false);
    }
  };

  // Hủy bảo trì cho ngày cụ thể
  const handleCancelMaintenance = async () => {
    if (!selectedDate) return;

    setSettingMaintenance(true);
    try {
      const API_BASE = 'http://localhost:8080';
      
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;

      const response = await fetch(`${API_BASE}/api/admin/rooms/${roomId}/cancel-maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: localDateStr
        })
      });

      if (response.ok) {
        alert(`Đã hủy bảo trì cho ngày ${selectedDate.toLocaleDateString('vi-VN')}`);
        setShowDateMenu(false);
        setSelectedDate(null);
        // Gọi lại hàm fetch để cập nhật giao diện ngay lập tức
        fetchMaintenanceDates();
        window.dispatchEvent(new CustomEvent('roomDataChanged'));
      } else {
        const error = await response.json();
        alert('Lỗi: ' + (error.message || 'Không thể hủy bảo trì'));
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + error.message);
    } finally {
      setSettingMaintenance(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Thêm các ngày trống đầu tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const isBooked = (date) => {
    return date && bookedDates.has(date.toDateString());
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header điều hướng tháng */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', padding: '0 8px'
      }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            background: '#F3F4F6', border: 'none', borderRadius: '8px',
            padding: '8px 12px', cursor: 'pointer', color: '#374151'
          }}
        >
          ‹ Trước
        </button>
        <h4 style={{
          margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F2E5A'
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth(1)}
          style={{
            background: '#F3F4F6', border: 'none', borderRadius: '8px',
            padding: '8px 12px', cursor: 'pointer', color: '#374151'
          }}
        >
          Sau ›
        </button>
      </div>

      {/* Header ngày trong tuần */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px',
        background: '#E2E8F0', borderRadius: '8px', overflow: 'hidden'
      }}>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div key={day} style={{
            background: '#F8FAFC', padding: '12px 8px', textAlign: 'center',
            fontSize: '12px', fontWeight: '600', color: '#64748B'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Lưới ngày */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px',
        background: '#E2E8F0', borderRadius: '8px', overflow: 'hidden', marginTop: '1px'
      }}>
        {days.map((date, index) => (
          <div
            key={index}
            style={{
              background: date ? (isBooked(date) ? '#2563EB' : (isMaintenance(date) ? '#F59E0B' : '#FFFFFF')) : '#F8FAFC',
              padding: '12px 8px', textAlign: 'center', minHeight: '60px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: date && !isPast(date) ? 'pointer' : 'default',
              border: isToday(date) ? '2px solid #EF4444' : 'none',
              opacity: isPast(date) ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onClick={() => handleDateClick(date)}
            onMouseEnter={(e) => {
              if (date && !isBooked(date) && !isMaintenance(date) && !isPast(date)) {
                e.currentTarget.style.background = '#F8FAFC';
              }
            }}
            onMouseLeave={(e) => {
              if (date && !isBooked(date) && !isMaintenance(date) && !isPast(date)) {
                e.currentTarget.style.background = '#FFFFFF';
              }
            }}
          >
            {date && (
              <>
                <span style={{
                  fontSize: '14px', fontWeight: '600', color: (isBooked(date) || isMaintenance(date)) ? '#FFFFFF' : (isToday(date) ? '#EF4444' : '#334155')
                }}>
                  {date.getDate()}
                </span>
                {isBooked(date) && (
                  <span style={{
                    fontSize: '10px', color: '#BFDBFE', marginTop: '2px'
                  }}>
                    Đã đặt
                  </span>
                )}
                {isMaintenance(date) && (
                  <span style={{
                    fontSize: '10px', color: '#FEF3C7', marginTop: '2px'
                  }}>
                    Bảo trì
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Popup menu cho ngày được chọn */}
      {showDateMenu && selectedDate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            minWidth: '300px',
            maxWidth: '400px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{
                margin: '0 0 8px',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0F2E5A'
              }}>
                Ngày {selectedDate.toLocaleDateString('vi-VN')}
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#64748B'
              }}>
                {isBooked(selectedDate) ? 'Trạng thái: Đã đặt phòng' : (isMaintenance(selectedDate) ? 'Trạng thái: Đang bảo trì' : 'Trạng thái: Trống')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDateMenu(false);
                  setSelectedDate(null);
                }}
                style={{
                  padding: '8px 16px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Hủy
              </button>

              {!isBooked(selectedDate) && !isMaintenance(selectedDate) && (
                <button
                  onClick={handleSetMaintenance}
                  disabled={settingMaintenance}
                  style={{
                    padding: '8px 16px',
                    background: settingMaintenance ? '#9CA3AF' : '#F59E0B',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: settingMaintenance ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: settingMaintenance ? 0.7 : 1
                  }}
                >
                  {settingMaintenance ? 'Đang xử lý...' : 'Đặt bảo trì'}
                </button>
              )}

              {isMaintenance(selectedDate) && (
                <button
                  onClick={handleCancelMaintenance}
                  disabled={settingMaintenance}
                  style={{
                    padding: '8px 16px',
                    background: settingMaintenance ? '#9CA3AF' : '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: settingMaintenance ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {settingMaintenance ? 'Đang xử lý...' : 'Hủy bảo trì'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chú thích */}
      <div style={{
        display: 'flex', gap: '16px', justifyContent: 'center',
        marginTop: '16px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#FFFFFF',
            border: '1px solid #E2E8F0', borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Trống</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#2563EB',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Đã đặt</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#F59E0B',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Bảo trì</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#FFFFFF',
            border: '2px solid #EF4444', borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Hôm nay</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCalendar;
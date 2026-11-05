package com.example.services;

import com.example.client.RoomServiceClient;
import com.example.client.UserServiceClient;
import com.example.dto.request.BookingRequest;
import com.example.dto.response.BookingResponse;
import com.example.entity.mysql.*;
import com.example.exceptions.AppException;
import com.example.mapper.BookingMapper;
import com.example.repository.mysql.*;
import com.example.utils.DateUtils;
import com.example.utils.PriceUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class BookingService {
    

    @Inject BookingRepository             bookingRepository;
    @Inject BookingServiceItemRepository  bookingServiceItemRepository;
    @Inject VoucherRepository             voucherRepository;
    @Inject BookingMapper                 bookingMapper;
    @Inject
    @RestClient
    RoomServiceClient roomServiceClient;
    @Inject
    @RestClient
    UserServiceClient userServiceClient;

    // ─── CUSTOMER ────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(Long currentUserId, BookingRequest req) {

        // 1. Validate ngày
        // Gọi sang room_service kiểm tra lịch trống trước khi cho phép đặt
        boolean isAvailable = roomServiceClient.checkAvailability(req.roomId, req.checkInDate, req.checkOutDate);
        if (!isAvailable) {
            throw new AppException("Rất tiếc, phòng này đã có người đặt hoặc đang bảo trì trong thời gian bạn chọn.", 400);
}
        if (req.checkInDate == null || req.checkOutDate == null)
            throw new AppException("Ngày nhận/trả phòng không được để trống", 400);
        if (DateUtils.isPast(req.checkInDate))
            throw new AppException("Ngày nhận phòng không được ở quá khứ", 400);
        
        long nights;
        try {
            nights = DateUtils.countNights(req.checkInDate, req.checkOutDate);
        } catch (IllegalArgumentException e) {
            throw new AppException(e.getMessage(), 400);
        }

       // 2 & 3. Gọi API sang Room Service (Cổng 8082) để lấy thông tin phòng
        System.err.println(">>> Đang gọi API sang Room Service lấy giá phòng: " + req.roomId);
        double roomPrice = 0.0;
        try {
            com.example.dto.response.RoomDto room = roomServiceClient.getRoomById(req.roomId);
            if (room != null && room.basePrice != null) {
                roomPrice = PriceUtils.round(room.basePrice * nights);
            } else {
                throw new AppException("Dữ liệu phòng trả về không hợp lệ", 500);
            }
        } catch (jakarta.ws.rs.WebApplicationException e) {
            if (e.getResponse().getStatus() == 404) {
                throw new AppException("Phòng không tồn tại bên Room Service", 404);
            }
            throw new AppException("Lỗi khi kết nối đến Room Service: " + e.getMessage(), 500);
        }
        
        // 4. Tính tiền dịch vụ
        double servicePrice = 0;
        List<BookingServiceItem> items = new ArrayList<>();

        /* TẠM ẨN: Sẽ phải call API sang RoomService để tính tiền service
        if (req.services != null && !req.services.isEmpty()) {
           // ... logic tính tiền service
        }
        */

        // 5. Áp dụng voucher (nếu có)
        double discount = 0;
        Voucher appliedVoucher = null;

        if (req.voucherCode != null && !req.voucherCode.isBlank()) {
            appliedVoucher = validateAndConsumeVoucher(
                    req.voucherCode, roomPrice + servicePrice
            );
            discount = PriceUtils.calcDiscount(
                    roomPrice + servicePrice,
                    appliedVoucher.discountPercent,
                    appliedVoucher.maxDiscountAmount
            );
        }

        // 6. Tính tổng tiền cuối
        double totalPrice = PriceUtils.calcTotal(roomPrice, servicePrice, discount);

        // 8. Tạo Booking
        Booking booking = new Booking();
        booking.userId            = currentUserId; 
        booking.roomId            = req.roomId;
        booking.voucherId         = appliedVoucher != null ? appliedVoucher.id : null; 
        booking.checkInDate       = req.checkInDate;
        booking.checkOutDate      = req.checkOutDate;
        booking.totalRoomPrice    = roomPrice;
        booking.totalServicePrice = PriceUtils.round(servicePrice);
        booking.discountAmount    = PriceUtils.round(discount);
        booking.totalPrice        = PriceUtils.round(totalPrice);
        booking.status            = Booking.BookingStatus.PENDING;
        booking.paymentStatus     = false;


        // 8. Tạo Booking vào MySQL
    bookingRepository.persist(booking);

    // BỔ SUNG DÒNG NÀY: Gọi API sang MongoDB của RoomService để khóa lịch phòng
    roomServiceClient.lockRoomDates(req.roomId, req.checkInDate, req.checkOutDate, booking.id);

        // 10. Lưu từng booking service item
        for (BookingServiceItem item : items) {
            item.booking = booking;
            bookingServiceItemRepository.persist(item);
        }

        System.err.println(">>> [createBooking] Booking created SUCCESSFULLY: ID=" + booking.id);
        return bookingMapper.toResponse(booking);
    }

    public List<BookingResponse> getMyBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        if (bookings == null || bookings.isEmpty()) return new ArrayList<>();

        return bookings.stream()
                .map(this::mapToEnrichedResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getMyBookingById(Long bookingId, Long userId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (!booking.userId.equals(userId))
            throw new AppException("Không có quyền xem đơn này", 403);
            
        return mapToEnrichedResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.userId.equals(userId))
            throw new AppException("Không có quyền hủy đơn này", 403);

        if (booking.status == Booking.BookingStatus.CANCELLED)
            throw new AppException("Đơn đặt phòng đã được hủy trước đó", 400);

        if (booking.status == Booking.BookingStatus.COMPLETED)
            throw new AppException("Không thể hủy đơn đã hoàn tất", 400);

        // Hoàn lại số lượng voucher nếu đã dùng
        if (booking.voucherId != null) { 
            Voucher v = voucherRepository.findById(booking.voucherId);
            if (v != null) {
                v.quantity++;
                voucherRepository.persist(v);
            }
        }

        booking.status = Booking.BookingStatus.CANCELLED;
        bookingRepository.persist(booking);
        
        /* TẠM ẨN: Giải phóng phòng (sẽ gọi API sang RoomService)
        updateRoomAvailabilityForBooking(booking);
        */

        System.err.println(">>> [cancelBooking] Booking CANCELLED successfully: ID=" + bookingId);
        return bookingMapper.toResponse(booking);
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    public List<BookingResponse> getAllBookings() {
        // Lọc bỏ đơn CANCELLED và dùng hàm mapToEnrichedResponse để lấy tên
        return bookingRepository.find("status != ?1", Booking.BookingStatus.CANCELLED)
                .list()
                .stream()
                .map(this::mapToEnrichedResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByStatus(String status) {
        try {
            Booking.BookingStatus bs = Booking.BookingStatus.valueOf(status.toUpperCase());
            return bookingRepository.find("status", bs)
                    .stream()
                    .map(bookingMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new AppException("Trạng thái không hợp lệ: " + status, 400);
        }
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId,
                                               String newStatus,
                                               Boolean paymentStatus) {
        Booking booking = findBookingOrThrow(bookingId);

        if (newStatus != null) {
            try {
                Booking.BookingStatus bs = Booking.BookingStatus.valueOf(newStatus.toUpperCase());

                // Validate chuyển trạng thái hợp lý
                validateStatusTransition(booking, bs);
                booking.status = bs;
            } catch (IllegalArgumentException e) {
                throw new AppException("Trạng thái không hợp lệ: " + newStatus, 400);
            }
        }

        if (paymentStatus != null) {
            booking.paymentStatus = paymentStatus;
        }

        bookingRepository.persist(booking);

        /* TẠM ẨN: Cập nhật trạng thái phòng dựa trên booking status
        updateRoomAvailabilityForBooking(booking);
        */

        return bookingMapper.toResponse(booking);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private Booking findBookingOrThrow(Long id) {
        return bookingRepository.findByIdOptional(id)
                .orElseThrow(() -> new AppException("Đơn đặt phòng không tồn tại", 404));
    }


    /**
     * Validate voucher và trừ số lượng (trong cùng transaction)
     */
    @Transactional
    public Voucher validateAndConsumeVoucher(String code, double subtotal) {
        Voucher v = voucherRepository.findByCode(code)
                .orElseThrow(() -> new AppException("Mã voucher không hợp lệ", 400));

        if (!v.status)
            throw new AppException("Voucher không còn hiệu lực", 400);
        if (v.quantity <= 0)
            throw new AppException("Voucher đã hết lượt sử dụng", 400);
        if (v.expiryDate.isBefore(LocalDate.now()))
            throw new AppException("Voucher đã hết hạn", 400);
        if (subtotal < v.minOrderValue)
            throw new AppException(
                String.format("Đơn hàng tối thiểu %.0f VNĐ mới được dùng voucher này", v.minOrderValue),
                400
            );

        v.quantity--;
        voucherRepository.persist(v);
        return v;
    }

    /**
     * Quy tắc chuyển trạng thái
     */
    private void validateStatusTransition(Booking booking,
                                          Booking.BookingStatus next) {
        Booking.BookingStatus current = booking.status;
        if (current == next) return; 
        boolean valid = switch (current) {
            case PENDING    -> next == Booking.BookingStatus.CONFIRMED
                            || next == Booking.BookingStatus.CANCELLED;
            case CONFIRMED  -> next == Booking.BookingStatus.CHECKED_IN
                            || next == Booking.BookingStatus.CANCELLED
                            || next == Booking.BookingStatus.COMPLETED;
            case CHECKED_IN -> next == Booking.BookingStatus.COMPLETED
                            || next == Booking.BookingStatus.CANCELLED;
            default         -> false;
        };
        if (!valid)
            throw new AppException(
                "Không thể chuyển từ " + current + " sang " + next, 400
            );

        LocalDate today = LocalDate.now();
        if (current == Booking.BookingStatus.CONFIRMED && next == Booking.BookingStatus.CHECKED_IN) {
            if (today.isBefore(booking.checkInDate)) {
                throw new AppException("Chỉ được chuyển sang trạng thái CHECKED_IN kể từ ngày nhận phòng (" + booking.checkInDate + ")", 400);
            }
        }

        if (current == Booking.BookingStatus.CHECKED_IN && next == Booking.BookingStatus.COMPLETED) {
            if (today.isBefore(booking.checkOutDate)) {
                throw new AppException("Chỉ được chuyển sang trạng thái COMPLETED kể từ ngày trả phòng (" + booking.checkOutDate + ")", 400);
            }
        }
    }
    private BookingResponse mapToEnrichedResponse(Booking booking) {
        // Map dữ liệu cơ bản
        BookingResponse response = bookingMapper.toResponse(booking);
        
        // Gọi sang user_service lấy thông tin khách
        try {
            var user = userServiceClient.getUserById(booking.userId);
            if (user != null) {
                response.customerName = user.fullName; // Sửa lại đúng tên biến DTO của bạn
                response.customerEmail = user.email;
                response.customerPhone = user.phone;
            }
        } catch (Exception e) {
            System.err.println("Không lấy được user cho booking: " + booking.id);
        }

        // Gọi sang room_service lấy thông tin phòng
        try {
            var room = roomServiceClient.getRoomById(booking.roomId);
            if (room != null) {
                response.roomName = room.roomNumber; // Sửa lại đúng tên biến DTO của bạn
            }
        } catch (Exception e) {
            System.err.println("Không lấy được room cho booking: " + booking.id);
        }

        return response;
    }
}
package com.example.mapper;

import com.example.dto.response.BookingResponse;
import com.example.entity.mysql.Booking;
import com.example.entity.mysql.BookingServiceItem;
import com.example.entity.mysql.Voucher; 
import com.example.repository.mysql.BookingServiceItemRepository;
import com.example.repository.mysql.VoucherRepository; 
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class BookingMapper {

    @Inject BookingServiceItemRepository bookingServiceItemRepository;
    @Inject VoucherRepository voucherRepository;

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) return null;
        BookingResponse res = new BookingResponse();
        res.id               = booking.id;
        res.userId           = booking.userId; 
        res.roomId           = booking.roomId;
        res.checkInDate      = booking.checkInDate;
        res.checkOutDate     = booking.checkOutDate;
        res.totalRoomPrice   = booking.totalRoomPrice;
        res.totalServicePrice= booking.totalServicePrice;
        res.discountAmount   = booking.discountAmount;
        res.totalPrice       = booking.totalPrice;
        res.status           = booking.status.name();
        res.paymentStatus    = booking.paymentStatus;
        res.createdAt        = booking.createdAt;

        // TÌM VOUCHER BẰNG VOUCHER_ID (NẾU CÓ)
        if (booking.voucherId != null) {
            Voucher voucher = voucherRepository.findById(booking.voucherId);
            if (voucher != null) {
                res.voucherCode = voucher.code;
            }
        }

        // Map Services
        List<BookingServiceItem> items = bookingServiceItemRepository.find("booking", booking).list();
        res.services = items.stream().map(item -> {
            BookingResponse.ServiceItemResponse sr = new BookingResponse.ServiceItemResponse();
            sr.quantity = item.quantity;
            sr.price = item.priceAtBooking;
            sr.numberOfPeople = item.numberOfPeople;
            sr.numberOfDays = item.numberOfDays;
            
            // TẠM ẨN: Việc lấy tên service từ MongoDB sẽ thực hiện qua API gọi sang room-service
            sr.serviceName = "Dịch vụ ID: " + item.serviceId; 
            
            return sr;
        }).collect(Collectors.toList());

        return res;
    }
}
package com.example.dto.request;

import java.time.LocalDate;
import java.util.List;

public class BookingRequest {
    public String roomId;
    public LocalDate checkInDate;
    public LocalDate checkOutDate;
    public String voucherCode;          // nullable
    public List<BookingServiceItemRequest> services;

    // Thông tin liên lạc khách hàng (có thể khác với thông tin Profile)


    public static class BookingServiceItemRequest {
        public String serviceId;
        public Integer quantity;
        public Integer numberOfPeople;
        public Integer numberOfDays;

    }
}
package com.example.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BookingResponse {
    public Long id;
    public Long userId;
    public String roomId;
    public LocalDate checkInDate;
    public LocalDate checkOutDate;
    public Double totalRoomPrice;
    public Double totalServicePrice;
    public Double discountAmount;
    public Double totalPrice;
    public String status;
    public Boolean paymentStatus;
    public LocalDateTime createdAt;

    public String roomNumber;
    public String roomType;
    public String voucherCode;
    
    public String customerName;
    public String customerEmail;
    public String customerPhone;
    public Integer occupancy;
    
    public List<ServiceItemResponse> services;
    public String roomName;

    public static class ServiceItemResponse {
        public String serviceName;
        public Integer quantity;
        public Double price;
        public Integer numberOfPeople;
        public Integer numberOfDays;
    }
}
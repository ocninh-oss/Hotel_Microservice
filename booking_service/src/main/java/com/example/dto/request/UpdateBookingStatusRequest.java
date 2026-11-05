package com.example.dto.request;

public class UpdateBookingStatusRequest {
    public String status;        // CONFIRMED, CANCELLED, COMPLETED
    public Boolean paymentStatus;
}
package com.example.dto.request;

import java.time.LocalDate;

public class UpdateRoomAvailabilityRequest {
    public String roomId;
    public LocalDate date;
    public String status; // AVAILABLE, BOOKED, OCCUPIED, MAINTENANCE
    public Long bookingId; // optional
}
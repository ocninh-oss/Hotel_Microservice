package com.example.entity.mysql;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    // CHỈ LƯU ID - KHÔNG DÙNG @ManyToOne NỮA
    @Column(name = "user_id", nullable = false)
    public Long userId; 

    @Column(name = "room_id", nullable = false)
    public String roomId; 

    @Column(name = "voucher_id") 
    public Long voucherId; 

    @Column(name = "check_in_date", nullable = false)
    public LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    public LocalDate checkOutDate;

    @Column(name = "total_room_price", nullable = false)
    public Double totalRoomPrice;

    @Column(name = "total_service_price", nullable = false)
    public Double totalServicePrice;

    @Column(name = "discount_amount")
    public Double discountAmount = 0.0;

    @Column(name = "total_price", nullable = false)
    public Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "payment_status", nullable = false)
    public Boolean paymentStatus = false;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum BookingStatus {
        PENDING, CONFIRMED, CHECKED_IN, CANCELLED, COMPLETED
    }
}
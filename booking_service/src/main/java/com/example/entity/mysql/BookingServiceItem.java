package com.example.entity.mysql;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "booking_services")
public class BookingServiceItem extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id; // Khóa chính

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false) // Đơn đặt phòng
    public Booking booking;

    @Column(name = "service_id", nullable = false)
    public String serviceId; // MongoDB ObjectId

    @Column(nullable = false)
    public Integer quantity; // Số lượng

    @Column(name = "num_people") // Số người
    public Integer numberOfPeople;

    @Column(name = "num_days") // Số ngày
    public Integer numberOfDays;

    @Column(name = "price_at_booking", nullable = false) // Lưu giá tại thời điểm đặt
    public Double priceAtBooking;
}
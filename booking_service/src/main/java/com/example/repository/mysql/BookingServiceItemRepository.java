package com.example.repository.mysql;

import com.example.entity.mysql.BookingServiceItem;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class BookingServiceItemRepository implements PanacheRepository<BookingServiceItem> {
    public List<BookingServiceItem> findByBookingId(Long bookingId) {
        return find("booking.id", bookingId).list();
    }
}
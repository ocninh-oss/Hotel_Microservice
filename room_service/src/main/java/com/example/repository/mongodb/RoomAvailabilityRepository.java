package com.example.repository.mongodb;

import com.example.entity.mongodb.RoomAvailability;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class RoomAvailabilityRepository implements PanacheMongoRepository<RoomAvailability> {

    /** Kiểm tra phòng có trống trong khoảng ngày không */
    public boolean isRoomAvailable(String roomId, LocalDate checkIn, LocalDate checkOut) {
        System.err.println(">>> [FIX_AVAILABILITY] Checking Room: " + roomId + " | " + checkIn + " -> " + checkOut);

        // Sử dụng MongoDB Filters API
        org.bson.conversions.Bson filter = com.mongodb.client.model.Filters.and(
            com.mongodb.client.model.Filters.eq("roomId", roomId),
            com.mongodb.client.model.Filters.gte("date", checkIn),
            com.mongodb.client.model.Filters.lt("date", checkOut),
            com.mongodb.client.model.Filters.ne("status", "AVAILABLE")
        );

        long conflictCount = mongoCollection().countDocuments(filter);
        
        System.err.println(">>> [FIX_AVAILABILITY] Conflict count: " + conflictCount);

        if (conflictCount > 0) {
            mongoCollection().find(filter).forEach(c -> {
                System.err.println(">>> [FIX_CONFLICT_DETAIL] Found occupied day: " + c.date + " (Status: " + c.status + ")");
            });
        }

        return conflictCount == 0;
    }

    /** Lấy trạng thái phòng theo ngày */
    public String getRoomStatus(String roomId, LocalDate date) {
        RoomAvailability ra = find("roomId = ?1 AND date = ?2", roomId, date).firstResult();
        return ra != null ? ra.status : "AVAILABLE";
    }

    /** Cập nhật trạng thái phòng cho một ngày */
    public void updateRoomStatus(String roomId, LocalDate date, String status, Long bookingId) {
        RoomAvailability ra = find("roomId = ?1 AND date = ?2", roomId, date).firstResult();
        if (ra == null) {
            ra = new RoomAvailability();
            ra.roomId = roomId;
            ra.date = date;
        }
        ra.status = status;
        ra.bookingId = bookingId;
        persistOrUpdate(ra);
    }

    /** Cập nhật trạng thái cho khoảng ngày (chỉ tính các đêm ở, không tính ngày checkout) */
    public void updateRoomStatusRange(String roomId, LocalDate checkIn, LocalDate checkOut, String status, Long bookingId) {
        LocalDate current = checkIn;
        while (current.isBefore(checkOut)) {
            updateRoomStatus(roomId, current, status, bookingId);
            current = current.plusDays(1);
        }
    }
}
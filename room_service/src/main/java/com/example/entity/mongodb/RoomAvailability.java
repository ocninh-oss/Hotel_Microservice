package com.example.entity.mongodb;

import java.time.LocalDate;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "room_availabilities")
public class RoomAvailability extends PanacheMongoEntityBase {

    public ObjectId id;

    public String roomId; // FK sang rooms._id (MongoDB Room)

    public LocalDate date; // Ngày cụ thể

    public String status; // AVAILABLE, BOOKED, OCCUPIED, MAINTENANCE
    // trong RoomAvailabilityReposity.java đang mặc định ngầm nếu không thấy bản ghi là available
    public Long bookingId; // ID đơn đặt phòng (nếu có)
}
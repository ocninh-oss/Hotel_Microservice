package com.example.entity.mongodb;

import java.util.List;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "rooms")
public class Room extends PanacheMongoEntityBase {

    public ObjectId id;

    public String roomNumber;   // Ví dụ: "P.302"

    public RoomType type;

    public enum RoomType {
        STANDARD, DELUXE, SUITE, PRESIDENTIAL
    }

    public Double basePrice;    // Giá mỗi đêm

    public String address; // Địa chỉ phòng

    public String description; // Mô tả phòng

    public List<String> amenities; // Tiện nghi

    public List<String> images; // Danh sách URL ảnh

    public Integer maxOccupancy; // Số người tối đa
}
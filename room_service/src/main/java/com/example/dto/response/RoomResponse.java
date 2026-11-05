package com.example.dto.response;

import com.example.entity.mongodb.Room;
import java.util.List;

public class RoomResponse {
    public String id;
    public String roomNumber;
    public String type;
    public Double basePrice;
    public String address;
    public String description;
    public List<String> amenities;
    public List<String> images;
    public Integer maxOccupancy;

    public static RoomResponse from(Room r) {
        RoomResponse res = new RoomResponse();
        res.id = (r.id != null) ? r.id.toHexString() : null;
        res.roomNumber = r.roomNumber;
        res.type = (r.type != null) ? r.type.name() : null; 
        res.basePrice = r.basePrice;
        res.address = r.address;
        res.description = r.description;
        res.amenities = r.amenities;
        res.images = r.images;
        res.maxOccupancy = r.maxOccupancy;
        return res;
    }
}
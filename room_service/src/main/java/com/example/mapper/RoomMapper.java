package com.example.mapper;

import com.example.dto.request.CreateRoomRequest;
import com.example.dto.response.RoomResponse;
import com.example.entity.mongodb.Room;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoomMapper {

    public RoomResponse toResponse(Room room) {
        if (room == null) return null;
        RoomResponse res = new RoomResponse();
        res.id           = room.id.toHexString();
        res.roomNumber   = room.roomNumber;
        res.type         = room.type.name();
        res.basePrice    = room.basePrice;
        res.address      = room.address;
        res.description  = room.description;
        res.amenities    = room.amenities;
        res.images       = room.images;
        res.maxOccupancy = room.maxOccupancy;
        return res;
    }

    public Room toEntity(CreateRoomRequest req) {
        if (req == null) return null;
        Room room = new Room();
        room.roomNumber   = req.roomNumber;
        if (req.type != null) {
            room.type = Room.RoomType.valueOf(req.type.toUpperCase());
        }
        room.basePrice    = req.basePrice;
        room.address      = req.address;
        room.description  = req.description;
        room.amenities    = req.amenities;
        room.images       = req.images;
        room.maxOccupancy = req.maxOccupancy;
        return room;
    }

    public void updateEntity(Room room, CreateRoomRequest req) {
        if (room == null || req == null) return;
        room.roomNumber   = req.roomNumber;
        if (req.type != null) {
            room.type = Room.RoomType.valueOf(req.type.toUpperCase());
        }
        room.basePrice    = req.basePrice;
        room.address      = req.address;
        room.description  = req.description;
        room.amenities    = req.amenities;
        room.images       = req.images;
        room.maxOccupancy = req.maxOccupancy;
    }
}
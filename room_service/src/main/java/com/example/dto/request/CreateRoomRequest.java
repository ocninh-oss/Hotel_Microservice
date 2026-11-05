package com.example.dto.request;

import java.util.List;

public class CreateRoomRequest {
    public String roomNumber;
    public String type;
    public Double basePrice;
    public String address;
    public String description;
    public List<String> amenities;
    public List<String> images;
    public Integer maxOccupancy;
}
package com.example.controllers;

import java.util.List;

import com.example.dto.response.ServiceResponse;
import com.example.services.HotelServiceService;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/services")
@Produces(MediaType.APPLICATION_JSON)
public class ServiceController {

    @Inject
    HotelServiceService hotelServiceService;

    @GET
    public List<ServiceResponse> getAllServices() {
        // Trả về toàn bộ dịch vụ (bao gồm cả dịch vụ đã ngừng cung cấp)
        return hotelServiceService.getAll();
    }

    @GET
    @Path("/available")
    public List<ServiceResponse> getAvailableServices() {
        // Chỉ trả về các dịch vụ đang sẵn sàng (isAvailable = true)
        return hotelServiceService.getAvailable();
    }
}
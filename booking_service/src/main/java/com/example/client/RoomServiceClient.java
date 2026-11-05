package com.example.client;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import java.time.LocalDate;

@Path("/rooms")
@RegisterRestClient(configKey = "room-service") // <-- QUAN TRỌNG: Phải có dòng này
public interface RoomServiceClient {

    @GET
    @Path("/{id}")
    com.example.dto.response.RoomDto getRoomById(@PathParam("id") String id);

    // BỔ SUNG HÀM NÀY VÀO ĐÂY:
    @GET
    @Path("/{id}/check-availability")
    boolean checkAvailability(
        @PathParam("id") String id, 
        @QueryParam("checkIn") LocalDate checkIn, 
        @QueryParam("checkOut") LocalDate checkOut
    );
    @POST
    @Path("/{id}/lock")
    void lockRoomDates(
        @PathParam("id") String id,
        @QueryParam("checkIn") LocalDate checkIn,
        @QueryParam("checkOut") LocalDate checkOut,
        @QueryParam("bookingId") Long bookingId
    );
}
package com.example.controllers;

import com.example.dto.request.BookingRequest;
import com.example.dto.request.UpdateBookingStatusRequest;
import com.example.dto.response.BookingResponse;
import com.example.services.BookingService;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/bookings")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"USER","CUSTOMER", "ADMIN"})
public class BookingController {

    @Inject BookingService bookingService;
    @Inject JsonWebToken jwt; 

    private Long getCurrentUserId() {
        return Long.parseLong(jwt.getSubject());
    }

   @POST // đặt phòng
    @RolesAllowed({"USER", "CUSTOMER", "ADMIN"}) // <-- ĐỔI THÀNH DÒNG NÀY
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createBooking(BookingRequest req) {
        // Lấy ID thật của user đang đăng nhập từ JWT Token
        Long userId = getCurrentUserId();
        
        // (Tùy chọn) In log ra terminal để bạn dễ theo dõi request
        System.out.println(">>> [POST /bookings] RoomId: " + req.roomId + " by UserId: " + userId);
        
        return Response.status(201).entity(bookingService.createBooking(userId, req)).build();
    }

    
    @GET // xem lịch sử đặt phòng (Khách xem của khách, Admin xem tất cả)
    public Response getBookings() {
        if (jwt.getGroups() != null && jwt.getGroups().contains("ADMIN")) {
            return Response.ok(bookingService.getAllBookings()).build();
        }
        return Response.ok(bookingService.getMyBookings(getCurrentUserId())).build();
    }

    @PUT @Path("/{id}/cancel") // huỷ đặt phòng
    public Response cancelBooking(@PathParam("id") Long id) {
        return Response.ok(bookingService.cancelBooking(id, getCurrentUserId())).build();
    }
    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBookingStatus(@PathParam("id") Long id, UpdateBookingStatusRequest req) {
        if (req == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Dữ liệu không hợp lệ").build();
        }
        
        // Gọi hàm xử lý trong bookingService
        BookingResponse updated = bookingService.updateBookingStatus(id, req.status, req.paymentStatus);
        return Response.ok(updated).build();
    }
}
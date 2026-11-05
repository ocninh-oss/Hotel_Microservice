package com.example.controllers;

import com.example.entity.mysql.User;
import com.example.services.UserService;
import com.example.dto.request.UpdateProfileRequest;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/profile")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({ "USER", "ADMIN", "CUSTOMER" }) // Chỉ CUSTOMER và ADMIN được truy cập
public class UserController {

    @Inject UserService userService; // Inject UserService
    @Inject User currentUser; // Inject User (tức là user đăng nhập)

    @GET
    public Response getProfile() { // Lấy thông tin cá nhân
        return Response.ok(userService.getProfile(currentUser)).build(); // Trả về thông tin cá nhân
    }

    @PUT
    public Response updateProfile(UpdateProfileRequest req) {
        return Response.ok(userService.updateProfile(currentUser, req)).build();
    }
}
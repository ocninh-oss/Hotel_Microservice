package com.example.controllers;

import com.example.dto.request.LoginRequest;
import com.example.dto.request.RegisterRequest;
import com.example.services.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON) // API trả về JSON
@Consumes(MediaType.APPLICATION_JSON) // API nhận JSON
public class AuthController {

    @Inject AuthService authService; // controller không xử lý logic nghiệp vụ
                                       // mà chỉ gọi sang AuthService để xử lý

    @POST @Path("/register")
    @PermitAll // Cho phép tất cả ai cũng vào được
    public Response register(RegisterRequest req) { // req là dữ liệu nhận từ FE
        return Response.status(201).entity(authService.register(req)).build();
    }

    @POST @Path("/login")
    @PermitAll
    public Response login(LoginRequest req) {
        return Response.ok(authService.login(req)).build();
    }

    @POST @Path("/logout") // chỉ cần xóa token là logout được
    @PermitAll
    public Response logout() { // Logout thực chất là không làm gì cả
        return Response.ok(Map.of("message", "Đăng xuất thành công", "status", "success")).build(); // chỉ đơn giản trả về message là logout thành công
    }// việc xoá sẽ xử lý ở Frontend 
}
package com.example.exceptions;

import java.util.Map;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AppExceptionMapper implements ExceptionMapper<AppException> {
    @Override
    public Response toResponse(AppException e) {
        // In lỗi ra terminal để developer theo dõi
        System.err.println(">>> [AppException] Status: " + e.getStatusCode() + " - Message: " + e.getMessage());

        // Trả về mã lỗi (400, 404, 409...) và thông báo cụ thể cho Frontend
        return Response.status(e.getStatusCode())
                .entity(Map.of("message", e.getMessage()))
                .build();
    }
}

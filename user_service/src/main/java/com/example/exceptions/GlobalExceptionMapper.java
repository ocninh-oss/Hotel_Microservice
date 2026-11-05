package com.example.exceptions;

import java.util.Map;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {
    @Override
    public Response toResponse(Exception e) {
        // In toàn bộ lỗi ra console Backend để debug
        e.printStackTrace();
        
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of(
                    "error", "Lỗi hệ thống: " + e.getMessage(),
                    "type", e.getClass().getSimpleName()
                ))
                .build();
    }
}
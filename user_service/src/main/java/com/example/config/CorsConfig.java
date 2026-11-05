package com.example.config;

import java.io.IOException;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsConfig implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext request, ContainerResponseContext response) throws IOException {
        String origin = request.getHeaderString("Origin");
        if (origin == null || origin.isBlank()) {
            origin = "*";
        }
        response.getHeaders().putSingle("Access-Control-Allow-Origin", origin); // Cho phép Origin cụ thể hoặc tất cả
        response.getHeaders().putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH"); // Các phương thức được phép
        response.getHeaders().putSingle("Access-Control-Allow-Headers","Content-Type, Authorization, Accept, Origin, X-Requested-With"); // Các header được phép
        response.getHeaders().putSingle("Access-Control-Allow-Credentials", "true"); // Cho phép gửi credentials
        response.getHeaders().putSingle("Access-Control-Max-Age", "3600"); // Cache cho preflight requests
    }
}
//Cấu hình kết nối Frontend
//File này cực kỳ quan trọng để Frontend (React) có thể gọi được API từ Backend
//Nếu không có nó, trình duyệt sẽ báo lỗi CORS và ngăn React truy cập dữ liệu từ Java
//Chức năng: Xử lý vấn đề "CORS" (Cross-Origin Resource Sharing). 
// - Theo mặc định, trình duyệt sẽ chặn các yêu cầu từ một tên miền này (ví dụ localhost:5173 của React) sang tên miền khác (localhost:8080 của Quarkus).
// Chi tiết: Nó thêm các tiêu đề (Headers) vào phản hồi API để báo cho trình duyệt biết rằng: 
// - "Tôi cho phép các phương thức GET, POST, PUT, DELETE... và chấp nhận mã Token (Authorization) từ bên ngoài gửi vào"
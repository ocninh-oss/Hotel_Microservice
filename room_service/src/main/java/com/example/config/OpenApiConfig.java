package com.example.config;

import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeIn;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;
import jakarta.ws.rs.core.Application;

@OpenAPIDefinition(//Đây là "vỏ bọc" bên ngoài, chứa các thông tin chung nhất về dự án của bạn.
    info = @Info(
        title       = "Hotel 22 API",
        version     = "1.0.0",
        description = "Hệ thống quản lý khách sạn – Nhóm 22",
        contact     = @Contact(name = "Nhóm 22")
    ),
    security = @SecurityRequirement(name = "BearerAuth") // Bắt buộc phải có Token để truy cập API
)
@SecurityScheme( // Định nghĩa cách xác thực JWT
    securitySchemeName = "BearerAuth", // Tên của SecurityScheme
    type               = SecuritySchemeType.HTTP, // Loại xác thực
    scheme             = "bearer", // Loại scheme
    bearerFormat       = "JWT", // Định dạng token
    in                 = SecuritySchemeIn.HEADER // Vị trí của token khi gửi request
)
public class OpenApiConfig extends Application { }

// Cấu hình tài liệu API
// File này giúp Quarkus tự động tạo ra tài liệu API chuẩn Swagger/OpenAPI
// Khi chạy ứng dụng, bạn có thể truy cập vào http://localhost:8080/q/openapi để xem tài liệu
// Nó hiển thị chi tiết các API, tham số, định dạng dữ liệu, và cách xác thực (JWT)

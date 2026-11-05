package com.example.security;

import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.repository.mysql.UserRepository;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

@RequestScoped
public class CurrentUserProducer {

    @Inject
    JsonWebToken jwt; // dùng để lấy thông tin từ JWT token

    @Inject
    UserRepository userRepository; // dùng để lấy user từ DB

    @Produces // sản xuất ra User
    // Không dùng @RequestScoped ở đây để tránh tạo Proxy (giúp Hibernate nhận diện đúng Entity)
    public User getCurrentUser() { // phương thức này sẽ được gọi khi cần lấy user
        System.out.println(">>> [CurrentUserProducer] JWT raw: " + jwt.getRawToken());
        System.out.println(">>> [CurrentUserProducer] JWT claims: " + jwt.getClaimNames());
        
        String email = jwt.getClaim("upn"); // Lấy email từ JWT token
        if (email == null || email.isBlank()) { // Nếu email không có
            email = jwt.getName(); // fallback
        }
        
        System.out.println(">>> [CurrentUserProducer] Extracted Email: " + email);

        if (email == null || email.isBlank()) { // Nếu email không có
            throw new AppException("JWT token không chứa thông tin email", 401); // ném ra lỗi
        }

        final String finalEmail = email; // vì 
        User user = userRepository.find("email", finalEmail)
                .firstResultOptional()
                .orElseThrow(() -> new AppException("Người dùng không tồn tại với email: " + finalEmail, 404));

        if (user.id == null) {
            throw new AppException("User ID không hợp lệ", 500);
        }

        return user;
    }
}
// Đây là "trạm kiểm soát" tự động, biến một chuỗi ký tự Token vô hồn thành 
// một đối tượng User đầy đủ thông tin để bạn sử dụng trong toàn bộ dự án.
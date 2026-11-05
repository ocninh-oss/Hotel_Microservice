package com.example.services;

import com.example.dto.request.LoginRequest;
import com.example.dto.request.RegisterRequest;
import com.example.dto.response.AuthResponse;
import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.mapper.UserMapper;
import com.example.repository.mysql.UserRepository;
import com.example.security.JwtService;
import com.example.utils.ValidationUtils;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService {

    @Inject UserRepository userRepository; // dùng để truy vấn CSDL MYSQL (User)
    @Inject JwtService     jwtService; // dùng để tạo JWT
    @Inject UserMapper     userMapper; // dùng để convert User sang DTO (response)

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        // 1. Validate input theo đúng rule tài liệu
        ValidationUtils.validateRegisterInput(
                req.username, req.password, req.fullName, req.email, req.phone
        );

        // 2. Kiểm tra trùng
        if (userRepository.existsByEmail(req.email))
            throw new AppException("Email đã được sử dụng", 409);
        if (userRepository.existsByPhone(req.phone))
            throw new AppException("Số điện thoại đã được sử dụng", 409);

        // 3. Tạo user
        User user = new User();
        user.username = req.username;
        user.fullName = req.fullName;
        user.email    = req.email;
        user.phone    = req.phone;
        user.password = BcryptUtil.bcryptHash(req.password);
        user.status   = true;
        // Người đầu tiên đăng ký → ADMIN
        user.role = (userRepository.count() == 0)
                ? User.Role.ADMIN
                : User.Role.CUSTOMER;

        userRepository.persist(user);// Lưu vào CSDL MYSQL

        String token = jwtService.generateToken(user);// trả về token 
        return new AuthResponse(token, user.email, user.role.name(), user.fullName, user.phone, user.username);
    }

    public AuthResponse login(LoginRequest req) {
        // 1. Validate input
        ValidationUtils.validateEmail(req.email); // Validate email
        if (req.password == null || req.password.isBlank())
            throw new AppException("Mật khẩu không được để trống", 400);// Validate mật khẩu

        // 2. Tìm user
        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new AppException("Email hoặc mật khẩu không đúng", 401));

        // 3. Kiểm tra trạng thái tài khoản
        if (!user.status)
            throw new AppException("Tài khoản của bạn đã bị khóa, vui lòng liên hệ Admin", 403);

        // 4. Kiểm tra mật khẩu
        if (!BcryptUtil.matches(req.password, user.password))
            throw new AppException("Email hoặc mật khẩu không đúng", 401);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.email, user.role.name(), user.fullName, user.phone, user.username);
    }
}
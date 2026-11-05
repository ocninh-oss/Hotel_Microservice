package com.example.utils;

import java.util.regex.Pattern;

import com.example.exceptions.AppException;

/**
 * Validate dữ liệu đầu vào theo đúng rule trong tài liệu
 */
public class ValidationUtils {

    // Mật khẩu: >= 6 ký tự, ít nhất 1 ký tự đặc biệt
    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{6,}$");

    // Số điện thoại: đúng 10 số
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^\\d{10}$");

    // Email cơ bản
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    public static void validatePassword(String password) {
        if (password == null || password.isBlank())
            throw new AppException("Mật khẩu không được để trống", 400);
        if (!PASSWORD_PATTERN.matcher(password).matches())
            throw new AppException("Mật khẩu phải có ít nhất 6 ký tự và 1 ký tự đặc biệt", 400);
    }

    public static void validatePhone(String phone) {
        if (phone == null || phone.isBlank())
            throw new AppException("Số điện thoại không được để trống", 400);
        if (!PHONE_PATTERN.matcher(phone).matches())
            throw new AppException("Số điện thoại phải đúng 10 số", 400);
    }

    public static void validateEmail(String email) {
        if (email == null || email.isBlank())
            throw new AppException("Email không được để trống", 400);
        if (!EMAIL_PATTERN.matcher(email).matches())
            throw new AppException("Email không hợp lệ", 400);
    }

    public static void validateFullName(String fullName) {
        if (fullName == null || fullName.isBlank())
            throw new AppException("Tên không được để trống", 400);
    }

    public static void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5)
            throw new AppException("Số sao phải từ 1 đến 5", 400);
    }

    /** Gọi tổng hợp khi đăng ký */
    public static void validateRegisterInput(String username, String password,
                                              String fullName, String email,
                                              String phone) {
        if (username == null || username.isBlank())
            throw new AppException("Username không được để trống", 400);
        validateFullName(fullName);
        validateEmail(email);
        validatePassword(password);
        validatePhone(phone);
    }
}
package com.example.dto.response;

import com.example.entity.mysql.User;
import java.time.LocalDateTime;

public class UserResponse {
    public Long id;
    public String username;
    public String fullName;
    public String email;
    public String role;
    public String phone;
    public Boolean status;
    public LocalDateTime createdAt;
}
package com.example.mapper;

import com.example.dto.response.UserResponse;
import com.example.entity.mysql.User;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) return null;
        UserResponse res = new UserResponse();
        res.id        = user.id;
        res.username  = user.username;
        res.fullName  = user.fullName;
        res.email     = user.email;
        res.role      = user.role.name();
        res.phone     = user.phone;
        res.status    = user.status;
        res.createdAt = user.createdAt;
        return res;
    }
}
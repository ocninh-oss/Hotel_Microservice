package com.example.dto.response;

public class AuthResponse {
    public String token;
    public String email;
    public String role;
    public String fullName;
    public String phone;
    public String username;

    public AuthResponse(String token, String email, String role, String fullName, String phone, String username) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.phone = phone;
        this.username = username;
    }
}
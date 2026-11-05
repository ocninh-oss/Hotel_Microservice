package com.example.entity.mysql;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id; // Khóa chính, tự động tăng
    
    public Long getId() { return id; }
    public String getEmail() { return email; }

    @Column(nullable = false)
    public String username; // Tên đăng nhập

    @Column(nullable = false)
    public String password; // Bcrypt

    @Column(name = "full_name", nullable = false)
    public String fullName; // Họ và tên

    @Column(nullable = false, unique = true)
    public String email; // Email

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Role role; // Vai trò

    @Column(length = 10, unique = true, nullable = false)
    public String phone; // Số điện thoại

    @Column(name = "created_at")
    public LocalDateTime createdAt; // Ngày tạo

    @Column(nullable = false)
    public Boolean status = true; // Trạng thái

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now(); // Ngày tạo
    }

    public enum Role {
        ADMIN, // Quản trị viên
        CUSTOMER // Khách hàng
    }
}
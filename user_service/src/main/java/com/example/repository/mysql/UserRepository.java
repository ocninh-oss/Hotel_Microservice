package com.example.repository.mysql;

import java.util.Optional;

import com.example.entity.mysql.User;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {
    public Optional<User> findByEmail(String email) { 
        return find("email", email).firstResultOptional();
    }
    public boolean existsByEmail(String email) {
        return count("email", email) > 0;
    }
    public boolean existsByUsername(String username) {
        return count("username", username) > 0;
    }
    public boolean existsByPhone(String phone) {
        return count("phone", phone) > 0;
    }
}
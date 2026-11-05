package com.example.security;

import com.example.entity.mysql.User;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class JwtService {

    public String generateToken(User user) {
        return Jwt.upn(user.email)
                .subject(String.valueOf(user.id))
                .groups(Set.of(user.role.name()))
                .issuer("https://example.com/hotel22")
                .expiresIn(Duration.ofHours(24))
                .sign();
    }
}


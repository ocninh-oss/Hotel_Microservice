package com.example.repository.mongodb;

import com.example.entity.mongodb.News;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NewsRepository implements PanacheMongoRepository<News> {
    // Logic đơn giản hóa, chỉ sử dụng các hàm mặc định của Panache
}
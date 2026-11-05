package com.example.entity.mongodb;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "news")
public class News extends PanacheMongoEntityBase {

    public ObjectId id; // ObjectId

    public String title; // Tiêu đề

    public String thumbnail; // URL ảnh đại diện
    public String content; // Nội dung chi tiết

    public LocalDateTime createdAt; // Thời gian tạo

    public LocalDateTime expiryDate; // Thời gian tự biến mất (Hết hạn)
}

package com.example.mapper;

import com.example.dto.request.CreateNewsRequest;
import com.example.dto.response.NewsResponse;
import com.example.entity.mongodb.News;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDateTime;

@ApplicationScoped
public class NewsMapper {

    public NewsResponse toResponse(News n) {
        if (n == null) return null;
        NewsResponse res = new NewsResponse();
        res.id          = (n.id != null) ? n.id.toHexString() : null;
        res.title       = n.title;
        res.thumbnail   = n.thumbnail;
        res.content     = n.content;
        res.createdAt   = n.createdAt;
        res.expiryDate  = n.expiryDate;
        return res;
    }

    public News toEntity(CreateNewsRequest req) {
        News n = new News();
        n.title       = req.title;
        n.thumbnail   = req.thumbnail;
        n.content     = req.content;
        n.createdAt   = LocalDateTime.now();
        n.expiryDate  = req.expiryDate;
        return n;
    }

    public void updateEntity(News n, CreateNewsRequest req) {
        n.title       = req.title;
        n.thumbnail   = req.thumbnail;
        n.content     = req.content;
        n.expiryDate  = req.expiryDate;
    }
}
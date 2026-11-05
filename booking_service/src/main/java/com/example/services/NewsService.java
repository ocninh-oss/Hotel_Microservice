package com.example.services;

import com.example.dto.request.CreateNewsRequest;
import com.example.dto.response.NewsResponse;
import com.example.entity.mongodb.News;
import com.example.exceptions.AppException;
import com.example.mapper.NewsMapper;
import com.example.repository.mongodb.NewsRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class NewsService {

    @Inject NewsRepository newsRepository;
    @Inject NewsMapper     newsMapper;

    public List<NewsResponse> getAll() {
        return newsRepository.listAll()
                .stream()
                .map(newsMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getPublished() {
        return getAll(); // Logic đơn giản hóa: Tất cả tin đều hiển thị
    }

    public NewsResponse getAdminById(String id) {
        return newsMapper.toResponse(findByIdOrThrow(id));
    }

    public NewsResponse create(CreateNewsRequest req) {
        validateNewsRequest(req);
        News news = newsMapper.toEntity(req);
        newsRepository.persist(news);
        return newsMapper.toResponse(news);
    }

    public NewsResponse update(String id, CreateNewsRequest req) {
        validateNewsRequest(req);
        News news = findByIdOrThrow(id);
        newsMapper.updateEntity(news, req);
        newsRepository.update(news);
        return newsMapper.toResponse(news);
    }

    public void delete(String id) {
        News news = findByIdOrThrow(id);
        newsRepository.delete(news);
    }

    private News findByIdOrThrow(String id) {
        try {
            return newsRepository.findByIdOptional(new ObjectId(id))
                    .orElseThrow(() -> new AppException("Bài viết không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID bài viết không hợp lệ", 400);
        }
    }

    private void validateNewsRequest(CreateNewsRequest req) {
        if (req.title == null || req.title.isBlank())
            throw new AppException("Tiêu đề bài viết không được để trống", 400);
    }
}
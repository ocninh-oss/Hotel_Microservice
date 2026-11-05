package com.example.dto.request;

import java.time.LocalDateTime;

public class CreateNewsRequest {
    public String title;
    public String thumbnail;
    public String content;
    public LocalDateTime expiryDate;
}
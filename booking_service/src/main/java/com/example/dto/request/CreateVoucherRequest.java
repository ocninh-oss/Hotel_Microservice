package com.example.dto.request;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat; // Nhớ import thư viện này

public class CreateVoucherRequest {
    public String code;
    public Integer discountPercent;
    public Double maxDiscountAmount;
    public Double minOrderValue;
    
    // Báo cho Jackson biết cách đọc chuỗi ngày tháng từ giao diện
    
    public LocalDate expiryDate;
    
    public Integer quantity;
}
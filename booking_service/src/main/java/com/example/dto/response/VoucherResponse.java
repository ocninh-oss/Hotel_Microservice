package com.example.dto.response;

import com.example.entity.mysql.Voucher;
import java.time.LocalDate;

public class VoucherResponse {
    public Long id;
    public String code;
    public Integer discountPercent;
    public Double maxDiscountAmount;
    public Double minOrderValue;
    public LocalDate expiryDate;
    public Integer quantity;
    public Boolean status;
}
package com.example.mapper;

import com.example.dto.request.CreateVoucherRequest;
import com.example.dto.response.VoucherResponse;
import com.example.entity.mysql.Voucher;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class VoucherMapper {

    public VoucherResponse toResponse(Voucher v) {
        if (v == null) return null;
        VoucherResponse res = new VoucherResponse();
        res.id                = v.id;
        res.code              = v.code;
        res.discountPercent   = v.discountPercent;
        res.maxDiscountAmount = v.maxDiscountAmount;
        res.minOrderValue     = v.minOrderValue;
        res.expiryDate        = v.expiryDate;
        res.quantity          = v.quantity;
        res.status            = v.status;
        return res;
    }

    public Voucher toEntity(CreateVoucherRequest req) {
        Voucher v = new Voucher();
        v.code              = req.code;
        v.discountPercent   = req.discountPercent;
        v.maxDiscountAmount = req.maxDiscountAmount;
        v.minOrderValue     = req.minOrderValue;
        v.expiryDate        = req.expiryDate;
        v.quantity          = req.quantity;
        v.status            = true;
        return v;
    }

    public void updateEntity(Voucher v, CreateVoucherRequest req) {
        v.discountPercent   = req.discountPercent;
        v.maxDiscountAmount = req.maxDiscountAmount;
        v.minOrderValue     = req.minOrderValue;
        v.expiryDate        = req.expiryDate;
        v.quantity          = req.quantity;
    }
}
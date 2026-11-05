package com.example.entity.mysql;

import java.time.LocalDate;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vouchers")
public class Voucher extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String code;

    @Column(name = "discount_percent", nullable = false)
    public Integer discountPercent;

    @Column(name = "max_discount_amount", nullable = false)
    public Double maxDiscountAmount;

    @Column(name = "min_order_value", nullable = false)
    public Double minOrderValue;

    @Column(name = "expiry_date", nullable = false)
    public LocalDate expiryDate;

    @Column(nullable = false) 
    public Integer quantity;

    @Column(nullable = false)
    public Boolean status = true;
}
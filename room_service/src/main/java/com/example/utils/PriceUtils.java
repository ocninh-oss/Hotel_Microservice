package com.example.utils;

/**
 * Các tiện ích tính toán giá
 */
public class PriceUtils {

    /**
     * Tính số tiền được giảm từ voucher
     * @param subtotal        Tổng tiền trước giảm
     * @param discountPercent Phần trăm giảm
     * @param maxDiscount     Giảm tối đa
     * @return Số tiền thực tế được giảm
     */
    public static double calcDiscount(double subtotal,
                                       int discountPercent,
                                       double maxDiscount) {
        double discount = subtotal * discountPercent / 100.0;
        return Math.min(discount, maxDiscount);
    }

    /**
     * Tính tổng tiền cuối cùng
     */
    public static double calcTotal(double roomPrice,
                                    double servicePrice,
                                    double discount) {
        return Math.max(0, roomPrice + servicePrice - discount);
    }

    /**
     * Làm tròn tiền đến 2 chữ số thập phân
     */
    public static double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
package com.example.utils;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Các tiện ích xử lý ngày tháng
 */
public class DateUtils {

    /** Tính số đêm giữa checkIn và checkOut */
    public static long countNights(LocalDate checkIn, LocalDate checkOut) {
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights <= 0) throw new IllegalArgumentException("Ngày trả phòng phải sau ngày nhận phòng");
        return nights;
    }

    /** Kiểm tra xem ngày có trong quá khứ không */
    public static boolean isPast(LocalDate date) {
        return date.isBefore(LocalDate.now());
    }

    /** Kiểm tra hai khoảng thời gian có bị chồng nhau không */
    public static boolean isOverlapping(LocalDate start1, LocalDate end1,
                                         LocalDate start2, LocalDate end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }
}
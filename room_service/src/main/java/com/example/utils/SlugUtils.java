package com.example.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Chuyển tiêu đề tiếng Việt thành slug URL thân thiện
 * Ví dụ: "Khách sạn 5 sao Đà Nẵng" → "khach-san-5-sao-da-nang"
 */
public class SlugUtils {

    private static final Pattern NON_ASCII = Pattern.compile("[^\\p{ASCII}]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern NON_SLUG  = Pattern.compile("[^a-z0-9-]");

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "";

        // 1. Normalize unicode (NFD tách dấu ra khỏi ký tự)
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);

        // 2. Xóa dấu
        String withoutAccents = NON_ASCII.matcher(normalized).replaceAll("");

        // 3. Chuyển thường, trim
        String lower = withoutAccents.toLowerCase(Locale.ROOT).trim();

        // 4. Thay khoảng trắng → dấu gạch
        String hyphenated = WHITESPACE.matcher(lower).replaceAll("-");

        // 5. Xóa ký tự không hợp lệ
        return NON_SLUG.matcher(hyphenated).replaceAll("");
    }
}
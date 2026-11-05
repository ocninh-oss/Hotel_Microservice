package com.example.dto.response;

import java.util.List;

public class RoomDeletionCheckResponse {
    public boolean canDelete;                    // true nếu có thể xoá
    public List<Long> activeBookingIds;          // Danh sách booking active
    public String message;                       // Lời nhắc/cảnh báo

    public RoomDeletionCheckResponse(boolean canDelete, List<Long> activeBookingIds, String message) {
        this.canDelete = canDelete;
        this.activeBookingIds = activeBookingIds;
        this.message = message;
    }
}

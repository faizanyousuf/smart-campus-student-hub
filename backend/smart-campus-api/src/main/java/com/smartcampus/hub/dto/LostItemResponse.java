package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.LostItem;

import java.time.LocalDateTime;

public record LostItemResponse(

        Long id,
        String referenceCode,
        String itemName,
        String description,
        String category,
        String location,
        LostItem.LostOrFound lostOrFound,
        LostItem.Status status,
        String imageUrl,
        Long createdById,
        String createdByName,
        LocalDateTime createdAt
) {
}

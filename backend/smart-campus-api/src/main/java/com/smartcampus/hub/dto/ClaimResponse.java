package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Claim;

import java.time.LocalDateTime;

public record ClaimResponse(

        Long id,
        Long itemId,
        String itemReferenceCode,
        String itemName,
        Long claimedById,
        String claimedByName,
        String message,
        Claim.Status status,
        Long handledById,
        String handledByName,
        LocalDateTime createdAt
) {
}

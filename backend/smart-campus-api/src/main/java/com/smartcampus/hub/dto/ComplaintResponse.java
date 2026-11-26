package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Complaint;

import java.time.LocalDateTime;

public record ComplaintResponse(

        Long id,
        String referenceCode,
        String title,
        String description,
        String category,
        Complaint.Status status,
        Long createdById,
        String createdByName,
        Long assignedToId,
        String assignedToName,
        LocalDateTime createdAt
) {
}

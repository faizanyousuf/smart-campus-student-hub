package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Notice;

import java.time.LocalDateTime;

public record NoticeResponse(

        Long id,
        String title,
        String body,
        Notice.Category category,
        boolean pinned,
        Long postedById,
        String postedByName,
        LocalDateTime createdAt
) {
}

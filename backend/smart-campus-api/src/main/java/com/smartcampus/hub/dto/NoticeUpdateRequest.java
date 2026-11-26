package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Notice;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NoticeUpdateRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200)
        String title,

        @NotBlank(message = "Body is required")
        String body,

        @NotNull(message = "Category is required")
        Notice.Category category,

        boolean pinned
) {
}

package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.LostItem;
import jakarta.validation.constraints.NotNull;

public record LostItemStatusRequest(

        @NotNull(message = "Status is required")
        LostItem.Status status
) {
}

package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Claim;
import jakarta.validation.constraints.NotNull;

public record ClaimStatusRequest(

        @NotNull(message = "Status is required")
        Claim.Status status
) {
}

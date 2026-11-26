package com.smartcampus.hub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClaimRequest(

        @NotBlank(message = "Please explain why this item is yours")
        @Size(max = 1000)
        String message
) {
}

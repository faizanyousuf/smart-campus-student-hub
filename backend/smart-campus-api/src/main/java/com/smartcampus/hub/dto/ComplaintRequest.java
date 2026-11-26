package com.smartcampus.hub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ComplaintRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be 200 characters or fewer")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotBlank(message = "Category is required")
        @Size(max = 50, message = "Category must be 50 characters or fewer")
        String category
) {
}

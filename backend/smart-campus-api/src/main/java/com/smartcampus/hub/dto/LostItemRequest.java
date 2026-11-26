package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.LostItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LostItemRequest(

        @NotBlank(message = "Item name is required")
        @Size(max = 200)
        String itemName,

        @NotBlank(message = "Description is required")
        String description,

        @NotBlank(message = "Category is required")
        @Size(max = 50)
        String category,

        @NotBlank(message = "Location is required")
        @Size(max = 200)
        String location,

        @NotNull(message = "Lost or found is required")
        LostItem.LostOrFound lostOrFound,

        @Size(max = 500)
        String imageUrl
) {
}

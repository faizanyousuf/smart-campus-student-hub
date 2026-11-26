package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.Complaint;
import jakarta.validation.constraints.NotNull;

public record ComplaintStatusRequest(

        @NotNull(message = "Status is required")
        Complaint.Status status
) {
}

package com.smartcampus.hub.dto;

public record AuthResponse(

        String token,
        String tokenType,
        Long id,
        String email,
        String role,
        String fullName
) {
}

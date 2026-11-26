package com.smartcampus.hub.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService(
            "this-is-a-long-test-secret-key-for-jwt-signing-1234567890",
            60000
    );

    @Test
    void generatesAndValidatesToken() {
        String token = jwtService.generateToken("student@smartcampus.edu", "STUDENT");

        assertEquals("student@smartcampus.edu", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void rejectsTamperedToken() {
        String token = jwtService.generateToken("student@smartcampus.edu", "STUDENT");
        String tampered = token.substring(0, token.length() - 2) + "xx";

        assertThrows(Exception.class, () -> jwtService.extractUsername(tampered));
    }
}

package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ClaimResponse;
import com.smartcampus.hub.dto.ClaimStatusRequest;
import com.smartcampus.hub.entity.Claim;
import com.smartcampus.hub.service.LostItemService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final LostItemService lostItemService;

    public ClaimController(LostItemService lostItemService) {
        this.lostItemService = lostItemService;
    }

    @GetMapping
    public List<ClaimResponse> all(Authentication authentication,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        boolean manager = authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_STAFF")
                                || authority.getAuthority().equals("ROLE_ADMIN"));

        return manager
                ? lostItemService.findAllClaims()
                : lostItemService.findMyClaims(userDetails.getUsername());
    }

    @PatchMapping("/{id}/decision")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ClaimResponse decide(@PathVariable Long id,
                                @Valid @RequestBody ClaimStatusRequest request,
                                @AuthenticationPrincipal UserDetails userDetails) {
        if (request.status() == Claim.Status.APPROVED) {
            return lostItemService.approve(id, userDetails.getUsername());
        }

        if (request.status() == Claim.Status.REJECTED) {
            return lostItemService.reject(id, userDetails.getUsername());
        }

        throw new IllegalArgumentException("Unsupported claim status: " + request.status());
    }
}

package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ComplaintRequest;
import com.smartcampus.hub.dto.ComplaintResponse;
import com.smartcampus.hub.dto.ComplaintStatusRequest;
import com.smartcampus.hub.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public List<ComplaintResponse> all(Authentication authentication) {
        return complaintService.findAllForPrincipal(authentication);
    }

    @GetMapping("/{id}")
    public ComplaintResponse one(@PathVariable Long id, Authentication authentication) {
        return complaintService.findById(id, authentication);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComplaintResponse create(@AuthenticationPrincipal UserDetails userDetails,
                                    @Valid @RequestBody ComplaintRequest request) {
        return complaintService.create(userDetails.getUsername(), request);
    }

    @PatchMapping("/{id}/assign")
    public ComplaintResponse assign(@PathVariable Long id,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return complaintService.assign(id, userDetails.getUsername());
    }

    @PatchMapping("/{id}/status")
    public ComplaintResponse updateStatus(@PathVariable Long id,
                                          @Valid @RequestBody ComplaintStatusRequest request) {
        return complaintService.updateStatus(id, request);
    }
}

package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.DashboardResponse;
import com.smartcampus.hub.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse get(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getDashboard(userDetails.getUsername());
    }
}

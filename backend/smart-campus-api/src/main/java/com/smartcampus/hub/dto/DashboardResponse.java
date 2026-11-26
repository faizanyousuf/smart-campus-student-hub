package com.smartcampus.hub.dto;

public record DashboardResponse(

        String fullName,
        String role,
        long totalNotices,
        long totalComplaints,
        long openComplaints,
        long totalLostItems,
        long openLostItems,
        long pendingClaims,
        long myComplaints,
        long myClaims,
        long myLostItems
) {
}

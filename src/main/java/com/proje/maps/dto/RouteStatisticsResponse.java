package com.proje.maps.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStatisticsResponse {
    private int totalRoutes;
    private double totalDistance;
    private int totalDuration;
}

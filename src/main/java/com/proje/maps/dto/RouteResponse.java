package com.proje.maps.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteResponse {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private List<WaypointDTO> waypoints;
    private Double distance;
    private Integer duration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.proje.maps.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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

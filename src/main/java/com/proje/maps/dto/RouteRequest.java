package com.proje.maps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteRequest {

    @NotBlank(message = "Route name is required")
    @Size(max = 200, message = "Route name cannot exceed 200 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotEmpty(message = "Waypoints are required")
    private List<WaypointDTO> waypoints;

    @NotNull(message = "Distance is required")
    private Double distance;

    @NotNull(message = "Duration is required")
    private Integer duration;
}

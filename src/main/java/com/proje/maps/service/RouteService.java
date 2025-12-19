package com.proje.maps.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proje.maps.dto.RouteRequest;
import com.proje.maps.dto.RouteResponse;
import com.proje.maps.dto.WaypointDTO;
import com.proje.maps.exception.BadRequestException;
import com.proje.maps.exception.ResourceNotFoundException;
import com.proje.maps.model.Route;
import com.proje.maps.repo.RouteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.proje.maps.dto.RouteStatisticsResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public RouteResponse createRoute(Long userId, RouteRequest request) {
        log.info("Creating route for user: {}", userId);

        if (request.getWaypoints().size() < 2) {
            throw new BadRequestException("Route must have at least 2 waypoints");
        }

        String waypointsJson;
        try {
            waypointsJson = objectMapper.writeValueAsString(request.getWaypoints());
        } catch (JsonProcessingException e) {
            log.error("Error converting waypoints to JSON", e);
            throw new BadRequestException("Invalid waypoints data");
        }

        Route route = Route.builder()
                .userId(userId)
                .name(request.getName())
                .description(request.getDescription())
                .waypoints(waypointsJson)
                .distance(request.getDistance())
                .duration(request.getDuration())
                .build();

        Route savedRoute = routeRepository.save(route);
        log.info("Route created with ID: {}", savedRoute.getId());

        return convertToResponse(savedRoute);
    }

    public List<RouteResponse> getUserRoutes(Long userId) {
        log.info("Fetching routes for user: {}", userId);
        
        List<Route> routes = routeRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return routes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public RouteResponse getRouteById(Long userId, Long routeId) {
        log.info("Fetching route {} for user: {}", routeId, userId);
        
        Route route = routeRepository.findByIdAndUserId(routeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", routeId));

        return convertToResponse(route);
    }

    @Transactional
    public RouteResponse updateRoute(Long userId, Long routeId, RouteRequest request) {
        log.info("Updating route {} for user: {}", routeId, userId);

        Route route = routeRepository.findByIdAndUserId(routeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", routeId));

        if (request.getWaypoints().size() < 2) {
            throw new BadRequestException("Route must have at least 2 waypoints");
        }

        String waypointsJson;
        try {
            waypointsJson = objectMapper.writeValueAsString(request.getWaypoints());
        } catch (JsonProcessingException e) {
            log.error("Error converting waypoints to JSON", e);
            throw new BadRequestException("Invalid waypoints data");
        }

        route.setName(request.getName());
        route.setDescription(request.getDescription());
        route.setWaypoints(waypointsJson);
        route.setDistance(request.getDistance());
        route.setDuration(request.getDuration());

        Route updatedRoute = routeRepository.save(route);
        log.info("Route updated: {}", updatedRoute.getId());

        return convertToResponse(updatedRoute);
    }

    @Transactional
    public void deleteRoute(Long userId, Long routeId) {
        log.info("Deleting route {} for user: {}", routeId, userId);

        Route route = routeRepository.findByIdAndUserId(routeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", routeId));

        routeRepository.delete(route);
        log.info("Route deleted: {}", routeId);
    }

    public List<RouteResponse> searchRoutes(Long userId, String query) {
        log.info("Searching routes for user {} with query: {}", userId, query);

        List<Route> routes = routeRepository
                .findByUserIdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(userId, query);

        return routes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public RouteStatisticsResponse getRouteStatistics(Long userId) {
        log.info("Fetching route statistics for user: {}", userId);

        List<Route> routes = routeRepository.findByUserIdOrderByCreatedAtDesc(userId);

        double totalDistance = routes.stream()
                .mapToDouble(Route::getDistance)
                .sum();

        int totalDuration = routes.stream()
                .mapToInt(Route::getDuration)
                .sum();

        return RouteStatisticsResponse.builder()
                .totalRoutes(routes.size())
                .totalDistance(totalDistance)
                .totalDuration(totalDuration)
                .build();
    }

    private RouteResponse convertToResponse(Route route) {
        List<WaypointDTO> waypoints;
        try {
            waypoints = objectMapper.readValue(
                    route.getWaypoints(),
                    new TypeReference<List<WaypointDTO>>() {}
            );
        } catch (JsonProcessingException e) {
            log.error("Error parsing waypoints JSON", e);
            throw new RuntimeException("Error parsing route data");
        }

        return RouteResponse.builder()
                .id(route.getId())
                .userId(route.getUserId())
                .name(route.getName())
                .description(route.getDescription())
                .waypoints(waypoints)
                .distance(route.getDistance())
                .duration(route.getDuration())
                .createdAt(route.getCreatedAt())
                .updatedAt(route.getUpdatedAt())
                .build();
    }

}

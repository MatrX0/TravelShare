package com.proje.maps.api;

import com.proje.maps.dto.ApiResponse;
import com.proje.maps.dto.RouteRequest;
import com.proje.maps.dto.RouteResponse;
import com.proje.maps.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Slf4j
public class RouteController extends BaseController {

    private final RouteService routeService;

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @Valid @RequestBody RouteRequest request) {
        log.info("Creating route: {}", request.getName());

        Long userId = getCurrentUserId();
        RouteResponse route = routeService.createRoute(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Route created successfully", route));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        log.info("Fetching all routes for user");

        Long userId = getCurrentUserId();
        List<RouteResponse> routes = routeService.getUserRoutes(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Routes retrieved successfully", routes)
        );
    }

    @GetMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(
            @PathVariable Long routeId) {
        log.info("Fetching route: {}", routeId);

        Long userId = getCurrentUserId();
        RouteResponse route = routeService.getRouteById(userId, routeId);

        return ResponseEntity.ok(
                ApiResponse.success("Route retrieved successfully", route)
        );
    }

    @PutMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable Long routeId,
            @Valid @RequestBody RouteRequest request) {
        log.info("Updating route: {}", routeId);

        Long userId = getCurrentUserId();
        RouteResponse route = routeService.updateRoute(userId, routeId, request);

        return ResponseEntity.ok(
                ApiResponse.success("Route updated successfully", route)
        );
    }

    @DeleteMapping("/{routeId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(
            @PathVariable Long routeId) {
        log.info("Deleting route: {}", routeId);

        Long userId = getCurrentUserId();
        routeService.deleteRoute(userId, routeId);

        return ResponseEntity.ok(
                ApiResponse.success("Route deleted successfully", null)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> searchRoutes(
            @RequestParam String query) {
        log.info("Searching routes with query: {}", query);

        Long userId = getCurrentUserId();
        List<RouteResponse> routes = routeService.searchRoutes(userId, query);

        return ResponseEntity.ok(
                ApiResponse.success("Search completed successfully", routes)
        );
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<RouteService.RouteStatisticsResponse>> getStatistics() {
        log.info("Fetching route statistics");

        Long userId = getCurrentUserId();
        RouteService.RouteStatisticsResponse stats = routeService.getRouteStatistics(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Statistics retrieved successfully", stats)
        );
    }
}

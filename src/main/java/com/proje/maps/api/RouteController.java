package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.resource.Route;
import com.proje.maps.resource.User;
import com.proje.maps.repo.RouteRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
public class RouteController {
    
    private final RouteRepository routeRepository;
    private final UserJpaRepository userRepository;
    private final JwtUtil jwtUtil;
    
    public RouteController(RouteRepository routeRepository, 
                          UserJpaRepository userRepository,
                          JwtUtil jwtUtil) {
        this.routeRepository = routeRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }
    
    // Get current user from token
    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    // Generate unique share token
    private String generateShareToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    
    // Convert Route entity to DTO
    private RouteDTO toDTO(Route route) {
        RouteDTO dto = new RouteDTO();
        dto.setId(route.getId());
        dto.setName(route.getName());
        dto.setDescription(route.getDescription());
        dto.setRouteData(route.getRouteData());
        dto.setStartLocation(route.getStartLocation());
        dto.setEndLocation(route.getEndLocation());
        dto.setDistanceKm(route.getDistanceKm());
        dto.setDurationMinutes(route.getDurationMinutes());
        dto.setCreatedAt(route.getCreatedAt());
        dto.setIsPublic(route.getIsPublic());
        dto.setUserId(route.getUser().getId());
        dto.setUserName(route.getUser().getName());
        dto.setShareToken(route.getShareToken());
        dto.setSharedWithUserIds(
            route.getSharedWithUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList())
        );
        return dto;
    }
    
    // ========================================
    // CREATE ROUTE
    // ========================================
    @PostMapping
    public ResponseEntity<ApiResponse<RouteDTO>> createRoute(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody SaveRouteRequest request) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = new Route(
                request.getName(),
                request.getDescription(),
                request.getRouteData(),
                request.getStartLocation(),
                request.getEndLocation(),
                request.getDistanceKm(),
                request.getDurationMinutes(),
                user
            );
            
            if (request.getIsPublic() != null) {
                route.setIsPublic(request.getIsPublic());
            }
            
            route = routeRepository.save(route);
            
            return ResponseEntity.ok(
                ApiResponse.success("Route saved successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to save route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // GET MY ROUTES
    // ========================================
    @GetMapping("/my-routes")
    public ResponseEntity<ApiResponse<List<RouteDTO>>> getMyRoutes(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getCurrentUser(authHeader);
            
            List<Route> routes = routeRepository.findByUserOrderByCreatedAtDesc(user);
            List<RouteDTO> routeDTOs = routes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(
                ApiResponse.success("Routes retrieved successfully", routeDTOs)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    // ========================================
    // GET ROUTES SHARED WITH ME
    // ========================================
    @GetMapping("/shared-with-me")
    public ResponseEntity<ApiResponse<List<RouteDTO>>> getRoutesSharedWithMe(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getCurrentUser(authHeader);
            
            List<Route> routes = routeRepository.findRoutesSharedWithUser(user.getId());
            List<RouteDTO> routeDTOs = routes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(
                ApiResponse.success("Shared routes retrieved successfully", routeDTOs)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve shared routes: " + e.getMessage()));
        }
    }
    
    // ========================================
    // GET SINGLE ROUTE
    // ========================================
    @GetMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteDTO>> getRoute(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Check if user has access (owner, shared with, or public)
            boolean hasAccess = route.getUser().getId().equals(user.getId()) ||
                              route.getIsPublic() ||
                              routeRepository.isRouteSharedWithUser(routeId, user.getId());
            
            if (!hasAccess) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You don't have access to this route"));
            }
            
            return ResponseEntity.ok(
                ApiResponse.success("Route retrieved successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // UPDATE ROUTE
    // ========================================
    @PutMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteDTO>> updateRoute(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId,
            @Valid @RequestBody SaveRouteRequest request) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Only owner can update
            if (!route.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only update your own routes"));
            }
            
            // Update fields
            route.setName(request.getName());
            route.setDescription(request.getDescription());
            route.setRouteData(request.getRouteData());
            route.setStartLocation(request.getStartLocation());
            route.setEndLocation(request.getEndLocation());
            route.setDistanceKm(request.getDistanceKm());
            route.setDurationMinutes(request.getDurationMinutes());
            
            if (request.getIsPublic() != null) {
                route.setIsPublic(request.getIsPublic());
            }
            
            route = routeRepository.save(route);
            
            return ResponseEntity.ok(
                ApiResponse.success("Route updated successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // DELETE ROUTE
    // ========================================
    @DeleteMapping("/{routeId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Only owner can delete
            if (!route.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only delete your own routes"));
            }
            
            routeRepository.delete(route);
            
            return ResponseEntity.ok(
                ApiResponse.success("Route deleted successfully", null)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // SHARE ROUTE WITH FRIENDS
    // ========================================
    @PostMapping("/{routeId}/share")
    public ResponseEntity<ApiResponse<RouteDTO>> shareRoute(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId,
            @Valid @RequestBody ShareRouteRequest request) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Only owner can share
            if (!route.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only share your own routes"));
            }
            
            // Add friends to shared list
            for (Long friendId : request.getFriendIds()) {
                User friend = userRepository.findById(friendId)
                    .orElseThrow(() -> new RuntimeException("Friend not found: " + friendId));
                
                // Check if already shared
                if (!route.getSharedWithUsers().contains(friend)) {
                    route.getSharedWithUsers().add(friend);
                }
            }
            
            route = routeRepository.save(route);
            
            return ResponseEntity.ok(
                ApiResponse.success("Route shared successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to share route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // UNSHARE ROUTE
    // ========================================
    @DeleteMapping("/{routeId}/share/{userId}")
    public ResponseEntity<ApiResponse<RouteDTO>> unshareRoute(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId,
            @PathVariable Long userId) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Only owner can unshare
            if (!route.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only unshare your own routes"));
            }
            
            // Remove user from shared list
            route.getSharedWithUsers().removeIf(u -> u.getId().equals(userId));
            route = routeRepository.save(route);
            
            return ResponseEntity.ok(
                ApiResponse.success("Route unshared successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to unshare route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // GENERATE SHARE LINK
    // ========================================
    @PostMapping("/{routeId}/generate-share-link")
    public ResponseEntity<ApiResponse<RouteDTO>> generateShareLink(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Only owner can generate share link
            if (!route.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only generate share links for your own routes"));
            }
            
            // Generate new share token if not exists
            if (route.getShareToken() == null || route.getShareToken().isEmpty()) {
                route.setShareToken(generateShareToken());
                route = routeRepository.save(route);
            }
            
            return ResponseEntity.ok(
                ApiResponse.success("Share link generated successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to generate share link: " + e.getMessage()));
        }
    }
    
    // ========================================
    // GET SHARED ROUTE BY TOKEN (PUBLIC)
    // ========================================
    @GetMapping("/shared/{shareToken}")
    public ResponseEntity<ApiResponse<RouteDTO>> getSharedRoute(
            @PathVariable String shareToken) {
        try {
            Route route = routeRepository.findByShareToken(shareToken);
            
            if (route == null) {
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("Shared route not found"));
            }
            
            return ResponseEntity.ok(
                ApiResponse.success("Shared route retrieved successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve shared route: " + e.getMessage()));
        }
    }
    
    // ========================================
    // REVOKE SHARE LINK
    // ========================================
    @DeleteMapping("/{routeId}/share-link")
    public ResponseEntity<ApiResponse<RouteDTO>> revokeShareLink(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long routeId) {
        try {
            User user = getCurrentUser(authHeader);
            
            Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
            
            // Only owner can revoke share link
            if (!route.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only revoke share links for your own routes"));
            }
            
            // Remove share token
            route.setShareToken(null);
            route = routeRepository.save(route);
            
            return ResponseEntity.ok(
                ApiResponse.success("Share link revoked successfully", toDTO(route))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to revoke share link: " + e.getMessage()));
        }
    }
}

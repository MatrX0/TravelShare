package com.proje.maps.repo;

import com.proje.maps.resource.Route;
import com.proje.maps.resource.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    // Find all routes by user
    List<Route> findByUserOrderByCreatedAtDesc(User user);
    
    // Find all routes by user ID
    List<Route> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    // Find public routes
    List<Route> findByIsPublicTrueOrderByCreatedAtDesc();
    
    // Find routes shared with a specific user
    @Query("SELECT r FROM Route r JOIN r.sharedWithUsers u WHERE u.id = :userId ORDER BY r.createdAt DESC")
    List<Route> findRoutesSharedWithUser(@Param("userId") Long userId);
    
    // Check if route is shared with user
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Route r JOIN r.sharedWithUsers u WHERE r.id = :routeId AND u.id = :userId")
    boolean isRouteSharedWithUser(@Param("routeId") Long routeId, @Param("userId") Long userId);
    
    // Find route by share token
    Route findByShareToken(String shareToken);
    
    // Count routes by user
    long countByUser(User user);
}

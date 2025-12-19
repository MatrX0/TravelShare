package com.proje.maps.api;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Base controller providing common functionality for all controllers
 */
public abstract class BaseController {
    
    /**
     * Get current authenticated user's ID from security context
     * 
     * @return User ID of currently authenticated user
     * @throws RuntimeException if user is not authenticated or invalid
     */
    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        
        throw new RuntimeException("Invalid user principal");
    }
    
    /**
     * Get current authenticated user details
     * 
     * @return CustomUserDetails object
     * @throws RuntimeException if user is not authenticated
     */
    protected CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof CustomUserDetails) {
            return (CustomUserDetails) principal;
        }
        
        throw new RuntimeException("Invalid user principal");
    }
    
    /**
     * Check if user is authenticated
     * 
     * @return true if user is authenticated, false otherwise
     */
    protected boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() 
               && authentication.getPrincipal() instanceof CustomUserDetails;
    }
}

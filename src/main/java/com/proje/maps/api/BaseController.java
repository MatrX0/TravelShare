package com.proje.maps.api;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class BaseController {

    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        
        // CustomUserDetails ise direkt ID'yi al
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        
        // UserDetails ise username'den (artık User ID) parse et
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) principal;
            
            String username = userDetails.getUsername();
            
            try {
                return Long.parseLong(username);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Cannot parse user ID from username: " + username);
            }
        }
        
        // Principal direkt Long ise
        if (principal instanceof Long) {
            return (Long) principal;
        }
        
        // Principal String ise (user ID)
        if (principal instanceof String) {
            try {
                return Long.parseLong((String) principal);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Cannot parse user ID from string: " + principal);
            }
        }
        
        throw new RuntimeException("Cannot determine user ID from principal type: " + principal.getClass());
    }
}

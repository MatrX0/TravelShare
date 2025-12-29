package com.proje.maps.security;

import com.proje.maps.api.CustomUserDetails;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserJpaRepository userRepository;
    
    public JwtAuthenticationFilter(JwtUtil jwtUtil, 
                                   UserDetailsService userDetailsService,
                                   UserJpaRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/weather/") || 
               path.startsWith("/api/auth/") || 
               path.equals("/api/health") ||
               path.startsWith("/ws/");
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String jwt = authHeader.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // ✅ Mevcut UserDetailsService kullan
                UserDetails baseUserDetails = userDetailsService.loadUserByUsername(email);
                
                if (jwtUtil.validateToken(jwt, baseUserDetails)) {
                    // ✅ User ID'yi database'den al
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    
                    // ✅ CustomUserDetails ile wrap et (ID ekle)
                    CustomUserDetails customUserDetails = new CustomUserDetails(baseUserDetails, user.getId());
                    
                    // ✅ CustomUserDetails'i SecurityContext'e koy
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            customUserDetails, 
                            null, 
                            customUserDetails.getAuthorities()
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }
        
        filterChain.doFilter(request, response);
    }
}
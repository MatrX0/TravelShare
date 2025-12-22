package com.proje.maps.security;

import com.proje.maps.api.CustomUserDetails;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserJpaRepository userRepository;
    
    public CustomUserDetailsService(UserJpaRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Username artık user ID (string olarak)
        // Önce ID olarak dene
        try {
            Long userId = Long.parseLong(username);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
            
            return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getIsActive()
            );
        } catch (NumberFormatException e) {
            // ID değilse email olarak ara (backward compatibility için)
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
            
            return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getIsActive()
            );
        }
    }
}

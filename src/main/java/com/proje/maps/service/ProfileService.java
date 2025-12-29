package com.proje.maps.service;

import com.proje.maps.dto.UpdateProfileRequest;
import com.proje.maps.dto.UserProfileDTO;
import com.proje.maps.repo.ActivityGroupRepository;
import com.proje.maps.repo.FriendshipRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class ProfileService {
    
    @Autowired
    private UserJpaRepository userRepository;
    
    @Autowired
    private ActivityGroupRepository activityGroupRepository;
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    /**
     * Get user profile
     * Basit versiyon - sadece User bilgilerini döndürür
     * İstatistikler ve listeler için ayrı endpoint'ler kullanılabilir
     */
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfileDTO profile = new UserProfileDTO();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setBio(user.getBio());
        profile.setAvatarUrl(user.getAvatarUrl());
        
        // CreatedAt varsa set et
        if (user.getCreatedAt() != null) {
            profile.setCreatedAt(user.getCreatedAt());
        }
        
        // İstatistikleri gerçek verilerden hesapla
        Long groupCount = activityGroupRepository.countGroupsByUserId(userId);
        Long friendCount = friendshipRepository.countAcceptedFriends(userId);
        
        profile.setGroupCount(groupCount != null ? groupCount.intValue() : 0);
        profile.setFriendCount(friendCount != null ? friendCount.intValue() : 0);
        
        return profile;
    }
    
    /**
     * Update user profile
     */
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update only non-null fields
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        
        userRepository.save(user);
        
        return getUserProfile(userId);
    }
}
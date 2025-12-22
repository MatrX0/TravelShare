package com.proje.maps.service;

import com.proje.maps.dto.*;
import com.proje.maps.repo.*;
import com.proje.maps.resource.*;
import com.proje.maps.resource.Friendship.FriendshipStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendshipService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserJpaRepository userRepository;
    
    public FriendshipService(FriendshipRepository friendshipRepository,
                            UserJpaRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }
    
    // Send friend request
    @Transactional
    public FriendRequestDTO sendFriendRequest(Long userId, Long friendUserId) {
        // Check if trying to add self
        if (userId.equals(friendUserId)) {
            throw new RuntimeException("Cannot send friend request to yourself");
        }
        
        // Check if users exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendUserId)
                .orElseThrow(() -> new RuntimeException("Friend user not found"));
        
        // Check if friendship already exists
        if (friendshipRepository.existsBetween(userId, friendUserId)) {
            throw new RuntimeException("Friendship request already exists");
        }
        
        // Create friendship
        Friendship friendship = new Friendship(user, friend);
        Friendship savedFriendship = friendshipRepository.save(friendship);
        
        return toFriendRequestDTO(savedFriendship);
    }
    
    // Accept friend request
    @Transactional
    public FriendDTO acceptFriendRequest(Long requestId, Long userId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        // Check if user is the receiver
        if (!friendship.getFriend().getId().equals(userId)) {
            throw new RuntimeException("Only the receiver can accept this friend request");
        }
        
        // Check if already accepted
        if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
            throw new RuntimeException("Friend request already accepted");
        }
        
        // Accept friendship
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        Friendship acceptedFriendship = friendshipRepository.save(friendship);
        
        return toFriendDTO(acceptedFriendship, userId);
    }
    
    // Reject friend request
    @Transactional
    public void rejectFriendRequest(Long requestId, Long userId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        // Check if user is the receiver
        if (!friendship.getFriend().getId().equals(userId)) {
            throw new RuntimeException("Only the receiver can reject this friend request");
        }
        
        // Reject friendship
        friendship.setStatus(FriendshipStatus.REJECTED);
        friendshipRepository.save(friendship);
    }
    
    // Get friends list
    public List<FriendDTO> getFriends(Long userId) {
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendships(userId);
        return friendships.stream()
                .map(friendship -> toFriendDTO(friendship, userId))
                .collect(Collectors.toList());
    }
    
    // Get pending requests (received)
    public List<FriendRequestDTO> getPendingRequests(Long userId) {
        List<Friendship> requests = friendshipRepository.findReceivedPendingRequests(userId);
        return requests.stream()
                .map(this::toFriendRequestDTO)
                .collect(Collectors.toList());
    }
    
    // Get sent requests
    public List<FriendRequestDTO> getSentRequests(Long userId) {
        List<Friendship> requests = friendshipRepository.findSentPendingRequests(userId);
        return requests.stream()
                .map(this::toFriendRequestDTO)
                .collect(Collectors.toList());
    }
    
    // Remove friend
    @Transactional
    public void removeFriend(Long userId, Long friendUserId) {
        Friendship friendship = friendshipRepository.findFriendshipBetween(userId, friendUserId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));
        
        friendshipRepository.delete(friendship);
    }
    
    // Block user
    @Transactional
    public void blockUser(Long userId, Long blockedUserId) {
        // Check if users exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User blockedUser = userRepository.findById(blockedUserId)
                .orElseThrow(() -> new RuntimeException("Blocked user not found"));
        
        // Check if friendship exists
        Friendship friendship = friendshipRepository.findFriendshipBetween(userId, blockedUserId)
                .orElse(new Friendship(user, blockedUser));
        
        // Block user
        friendship.setStatus(FriendshipStatus.BLOCKED);
        friendshipRepository.save(friendship);
    }
    
    // Check if friends
    public boolean areFriends(Long userId, Long friendUserId) {
        return friendshipRepository.areFriends(userId, friendUserId);
    }
    
    // Get friendship status
    public String getFriendshipStatus(Long userId, Long friendUserId) {
        return friendshipRepository.getFriendshipStatus(userId, friendUserId)
                .map(FriendshipStatus::name)
                .orElse(null);
    }
    
    // ==================== HELPER METHODS ====================
    
    private FriendDTO toFriendDTO(Friendship friendship, Long currentUserId) {
        // Determine which user is the friend
        User friendUser = friendship.getUser().getId().equals(currentUserId) 
                ? friendship.getFriend() 
                : friendship.getUser();
        
        FriendDTO dto = new FriendDTO();
        dto.setUserId(friendUser.getId());
        dto.setName(friendUser.getName());
        dto.setEmail(friendUser.getEmail());
        dto.setAvatarUrl(friendUser.getAvatarUrl());
        dto.setBio(friendUser.getBio());
        dto.setStatus(friendship.getStatus().name());
        dto.setFriendsSince(friendship.getAcceptedAt());
        dto.setMutualFriendsCount(0); // TODO: Calculate mutual friends
        return dto;
    }
    
    private FriendRequestDTO toFriendRequestDTO(Friendship friendship) {
        User sender = friendship.getUser();
        
        FriendRequestDTO dto = new FriendRequestDTO();
        dto.setRequestId(friendship.getId());
        dto.setUserId(sender.getId());
        dto.setName(sender.getName());
        dto.setEmail(sender.getEmail());
        dto.setAvatarUrl(sender.getAvatarUrl());
        dto.setBio(sender.getBio());
        dto.setRequestedAt(friendship.getCreatedAt());
        dto.setStatus(friendship.getStatus().name());
        return dto;
    }

    public void unblockUser(Long userId, Long blockedUserId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'unblockUser'");
    }

    public List<UserDTO> searchUsers(String query, Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'searchUsers'");
    }

    // Send friend request by Unique ID
    @Transactional
    public FriendRequestDTO sendFriendRequestByUniqueId(Long userId, String uniqueId) {
        // Find friend by unique ID
        User friend = userRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("User not found with Unique ID: " + uniqueId));
        
        // Check if trying to add self
        if (userId.equals(friend.getId())) {
            throw new RuntimeException("Cannot send friend request to yourself");
        }
        
        // Use existing sendFriendRequest method
        return sendFriendRequest(userId, friend.getId());
    }
    
    // Find user by Unique ID
    public UserDTO findUserByUniqueId(String uniqueId) {
        User user = userRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("User not found with Unique ID: " + uniqueId));
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setUniqueId(user.getUniqueId());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());
        
        return dto;
    }

}

package com.proje.maps.repo;

import com.proje.maps.resource.Friendship;
import com.proje.maps.resource.Friendship.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    // Find friendship between two users (bidirectional)
    @Query("SELECT f FROM Friendship f WHERE (f.user.id = :userId AND f.friend.id = :friendId) OR (f.user.id = :friendId AND f.friend.id = :userId)")
    Optional<Friendship> findFriendshipBetween(@Param("userId") Long userId, @Param("friendId") Long friendId);
    
    // Get all accepted friends for a user
    @Query("SELECT f FROM Friendship f WHERE (f.user.id = :userId OR f.friend.id = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendships(@Param("userId") Long userId);
    
    // Get pending friend requests sent by user
    @Query("SELECT f FROM Friendship f WHERE f.user.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findSentPendingRequests(@Param("userId") Long userId);
    
    // Get pending friend requests received by user
    @Query("SELECT f FROM Friendship f WHERE f.friend.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findReceivedPendingRequests(@Param("userId") Long userId);
    
    // Check if friendship exists between two users
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE ((f.user.id = :userId AND f.friend.id = :friendId) OR (f.user.id = :friendId AND f.friend.id = :userId))")
    boolean existsBetween(@Param("userId") Long userId, @Param("friendId") Long friendId);
    
    // Check if users are friends (accepted status)
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE ((f.user.id = :userId AND f.friend.id = :friendId) OR (f.user.id = :friendId AND f.friend.id = :userId)) AND f.status = 'ACCEPTED'")
    boolean areFriends(@Param("userId") Long userId, @Param("friendId") Long friendId);
    
    // Get friendship status between two users
    @Query("SELECT f.status FROM Friendship f WHERE (f.user.id = :userId AND f.friend.id = :friendId) OR (f.user.id = :friendId AND f.friend.id = :userId)")
    Optional<FriendshipStatus> getFriendshipStatus(@Param("userId") Long userId, @Param("friendId") Long friendId);
    
    // Count accepted friends for a user
    @Query("SELECT COUNT(f) FROM Friendship f WHERE (f.user.id = :userId OR f.friend.id = :userId) AND f.status = 'ACCEPTED'")
    Long countAcceptedFriends(@Param("userId") Long userId);
    
    // Count pending requests for a user (received)
    @Query("SELECT COUNT(f) FROM Friendship f WHERE f.friend.id = :userId AND f.status = 'PENDING'")
    Long countPendingRequests(@Param("userId") Long userId);
    
    // Get blocked users
    @Query("SELECT f FROM Friendship f WHERE f.user.id = :userId AND f.status = 'BLOCKED'")
    List<Friendship> findBlockedUsers(@Param("userId") Long userId);
    
    // Check if user is blocked
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE f.user.id = :userId AND f.friend.id = :blockedUserId AND f.status = 'BLOCKED'")
    boolean isBlocked(@Param("userId") Long userId, @Param("blockedUserId") Long blockedUserId);
}

package com.proje.maps.repo;

import com.proje.maps.resource.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {
    
    // Get conversation between two users (ordered by time)
    @Query("SELECT dm FROM DirectMessage dm WHERE (dm.sender.id = :userId1 AND dm.receiver.id = :userId2) OR (dm.sender.id = :userId2 AND dm.receiver.id = :userId1) ORDER BY dm.createdAt ASC")
    List<DirectMessage> findConversationBetween(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    // Get all unread messages for a user
    @Query("SELECT dm FROM DirectMessage dm WHERE dm.receiver.id = :userId AND dm.isRead = false ORDER BY dm.createdAt DESC")
    List<DirectMessage> findUnreadMessages(@Param("userId") Long userId);
    
    // Get unread messages from a specific user
    @Query("SELECT dm FROM DirectMessage dm WHERE dm.receiver.id = :receiverId AND dm.sender.id = :senderId AND dm.isRead = false ORDER BY dm.createdAt ASC")
    List<DirectMessage> findUnreadMessagesFrom(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
    
    // Get all messages sent by a user
    @Query("SELECT dm FROM DirectMessage dm WHERE dm.sender.id = :userId ORDER BY dm.createdAt DESC")
    List<DirectMessage> findSentMessages(@Param("userId") Long userId);
    
    // Get all messages received by a user
    @Query("SELECT dm FROM DirectMessage dm WHERE dm.receiver.id = :userId ORDER BY dm.createdAt DESC")
    List<DirectMessage> findReceivedMessages(@Param("userId") Long userId);
    
    // Get last message between two users
    @Query("SELECT dm FROM DirectMessage dm WHERE (dm.sender.id = :userId1 AND dm.receiver.id = :userId2) OR (dm.sender.id = :userId2 AND dm.receiver.id = :userId1) ORDER BY dm.createdAt DESC")
    List<DirectMessage> findLastMessageBetween(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    // Count unread messages for a user
    @Query("SELECT COUNT(dm) FROM DirectMessage dm WHERE dm.receiver.id = :userId AND dm.isRead = false")
    Long countUnreadMessages(@Param("userId") Long userId);
    
    // Count unread messages from a specific user
    @Query("SELECT COUNT(dm) FROM DirectMessage dm WHERE dm.receiver.id = :receiverId AND dm.sender.id = :senderId AND dm.isRead = false")
    Long countUnreadMessagesFrom(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
    
    // Mark all messages as read between two users
    @Modifying
    @Query("UPDATE DirectMessage dm SET dm.isRead = true, dm.readAt = CURRENT_TIMESTAMP WHERE dm.receiver.id = :receiverId AND dm.sender.id = :senderId AND dm.isRead = false")
    void markAllAsReadBetween(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
    
    // Get unique users who have conversation with a user
    @Query("SELECT DISTINCT CASE WHEN dm.sender.id = :userId THEN dm.receiver.id ELSE dm.sender.id END FROM DirectMessage dm WHERE dm.sender.id = :userId OR dm.receiver.id = :userId")
    List<Long> findConversationPartners(@Param("userId") Long userId);
    
    // Delete conversation between two users
    @Modifying
    @Query("DELETE FROM DirectMessage dm WHERE (dm.sender.id = :userId1 AND dm.receiver.id = :userId2) OR (dm.sender.id = :userId2 AND dm.receiver.id = :userId1)")
    void deleteConversationBetween(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}

package com.proje.maps.repo;

import com.proje.maps.resource.GroupChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChat, Long> {
    
    // Get all messages for a group (ordered by newest first)
    @Query("SELECT gc FROM GroupChat gc WHERE gc.group.id = :groupId ORDER BY gc.createdAt DESC")
    List<GroupChat> findByGroupIdOrderByCreatedAtDesc(@Param("groupId") Long groupId);
    
    // Get all messages for a group (ordered by oldest first)
    @Query("SELECT gc FROM GroupChat gc WHERE gc.group.id = :groupId ORDER BY gc.createdAt ASC")
    List<GroupChat> findByGroupIdOrderByCreatedAtAsc(@Param("groupId") Long groupId);
    
    // Get recent messages for a group (limit)
    @Query("SELECT gc FROM GroupChat gc WHERE gc.group.id = :groupId ORDER BY gc.createdAt DESC")
    List<GroupChat> findRecentMessagesByGroupId(@Param("groupId") Long groupId);
    
    // Get messages after a specific time
    @Query("SELECT gc FROM GroupChat gc WHERE gc.group.id = :groupId AND gc.createdAt > :after ORDER BY gc.createdAt ASC")
    List<GroupChat> findByGroupIdAndCreatedAtAfter(@Param("groupId") Long groupId, @Param("after") LocalDateTime after);
    
    // Get message count for a group
    @Query("SELECT COUNT(gc) FROM GroupChat gc WHERE gc.group.id = :groupId")
    Long getMessageCountByGroupId(@Param("groupId") Long groupId);
    
    // Delete all messages for a group
    void deleteByGroupId(Long groupId);
}

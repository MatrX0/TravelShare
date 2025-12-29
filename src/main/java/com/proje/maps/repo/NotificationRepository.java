package com.proje.maps.repo;

import com.proje.maps.resource.Notification;
import com.proje.maps.resource.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, Boolean isRead);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    Long countUnreadByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user = :user AND n.isRead = false")
    int markAllAsReadByUser(@Param("user") User user);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user = :user AND n.isRead = true")
    int deleteReadNotificationsByUser(@Param("user") User user);
}
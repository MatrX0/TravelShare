package com.proje.maps.repo;

import com.proje.maps.resource.ActivityGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActivityGroupRepository extends JpaRepository<ActivityGroup, Long> {
    
    // Find group by name
    Optional<ActivityGroup> findByName(String name);
    
    // Check if group exists by name
    boolean existsByName(String name);
    
    // Get member count for a group
    @Query("SELECT COUNT(u) FROM ActivityGroup g JOIN g.members u WHERE g.id = :groupId")
    Long getMemberCount(@Param("groupId") Long groupId);
    
    // Check if user is member of group
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM ActivityGroup g JOIN g.members u WHERE g.id = :groupId AND u.id = :userId")
    boolean isUserMember(@Param("groupId") Long groupId, @Param("userId") Long userId);
}

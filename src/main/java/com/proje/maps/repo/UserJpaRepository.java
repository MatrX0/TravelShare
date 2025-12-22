package com.proje.maps.repo;

import com.proje.maps.resource.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserJpaRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUniqueId(String uniqueId);
    
    boolean existsByEmail(String email);
    
    boolean existsByUniqueId(String uniqueId);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.uniqueId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
    
    @Query("SELECT u FROM User u WHERE u.id <> :excludeId AND (" +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.uniqueId) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchUsersExcluding(@Param("query") String query, @Param("excludeId") Long excludeId);
}

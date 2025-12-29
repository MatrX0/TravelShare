package com.proje.maps.service;

import com.proje.maps.dto.*;
import com.proje.maps.repo.*;
import com.proje.maps.resource.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityGroupService {
    
    private final ActivityGroupRepository groupRepository;
    private final UserJpaRepository userRepository;
    private final GroupChatRepository chatRepository;
    private final GroupBlogRepository blogRepository;
    
    public ActivityGroupService(ActivityGroupRepository groupRepository,
                               UserJpaRepository userRepository,
                               GroupChatRepository chatRepository,
                               GroupBlogRepository blogRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.blogRepository = blogRepository;
    }
    
    // Get all groups with user membership status
    public List<GroupDTO> getAllGroups(Long userId) {
        List<ActivityGroup> groups = groupRepository.findAll();
        return groups.stream()
                .map(group -> toGroupDTO(group, userId))
                .collect(Collectors.toList());
    }
    
    // Get group detail
    public GroupDetailDTO getGroupDetail(Long groupId, Long userId) {
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        GroupDetailDTO dto = new GroupDetailDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setIcon(group.getIcon());
        dto.setColor(group.getColor());
        dto.setDescription(group.getDescription());
        dto.setMemberCount(group.getMembers().size());
        dto.setIsMember(userId != null && groupRepository.isUserMember(groupId, userId));
        dto.setCreatedAt(group.getCreatedAt());
        
        // Get members
        List<GroupMemberDTO> members = group.getMembers().stream()
                .map(this::toMemberDTO)
                .collect(Collectors.toList());
        dto.setMembers(members);
        
        // Get statistics
        dto.setBlogCount(blogRepository.countByGroupId(groupId).intValue());
        dto.setMessageCount(chatRepository.getMessageCountByGroupId(groupId).intValue());
        
        return dto;
    }
    
    // Create group
    @Transactional
    public GroupDTO createGroup(CreateGroupRequest request, Long userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create new group
        ActivityGroup group = new ActivityGroup();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setIcon(request.getIcon());
        group.setCategory(request.getCategory());
        group.setMaxMembers(request.getMaxMembers());
        group.setIsPrivate(request.getIsPrivate() != null ? request.getIsPrivate() : false);
        group.setCreator(creator);
        
        // Add creator as first member
        group.addMember(creator);
        
        ActivityGroup savedGroup = groupRepository.save(group);
        return toGroupDTO(savedGroup, userId);
    }
    
    // Update group
    @Transactional
    public GroupDTO updateGroup(Long groupId, CreateGroupRequest request, Long userId) {
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is creator
        if (group.getCreator() == null || !group.getCreator().getId().equals(userId)) {
            throw new RuntimeException("Only the group creator can update this group");
        }
        
        // Update fields
        if (request.getName() != null) {
            group.setName(request.getName());
        }
        if (request.getDescription() != null) {
            group.setDescription(request.getDescription());
        }
        if (request.getIcon() != null) {
            group.setIcon(request.getIcon());
        }
        if (request.getCategory() != null) {
            group.setCategory(request.getCategory());
        }
        if (request.getMaxMembers() != null) {
            group.setMaxMembers(request.getMaxMembers());
        }
        if (request.getIsPrivate() != null) {
            group.setIsPrivate(request.getIsPrivate());
        }
        
        ActivityGroup updatedGroup = groupRepository.save(group);
        return toGroupDTO(updatedGroup, userId);
    }
    
    // Delete group
    @Transactional
    public void deleteGroup(Long groupId, Long userId) {
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is creator
        if (group.getCreator() == null || !group.getCreator().getId().equals(userId)) {
            throw new RuntimeException("Only the group creator can delete this group");
        }
        
        groupRepository.delete(group);
    }
    
    // Join a group
    @Transactional
    public GroupDTO joinGroup(Long groupId, Long userId) {
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already member
        if (groupRepository.isUserMember(groupId, userId)) {
            throw new RuntimeException("User is already a member of this group");
        }
        
        // Check if group is full
        if (group.getMaxMembers() != null && group.getMembers().size() >= group.getMaxMembers()) {
            throw new RuntimeException("Group is full");
        }
        
        // Add user to group
        group.addMember(user);
        groupRepository.save(group);
        
        return toGroupDTO(group, userId);
    }
    
    // Leave a group
    @Transactional
    public void leaveGroup(Long groupId, Long userId) {
        System.out.println("[LEAVE GROUP] Starting - groupId: " + groupId + ", userId: " + userId);
        
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        System.out.println("[LEAVE GROUP] Group found: " + group.getName() + ", members: " + group.getMembers().size());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("[LEAVE GROUP] User found: " + user.getName());
        
        // Check if member
        boolean isMember = groupRepository.isUserMember(groupId, userId);
        System.out.println("[LEAVE GROUP] Is member check: " + isMember);
        
        if (!isMember) {
            throw new RuntimeException("User is not a member of this group");
        }
        
        // Prevent creator from leaving (only if creator is set)
        try {
            if (group.getCreator() != null) {
                Long creatorId = group.getCreator().getId();
                if (creatorId != null && creatorId.equals(userId)) {
                    System.out.println("[LEAVE GROUP] User is creator - cannot leave");
                    throw new RuntimeException("Group creator cannot leave the group. Delete the group instead.");
                }
            }
        } catch (Exception e) {
            System.err.println("[LEAVE GROUP] Error checking creator: " + e.getMessage());
            // Continue with leave operation if creator check fails
        }
        
        // Remove user from group
        System.out.println("[LEAVE GROUP] Removing member...");
        group.removeMember(user);
        
        System.out.println("[LEAVE GROUP] Saving group...");
        groupRepository.save(group);
        
        System.out.println("[LEAVE GROUP] Successfully completed");
    }
    
    // Get group members
    public List<GroupMemberDTO> getGroupMembers(Long groupId) {
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        return group.getMembers().stream()
                .map(this::toMemberDTO)
                .collect(Collectors.toList());
    }
    
    // Get user's groups
    public List<GroupDTO> getUserGroups(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getGroups().stream()
                .map(group -> toGroupDTO(group, userId))
                .collect(Collectors.toList());
    }
    
    // Search groups
    public List<GroupDTO> searchGroups(String query, String category, Long userId) {
        List<ActivityGroup> groups = groupRepository.findAll();
        
        // Filter by query (name or description)
        if (query != null && !query.trim().isEmpty()) {
            String searchQuery = query.toLowerCase().trim();
            groups = groups.stream()
                    .filter(group -> 
                        group.getName().toLowerCase().contains(searchQuery) ||
                        (group.getDescription() != null && group.getDescription().toLowerCase().contains(searchQuery))
                    )
                    .collect(Collectors.toList());
        }
        
        // Filter by category
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            groups = groups.stream()
                    .filter(group -> category.equalsIgnoreCase(group.getCategory()))
                    .collect(Collectors.toList());
        }
        
        return groups.stream()
                .map(group -> toGroupDTO(group, userId))
                .collect(Collectors.toList());
    }
    
    // ==================== HELPER METHODS ====================
    
    private GroupDTO toGroupDTO(ActivityGroup group, Long userId) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setIcon(group.getIcon());
        dto.setColor(group.getColor());
        dto.setDescription(group.getDescription());
        dto.setCategory(group.getCategory());
        dto.setMemberCount(group.getMembers().size());
        dto.setMaxMembers(group.getMaxMembers());
        dto.setIsPrivate(group.getIsPrivate());
        dto.setCreatedAt(group.getCreatedAt());
        
        // Set isMember status
        dto.setIsMember(userId != null && groupRepository.isUserMember(group.getId(), userId));
        
        // Set creator info if available
        if (group.getCreator() != null) {
            UserDTO creatorDTO = new UserDTO();
            creatorDTO.setId(group.getCreator().getId());
            creatorDTO.setName(group.getCreator().getName());
            creatorDTO.setEmail(group.getCreator().getEmail());
            creatorDTO.setAvatarUrl(group.getCreator().getAvatarUrl());
            dto.setCreator(creatorDTO);
        }
        
        // Get blog count
        try {
            Long blogCount = blogRepository.countByGroupId(group.getId());
            dto.setBlogCount(blogCount.intValue());
        } catch (Exception e) {
            dto.setBlogCount(0);
        }
        
        return dto;
    }
    
    private GroupMemberDTO toMemberDTO(User user) {
        GroupMemberDTO dto = new GroupMemberDTO();
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}
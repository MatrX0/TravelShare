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
        dto.setIsMember(groupRepository.isUserMember(groupId, userId));
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
        
        // Add user to group
        group.addMember(user);
        groupRepository.save(group);
        
        return toGroupDTO(group, userId);
    }
    
    // Leave a group
    @Transactional
    public void leaveGroup(Long groupId, Long userId) {
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if member
        if (!groupRepository.isUserMember(groupId, userId)) {
            throw new RuntimeException("User is not a member of this group");
        }
        
        // Remove user from group
        group.removeMember(user);
        groupRepository.save(group);
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
    
    // ==================== HELPER METHODS ====================
    
    private GroupDTO toGroupDTO(ActivityGroup group, Long userId) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setIcon(group.getIcon());
        dto.setColor(group.getColor());
        dto.setDescription(group.getDescription());
        dto.setMemberCount(group.getMembers().size());
        dto.setIsMember(groupRepository.isUserMember(group.getId(), userId));
        dto.setCreatedAt(group.getCreatedAt());
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

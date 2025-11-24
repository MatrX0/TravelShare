package com.proje.maps.service;

import com.proje.maps.dto.*;
import com.proje.maps.repo.*;
import com.proje.maps.resource.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupChatService {
    
    private final GroupChatRepository chatRepository;
    private final ActivityGroupRepository groupRepository;
    private final UserJpaRepository userRepository;
    
    public GroupChatService(GroupChatRepository chatRepository,
                           ActivityGroupRepository groupRepository,
                           UserJpaRepository userRepository) {
        this.chatRepository = chatRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }
    
    // Send message to group
    @Transactional
    public GroupChatDTO sendMessage(Long groupId, Long userId, SendMessageRequest request) {
        // Check if group exists
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is member
        if (!groupRepository.isUserMember(groupId, userId)) {
            throw new RuntimeException("User must be a member of the group to send messages");
        }
        
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create message
        GroupChat message = new GroupChat(group, user, request.getMessage());
        GroupChat savedMessage = chatRepository.save(message);
        
        return toChatDTO(savedMessage);
    }
    
    // Get group messages (newest first)
    public List<GroupChatDTO> getGroupMessages(Long groupId, Long userId) {
        // Check if user is member
        if (!groupRepository.isUserMember(groupId, userId)) {
            throw new RuntimeException("User must be a member of the group to view messages");
        }
        
        List<GroupChat> messages = chatRepository.findByGroupIdOrderByCreatedAtAsc(groupId);
        return messages.stream()
                .map(this::toChatDTO)
                .collect(Collectors.toList());
    }
    
    // Get recent messages (for real-time updates)
    public List<GroupChatDTO> getRecentMessages(Long groupId, Long userId, int limit) {
        // Check if user is member
        if (!groupRepository.isUserMember(groupId, userId)) {
            throw new RuntimeException("User must be a member of the group to view messages");
        }
        
        List<GroupChat> messages = chatRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
        return messages.stream()
                .limit(limit)
                .map(this::toChatDTO)
                .collect(Collectors.toList());
    }
    
    // Delete message (only sender can delete)
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        GroupChat message = chatRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Check if user is the sender
        if (!message.getSender().getId().equals(userId)) {
            throw new RuntimeException("Only the message sender can delete this message");
        }
        
        chatRepository.delete(message);
    }
    
    // ==================== HELPER METHODS ====================
    
    private GroupChatDTO toChatDTO(GroupChat message) {
        GroupChatDTO dto = new GroupChatDTO();
        dto.setId(message.getId());
        dto.setGroupId(message.getGroup().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setSenderAvatar(message.getSender().getAvatarUrl());
        dto.setMessage(message.getMessage());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}

package com.proje.maps.service;

import com.proje.maps.dto.*;
import com.proje.maps.dto.ConversationDTO.OtherUserInfo;
import com.proje.maps.repo.*;
import com.proje.maps.resource.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirectMessageService {
    
    private final DirectMessageRepository messageRepository;
    private final UserJpaRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    
    public DirectMessageService(DirectMessageRepository messageRepository,
                               UserJpaRepository userRepository,
                               FriendshipRepository friendshipRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
    }
    
    // Send direct message
    @Transactional
    public DirectMessageDTO sendMessage(Long senderId, SendDirectMessageRequest request) {
        // Check if users exist
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        // Check if they are friends
        if (!friendshipRepository.areFriends(senderId, request.getReceiverId())) {
            throw new RuntimeException("You can only send messages to friends");
        }
        
        // Create message (use getContent() now)
        DirectMessage message = new DirectMessage(sender, receiver, request.getContent());
        DirectMessage savedMessage = messageRepository.save(message);
        
        return toMessageDTO(savedMessage, senderId);
    }
    
    // Get conversation between two users
    public List<DirectMessageDTO> getConversation(Long userId1, Long userId2) {
        // Check if they are friends
        if (!friendshipRepository.areFriends(userId1, userId2)) {
            throw new RuntimeException("You can only view conversations with friends");
        }
        
        List<DirectMessage> messages = messageRepository.findConversationBetween(userId1, userId2);
        return messages.stream()
                .map(msg -> toMessageDTO(msg, userId1))
                .collect(Collectors.toList());
    }
    
    // Get all conversations (inbox)
    public List<ConversationDTO> getAllConversations(Long userId) {
        // Get all conversation partners
        List<Long> partnerIds = messageRepository.findConversationPartners(userId);
        
        List<ConversationDTO> conversations = new ArrayList<>();
        for (Long partnerId : partnerIds) {
            User partner = userRepository.findById(partnerId).orElse(null);
            if (partner == null) continue;
            
            // Get last message
            List<DirectMessage> lastMessages = messageRepository.findLastMessageBetween(userId, partnerId);
            DirectMessage lastMessage = lastMessages.isEmpty() ? null : lastMessages.get(0);
            
            // Get unread count
            Long unreadCount = messageRepository.countUnreadMessagesFrom(userId, partnerId);
            
            ConversationDTO dto = new ConversationDTO();
            
            // Create otherUser object
            OtherUserInfo otherUser = new OtherUserInfo(
                partner.getId(),
                partner.getName(),
                partner.getEmail(),
                partner.getAvatarUrl()
            );
            dto.setOtherUser(otherUser);
            
            dto.setLastMessage(lastMessage != null ? lastMessage.getMessage() : null);
            dto.setLastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : null);
            dto.setUnreadCount(unreadCount.intValue());
            
            conversations.add(dto);
        }
        
        // Sort by last message time
        conversations.sort((a, b) -> {
            if (a.getLastMessageTime() == null) return 1;
            if (b.getLastMessageTime() == null) return -1;
            return b.getLastMessageTime().compareTo(a.getLastMessageTime());
        });
        
        return conversations;
    }
    
    // Get unread messages
    public List<DirectMessageDTO> getUnreadMessages(Long userId) {
        List<DirectMessage> messages = messageRepository.findUnreadMessages(userId);
        return messages.stream()
                .map(msg -> toMessageDTO(msg, userId))
                .collect(Collectors.toList());
    }
    
    // Get unread count
    public Long getUnreadCount(Long userId) {
        return messageRepository.countUnreadMessages(userId);
    }
    
    // Mark messages as read
    @Transactional
    public void markAsRead(Long receiverId, Long senderId) {
        messageRepository.markAllAsReadBetween(receiverId, senderId);
    }
    
    // Mark single message as read
    @Transactional
    public void markMessageAsRead(Long messageId, Long userId) {
        DirectMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Check if user is the receiver
        if (!message.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Only the receiver can mark this message as read");
        }
        
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    // Delete conversation
    @Transactional
    public void deleteConversation(Long userId1, Long userId2) {
        messageRepository.deleteConversationBetween(userId1, userId2);
    }
    
    // Delete message
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        DirectMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Check if user is the sender
        if (!message.getSender().getId().equals(userId)) {
            throw new RuntimeException("Only the sender can delete this message");
        }
        
        messageRepository.delete(message);
    }
    
    // ==================== HELPER METHODS ====================
    
    private DirectMessageDTO toMessageDTO(DirectMessage message, Long currentUserId) {
        DirectMessageDTO dto = new DirectMessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setSenderAvatar(message.getSender().getAvatarUrl());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getName());
        dto.setReceiverAvatar(message.getReceiver().getAvatarUrl());
        dto.setContent(message.getMessage());  // Changed from setMessage to setContent
        dto.setIsRead(message.getIsRead());
        dto.setSentAt(message.getCreatedAt());  // Changed from setCreatedAt to setSentAt
        dto.setReadAt(message.getReadAt());
        
        // NEW: Set isCurrentUser for frontend
        dto.setIsCurrentUser(message.getSender().getId().equals(currentUserId));
        
        return dto;
    }
}
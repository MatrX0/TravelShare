package com.proje.maps.service;

import com.proje.maps.dto.*;
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
        
        // Create message
        DirectMessage message = new DirectMessage(sender, receiver, request.getMessage());
        DirectMessage savedMessage = messageRepository.save(message);
        
        return toMessageDTO(savedMessage);
    }
    
    // Get conversation between two users
    public List<DirectMessageDTO> getConversation(Long userId1, Long userId2) {
        // Check if they are friends
        if (!friendshipRepository.areFriends(userId1, userId2)) {
            throw new RuntimeException("You can only view conversations with friends");
        }
        
        List<DirectMessage> messages = messageRepository.findConversationBetween(userId1, userId2);
        return messages.stream()
                .map(this::toMessageDTO)
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
            dto.setUserId(partner.getId());
            dto.setName(partner.getName());
            dto.setEmail(partner.getEmail());
            dto.setAvatarUrl(partner.getAvatarUrl());
            dto.setLastMessage(lastMessage != null ? lastMessage.getMessage() : null);
            dto.setLastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : null);
            dto.setUnreadCount(unreadCount.intValue());
            dto.setIsOnline(false); // TODO: Implement online status
            
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
                .map(this::toMessageDTO)
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
    
    // ==================== HELPER METHODS ====================
    
    private DirectMessageDTO toMessageDTO(DirectMessage message) {
        DirectMessageDTO dto = new DirectMessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setSenderAvatar(message.getSender().getAvatarUrl());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getName());
        dto.setReceiverAvatar(message.getReceiver().getAvatarUrl());
        dto.setMessage(message.getMessage());
        dto.setIsRead(message.getIsRead());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setReadAt(message.getReadAt());
        return dto;
    }
}

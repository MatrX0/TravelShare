import api from "./api";

/* ======================
   CONVERSATIONS (INBOX)
   ====================== */

export const getConversations = () => {
  return api.get("/messages/conversations");
};

/* ======================
   MESSAGES
   ====================== */

export const getMessages = (conversationId, page = 0, size = 30) => {
  return api.get(`/messages/conversations/${conversationId}`, {
    params: { page, size },
  });
};

/* ======================
   SEND MESSAGE
   ====================== */

export const sendMessage = (conversationId, message) => {
  return api.post("/messages/direct-messages", {
    conversationId,
    message,
  });
};

/* ======================
   MARK AS READ
   ====================== */

export const markConversationRead = (conversationId) => {
  return api.put(`/messages/conversations/${conversationId}/read`);
};

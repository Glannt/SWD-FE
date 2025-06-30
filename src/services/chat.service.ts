import { apiPost, apiGet } from "../utils/api";
import {
  AskQuestionRequest,
  AskQuestionResponse,
  ChatSession,
  ChatMessage,
} from "../types/api";

class ChatService {
  private readonly baseUrl = "/chatbot";

  async askQuestion(request: AskQuestionRequest): Promise<AskQuestionResponse> {
    return apiPost<AskQuestionResponse>(`${this.baseUrl}/ask`, request);
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return apiGet<ChatSession[]>("/chatsession");
  }

  async getChatSession(sessionId: string): Promise<ChatSession> {
    return apiGet<ChatSession>(`/chatsession/${sessionId}`);
  }

  async createChatSession(title?: string): Promise<ChatSession> {
    return apiPost<ChatSession>("/chatsession", { title: title || "New Chat" });
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    return apiPost(`/chatsession/${sessionId}/delete`);
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const session = await this.getChatSession(sessionId);
    return session.messages;
  }

  async addMessage(
    sessionId: string,
    content: string,
    sender: "user" | "ai"
  ): Promise<ChatMessage> {
    return apiPost<ChatMessage>("/chatsession/message", {
      sessionId,
      content,
      sender,
    });
  }
}

export const chatService = new ChatService();
export default chatService;

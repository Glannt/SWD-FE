import { useState, useCallback } from "react";
import { chatService } from "../services";
import type {
  ChatMessage,
  ChatSession,
  AskQuestionRequest,
} from "../types/api";

interface UseChatReturn {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  isSending: boolean;
  sendMessage: (message: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  createSession: (title?: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const sessionsData = await chatService.getChatSessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const session = await chatService.getChatSession(sessionId);
      setCurrentSession(session);
      setMessages(session.messages);
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSession = useCallback(async (title?: string) => {
    try {
      const newSession = await chatService.createChatSession(title);
      setCurrentSession(newSession);
      setMessages([]);
      setSessions((prev) => [newSession, ...prev]);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  }, []);

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await chatService.deleteChatSession(sessionId);
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );

        // If deleted session is current session, clear it
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    },
    [currentSession]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      setIsSending(true);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        sender: "user",
        timestamp: new Date().toISOString(),
        sessionId: currentSession?.id || "temp",
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Send to AI
        const request: AskQuestionRequest = {
          question: message,
          sessionId: currentSession?.id,
        };

        const response = await chatService.askQuestion(request);

        // Add AI response
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.answer,
          sender: "ai",
          timestamp: new Date().toISOString(),
          sessionId: response.sessionId,
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Update current session if it's a new session
        if (!currentSession && response.sessionId) {
          const newSession = await chatService.getChatSession(
            response.sessionId
          );
          setCurrentSession(newSession);
          setSessions((prev) => [newSession, ...prev]);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove user message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      } finally {
        setIsSending(false);
      }
    },
    [currentSession]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sessions,
    currentSession,
    isLoading,
    isSending,
    sendMessage,
    loadSessions,
    loadSession,
    createSession,
    deleteSession,
    clearMessages,
  };
};

import { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '@/lib/types';

export function useAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const sendMessage = useCallback(async (text: string, systemInstruction?: string, useSearch: boolean = false) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    
    // Optimistically add user message
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Create placeholder for bot message
    const botMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: 'model', text: "", timestamp: Date.now() },
    ]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      // Create chat with previous history (excluding the new user message we just added to state)
      // We need to use the current 'messages' state which doesn't have the new user message yet
      // because setMessages is async.
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      const result = await chat.sendMessageStream({ message: text });
      
      let fullText = "";
      
      for await (const chunk of result) {
        const chunkResponse = chunk as GenerateContentResponse;
        const chunkText = chunkResponse.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId ? { ...m, text: fullText } : m
            )
          );
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, text: "Sorry, I encountered an error. Please try again." } : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, [messages]);

  return { messages, sendMessage, isGenerating };
}

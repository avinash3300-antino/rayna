"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { getSessionId, setSessionId, clearSessionId } from "@/lib/session";
import { HISTORY_LIMIT } from "@/lib/constants";
import { parseTourDataFromText, createMockTourCarousel, parseJsonTourData } from "@/lib/tourUtils";
import type { Message } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  // On mount: restore chat history if we have a saved session
  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) {
      api
        .getHistory(sessionId, HISTORY_LIMIT)
        .then((data) => {
          if (data.messages.length > 0) {
            setMessages(data.messages);
          }
        })
        .catch(() => {
          // Session expired server-side, clear stale ID
          clearSessionId();
        });
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    setError(null);

    // Optimistically add user message
    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const sessionId = getSessionId() || undefined;
      const response = await api.sendMessage(content, sessionId);

      // Persist session ID
      setSessionId(response.session_id);

                  // Process the response to extract or create tour carousel
      let tourCarousel = response.tourCarousel;
      let processedContent = response.message;
      
                                                      // Enhanced tour detection - show carousel for both actual data AND tour questions
      const hasRealTourData = !tourCarousel && response.message && (
        // JSON tour data detection (when backend returns structured data)
        response.message.includes('"type":"tour_carousel"') ||
        response.message.includes('"cards":[') ||
        response.message.includes('```json') ||
        (response.message.includes('"title"') && response.message.includes('"image"') && response.message.includes('"url"')) ||
        
        // Emoji-structured format detection (Singapore/other destinations)
        (response.message.includes('⭐') && response.message.includes('💰') && response.message.includes('🔗') && response.message.includes('---')) ||
        
        // Table format detection with actual tour data
        (response.message.includes('|---|') && (
          response.message.includes('AED ') || 
          response.message.includes('USD ') ||
          response.message.includes('SGD ') ||
          response.message.includes('INR ')
        )) ||
        
        // Structured tour listings with prices and ratings
        (response.message.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/) && (
          response.message.includes('⭐') || response.message.includes('★')
        ))
      );
      
      // Also check if user is asking about tours (even without structured data)
      const isTourQuestion = !tourCarousel && !hasRealTourData && content.toLowerCase().includes('tour') && (
        content.toLowerCase().includes('dubai') ||
        content.toLowerCase().includes('singapore') ||
        content.toLowerCase().includes('thailand') ||
        content.toLowerCase().includes('malaysia')
      ) && (
        content.toLowerCase().includes('plan') ||
        content.toLowerCase().includes('available') ||
        content.toLowerCase().includes('show me') ||
        content.toLowerCase().includes('any') ||
        content.toLowerCase().includes('what') ||
        content.toLowerCase().includes('which')
      );
      
                  if (hasRealTourData || isTourQuestion) {
                // First try to parse JSON tour data (priority)
        tourCarousel = parseJsonTourData(response.message) || undefined;
        
        // If no JSON found, try to parse table format
        if (!tourCarousel) {
          tourCarousel = parseTourDataFromText(response.message) || undefined;
        }
        
        // If still no data but user asked a tour question, show relevant tours
        if (!tourCarousel && isTourQuestion) {
          let carouselTitle = 'Featured Tours';
          
          if (content.toLowerCase().includes('dubai')) {
            carouselTitle = 'Dubai Tours';
            if (content.toLowerCase().includes('desert')) {
              carouselTitle = 'Desert Safari Tours';
            } else if (content.toLowerCase().includes('city')) {
              carouselTitle = 'Dubai City Tours';
            } else if (content.toLowerCase().includes('water')) {
              carouselTitle = 'Water Activities in Dubai';
            }
          } else if (content.toLowerCase().includes('singapore')) {
            carouselTitle = 'Singapore Tours';
          } else if (content.toLowerCase().includes('thailand')) {
            carouselTitle = 'Thailand Tours';
          } else if (content.toLowerCase().includes('malaysia')) {
            carouselTitle = 'Malaysia Tours';
          }
          
          tourCarousel = createMockTourCarousel(carouselTitle);
          
          // Add helpful message for tour questions
          if (!processedContent.toLowerCase().includes('here are')) {
            processedContent = `Yes! Here are some popular ${carouselTitle.toLowerCase()} available:\n\n${processedContent}`;
          }
        }
        
                        // Clean up the message content when we have tour data
        if (tourCarousel) {
          // Remove various tour data formats from the text
          processedContent = response.message
            .replace(/```json[\s\S]*?```/g, '') // Remove JSON code blocks
            .replace(/\{[\s\S]*?"type"\s*:\s*"tour_carousel"[\s\S]*?\}/g, '') // Remove raw JSON
            .replace(/---[\s\S]*?(?=\n\n|Would you like|$)/g, '') // Remove emoji-structured tour data
            .replace(/🏙️[\s\S]*?🔗\s*https?:\/\/[^\s\n]+/g, '') // Remove individual tour entries
            .replace(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/g, '') // Remove table rows
            .replace(/\|---|/g, '') // Remove table separators
            .replace(/-{3,}/g, '') // Remove separator lines
            .replace(/#{1,3}\s*[^\n]+/g, '') // Remove markdown headers
            .replace(/Would you like to:[\s\S]*$/g, '') // Remove follow-up questions
            .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
            .replace(/\s*\n\s*\n\s*/g, '\n\n') // Normalize spacing
            .trim();
            
          // If content is mostly empty after cleaning, provide a better message
          if (!processedContent || processedContent.length < 80) {
            const location = tourCarousel.cards[0]?.location || 'your destination';
            processedContent = `Here are ${tourCarousel.cards.length} amazing tours in ${location}! 🎆✨\n\nBrowse through these exciting experiences and click any card to book:`;
          }
        }
      }
      
            // Tour carousel now supports multiple destinations dynamically
      
      // Add assistant response
      const assistantMsg: Message = {
        role: "assistant",
        content: processedContent,
        tourCarousel: tourCarousel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setShouldScrollToBottom(true);
        } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      
      let chatErrorMessage: string;
      
      if (errorMessage.includes("Too many")) {
        chatErrorMessage = "I'm receiving messages too quickly. Please wait a moment before sending another message. 🕐";
      } else if (errorMessage.includes("timeout") || errorMessage.includes("ECONNABORTED")) {
        chatErrorMessage = "I'm taking longer than usual to respond. This might be due to high demand. Please try asking again. ⏱️";
      } else if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        chatErrorMessage = "I'm having trouble connecting right now. Please check your internet connection and try again. 🌐";
      } else if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
        chatErrorMessage = "I'm experiencing some technical difficulties. Please try again in a moment, or visit raynatours.com for assistance. 🔧";
      } else {
        chatErrorMessage = "I encountered an issue processing your request. Please try rephrasing your question or visit raynatours.com for assistance. 💫";
      }
      
      // Add error as assistant message instead of showing error banner
      const errorMsg: Message = {
        role: "assistant",
        content: chatErrorMessage,
      };
            setMessages((prev) => [...prev, errorMsg]);
      setShouldScrollToBottom(true);
      
      // Clear any existing error state
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(async () => {
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await api.clearSession(sessionId);
      } catch {
        // Ignore — session may already be expired
      }
    }
    clearSessionId();
    setMessages([]);
    setError(null);
  }, []);

  // Reset scroll trigger after it's been consumed
  const consumeScrollTrigger = useCallback(() => {
    setShouldScrollToBottom(false);
  }, []);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    shouldScrollToBottom,
    consumeScrollTrigger 
  };
}

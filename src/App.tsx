import React, { useState, useCallback, useRef } from "react";
import { Send, Plus, History, Settings } from "lucide-react";
import { ChatMessage } from "./components/ChatMessage";
import { HistoryItem } from "./components/HistoryItem";
import { Message, ChatHistory } from "./types";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      content: trimmedInput,
      role: "user",
      timestamp: new Date(),
    };

    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      const response = await retryWithExponentialBackoff(async () => {
        return await axios.post(
          "https://api.echogpt.live/v1/chat/completions",
          {
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: trimmedInput },
            ],
            model: "EchoGPT",
          },
          {
            headers: {
              "x-api-key": `${import.meta.env.VITE_ECHOGPT_API_KEY}`,
            },
          }
        );
      });

      const responseContent =
        response.data.choices[0]?.message?.content || "No response received";

      const assistantMessage: Message = {
        id: `${messageId}-response`,
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      scrollToBottom();

      const newHistory: ChatHistory = {
        id: messageId,
        title:
          trimmedInput.slice(0, 30) + (trimmedInput.length > 30 ? "..." : ""),
        lastMessage:
          responseContent.slice(0, 50) +
          (responseContent.length > 50 ? "..." : ""),
        timestamp: new Date(),
        messages: [...messages, userMessage, assistantMessage], // Save the messages in history
      };

      setHistory((prev) => [newHistory, ...prev]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: `${messageId}-error`,
        content:
          "Sorry, there was an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, scrollToBottom, messages]);

  const retryWithExponentialBackoff = async (fn, retries = 5, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0 || error.response?.status !== 429) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
    }
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const startNewChat = useCallback(() => {
    setMessages([]);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        title: "New Chat",
        lastMessage: "Start a new conversation",
        timestamp: new Date(),
        messages: [],
      },
      ...prev,
    ]);
  }, []);

  const loadChatHistory = useCallback((historyItem: ChatHistory) => {
    setMessages(historyItem.messages);
    setIsHistoryOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-white">
      {/* Side Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white border-r transform ${
          isHistoryOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-20`}
      >
        <div className="p-4 border-b">
          <button
            className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors"
            onClick={startNewChat}
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {history.map((item) => (
            <HistoryItem
              key={item.id}
              history={item}
              onClick={() => loadChatHistory(item)}
            />
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-6 bg-white">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="md:hidden"
          >
            <History size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
          <button>
            <Settings size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className={`p-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

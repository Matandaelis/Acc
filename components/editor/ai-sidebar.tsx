import { ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, X, Globe, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface AISidebarProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, isResearch: boolean) => void;
  isGenerating: boolean;
}

export function AISidebar({ messages, onSendMessage, isGenerating }: AISidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isResearchMode, setIsResearchMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input, isResearchMode);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) {
    return (
      <div className="w-12 border-l border-zinc-200 bg-zinc-50/50 flex flex-col items-center py-4 h-full">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50">
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-zinc-200 bg-zinc-50/50 flex flex-col h-full z-10">
      <div className="h-12 border-b border-zinc-200 flex items-center justify-between px-4 bg-white/50">
        <div className="flex items-center gap-2 text-zinc-900">
          <Sparkles className="h-4 w-4 text-zinc-500" />
          <span className="font-semibold text-xs uppercase tracking-wider text-zinc-600">Research Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 -mr-2" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 pt-4">
        <button
          onClick={() => setIsResearchMode(!isResearchMode)}
          className={cn(
            "w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all border",
            isResearchMode
              ? "bg-zinc-900 border-zinc-900 text-white"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100"
          )}
        >
          {isResearchMode ? <Globe className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
          <span>{isResearchMode ? "Research Mode Active" : "Enable Research Mode"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center py-12 px-4 border border-dashed border-zinc-300 rounded-lg bg-white mt-4">
            <div className="bg-zinc-100 h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-600 font-medium">How can I help you today?</p>
            <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">Ask me to brainstorm, outline, or proofread your document. Toggle Research Mode to search academic sources.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[90%] rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed",
                msg.role === "user"
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-800 shadow-sm"
              )}
            >
              {msg.role === "model" ? (
                <div className="prose prose-sm prose-zinc max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-200 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            className="w-full pl-3 pr-10 py-2.5 text-[13px] border-zinc-200 rounded-md focus-visible:ring-1 focus-visible:ring-zinc-400 transition-all min-h-[44px] max-h-[120px] resize-none bg-zinc-50"
            placeholder={isResearchMode ? "Enter research topic..." : "Ask AI..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1.5 bottom-1.5 h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-sm"
            disabled={!input.trim() || isGenerating}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

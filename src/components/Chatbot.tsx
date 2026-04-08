"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, User, Bot, AlertCircle } from "lucide-react";
import { chatWithAI } from "@/ai/flows/chat-flow";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "model";
  text: string;
};

interface ChatError {
  hasError: boolean;
  message: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "model", text: "Hi! I'm Khizer's AI assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<ChatError | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatWithAI({
        message: userMessage,
        history: messages
      });
      setMessages([...newMessages, { role: "model", text: response }]);
    } catch (err) {
      setError({
        hasError: true,
        message: "Unable to reach AI assistant. Please try again.",
      });
      setMessages([...newMessages, { role: "model", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 glass border-primary/20">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-full text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Portfolio Assistant</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full h-8 w-8 shrink-0 flex items-center justify-center border",
                      msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                    )}>
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user" 
                        ? "bg-accent/10 border border-accent/20 rounded-tr-none" 
                        : "bg-primary/10 border border-primary/20 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 mr-auto">
                    <div className="p-2 rounded-full h-8 w-8 shrink-0 flex items-center justify-center bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-primary/10 border border-primary/20 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs italic text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t bg-secondary/20">
            <form onSubmit={handleSend} className="flex w-full gap-2">
              <Input
                placeholder="Ask me anything about Khizer..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 rounded-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl animate-bounce hover:animate-none bg-primary hover:bg-primary/90 text-white"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
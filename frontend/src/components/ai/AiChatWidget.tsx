import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { aiService } from '../../api/ai';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'ai', content: 'Hello! I am your Fleet Assistant. How can I help you manage your fleet today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Only show the widget for Fleet Managers and Dispatchers
  if (!user || (user.role !== 'FleetManager' && user.role !== 'Dispatcher')) {
    return null;
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await aiService.chat(userMessage.content);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: reply }]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sorry, I encountered an error connecting to the server.';
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: `**Error:** ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex flex-col w-[350px] sm:w-[400px] h-[500px] max-h-[calc(100vh-100px)] bg-background border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-semibold">AI Fleet Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/90 hover:text-white" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-lg bg-muted text-sm flex items-center gap-2 text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-background">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your fleet..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* FAB Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquare size={24} />
        </Button>
      )}
    </div>
  );
}

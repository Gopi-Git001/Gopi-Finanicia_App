import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const API_URL = "/api/ai/chat/";
const suggestedPrompts = [
  "What's the best insurance plan for me?",
  "How do I improve my credit score?",
  "Show me my insurance policies",
  "What loans am I eligible for?",
  "Compare auto insurance rates",
  "Help me file a claim"
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'ai',
    content: 'Hi! How can I help you today? I can assist you with insurance questions, loan applications, credit score advice, and more.',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Health‑check on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai/health/");
        if (!res.ok) throw new Error();
        setConnectionError(false);
      } catch {
        setConnectionError(true);
        setMessages(prev => [...prev, {
          id: 'connection-error',
          type: 'ai',
          content: "⚠️ Backend server not reachable. Please ensure:\n1. Django server is running on port 8000\n2. You've restarted the React server after adding the proxy",
          timestamp: new Date()
        }]);
      }
    })();
  }, []);

  // Auto‑scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || connectionError) return;
    const userMessage = { id: Date.now().toString(), type: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || err.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const aiMessage = { id: (Date.now() + 1).toString(), type: 'ai', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      const msg = (e as Error).message.includes('404')
        ? "Endpoint not found. Check Django URLs & Vite proxy."
        : `Error: ${(e as Error).message}`;
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), type: 'ai', content: msg, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedPrompt = (p: string) => sendMessage(p);
  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="swiss-section">
      <div className="swiss-container max-w-4xl">
        {connectionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Connection Error!</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Django server on port 8000</li>
              <li>Restarted React after proxy changes</li>
              <li>Check browser console</li>
            </ul>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="mb-4">AI Financial Assistant</h1>
          <p className="text-xl text-muted-foreground">
            Get instant answers and personalized financial advice 24/7
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Financial Assistant</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${connectionError ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm text-muted-foreground">
                    {connectionError ? 'Offline' : 'Online'}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Talk to a human</span>
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex space-x-3 max-w-[80%] ${m.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/10'
                  }`}>
                    {m.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-accent" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    m.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{m.content}</p>
                    <span className={`text-xs mt-2 block ${
                      m.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>{formatTime(m.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && !connectionError && (
            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((p,i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => handleSuggestedPrompt(p)}>
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder={connectionError ? "Fix backend connection first..." : "Type your message..."}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isTyping && !connectionError && sendMessage(inputMessage)}
                disabled={isTyping || connectionError}
              />
              <Button onClick={() => sendMessage(inputMessage)} disabled={isTyping || connectionError || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-center mb-8">What I can help you with</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Instant Answers</h3>
                <p className="text-sm text-muted-foreground">
                  Get immediate responses to your financial questions, available 24/7.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Personalized Advice</h3>
                <p className="text-sm text-muted-foreground">
                  Recommendations tailored to your financial profile and goals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Human Escalation</h3>
                <p className="text-sm text-muted-foreground">
                  Seamlessly connect with human agents when you need extra help.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

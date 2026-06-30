import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  status: 'idle' | 'generating' | 'error';
  onClear: () => void;
}

export default function ChatPanel({ messages, onSendMessage, status, onClear }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === 'idle') {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 border-r border-zinc-200 w-full max-w-sm">
      <div className="p-4 border-bottom border-zinc-200 flex justify-between items-center bg-white">
        <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Chat Assistant
        </h2>
        <button 
          onClick={onClear}
          className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500 transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col gap-2",
                message.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "flex items-center gap-2 mb-1",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  message.role === 'user' ? "bg-indigo-100 text-indigo-700" : "bg-zinc-800 text-white"
                )}>
                  {message.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {message.role === 'user' ? 'You' : 'Previewer AI'}
                </span>
              </div>
              
              <div className={cn(
                "max-w-[90%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                message.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none"
              )}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {status === 'generating' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-zinc-500 text-sm italic"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating your website...
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-zinc-200">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe your website..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none min-h-[100px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || status === 'generating'}
            className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-center text-zinc-400">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

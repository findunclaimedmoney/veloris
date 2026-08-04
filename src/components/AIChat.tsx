import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function AIChat({ role, contextUserId }: { role: string; contextUserId?: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const sendMessage = useMutation(api.chat.sendCustomerServiceMessage);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    const response = await sendMessage({ message: input, role, contextUserId });
    setMessages(prev => [...prev, { role: 'ai', content: response.reply }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-96 bg-black/30 rounded-xl border border-white/10 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-pink-500/30 text-white' : 'bg-white/10 text-slate-300'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-slate-500 text-sm text-center mt-8">Ask about your account, credits, earnings, or any issue.</div>}
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your question..." className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500" />
        <button onClick={handleSend} className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition">Send</button>
      </div>
    </div>
  );
}
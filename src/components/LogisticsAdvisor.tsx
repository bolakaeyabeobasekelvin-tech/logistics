import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Bot, User, CornerDownLeft, ShieldCheck, Mail, Phone, RefreshCw, Layers } from "lucide-react";

const PRESET_QUESTIONS = [
  { label: "US Customs Food Rules", query: "Can I ship food items or spirits from the UK to the US? What are the FDA requirements?" },
  { label: "Duty Free Limits (De Minimis)", query: "What are the import de minimis limits for the US and UK customs tax exemption?" },
  { label: "GDPR & CCPA Compliance", query: "Explain GDPR and CCPA consumer tracking data policies for cargo monitoring." },
  { label: "GMB Partner Network Details", query: "Who is Transglobal Express and what GMB reviews or shipping options do you share?" }
];

export default function LogisticsAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-msg-1",
      sender: "advisor",
      text: "Welcome to Transatlantic Express Support. I am your AI Customs Compliance & Transatlantic Logistics Advisor. I can assist with international import/export regulations, customs duties (HMRC / US CBP), and logistical compliance handled by our GMB operational partner **Transglobal Express Ltd**.\n\nType a custom query or select one of the regulatory preset tags below to get started.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = "msg-" + Date.now();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();
      
      const advisorMessage: ChatMessage = {
        id: "msg-adv-" + Date.now(),
        sender: "advisor",
        text: data.response || "No response received. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, advisorMessage]);
    } catch (error) {
      console.error("Failed to query AI advisor route:", error);
      const errorMessage: ChatMessage = {
        id: "msg-err-" + Date.now(),
        sender: "advisor",
        text: "My apologies. I encountered a pipeline connection error. Please write directly to ship@transatlanticexpress.com or call our hotline 260-270-7501 to connect with an operational dispatcher immediately.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (query: string) => {
    if (isLoading) return;
    handleSendMessage(query);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center bg-gradient-to-r from-neutral-50 to-neutral-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold relative animate-pulse">
            <Bot className="w-5 h-5" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 leading-none">Customs & Compliance AI Assistant</h3>
            <p className="text-[11px] text-neutral-500 leading-tight mt-1">Transatlantic Logistics Registry Advisor</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured Sandbox Environment</span>
        </div>
      </div>

      {/* Message Screen */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.sender === "user" ? "bg-neutral-900 text-white" : "bg-emerald-600 text-white"
            }`}>
              {msg.sender === "user" ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            {/* Bubble contents */}
            <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
              msg.sender === "user" 
                ? "bg-neutral-900 text-neutral-100 rounded-tr-none text-right" 
                : "bg-white text-neutral-800 border border-neutral-200 rounded-tl-none whitespace-pre-wrap"
            }`}>
              
              {/* Actual Text */}
              <div className="font-sans prose max-w-none text-left">
                {msg.text}
              </div>

              {/* Timestamp label */}
              <p className={`text-[9px] mt-1.5 font-mono ${
                msg.sender === "user" ? "text-neutral-400" : "text-neutral-400"
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 text-xs bg-white text-neutral-500 border border-neutral-200 rounded-tl-none animate-pulse">
              Consulting transatlantic customs manifest rules...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset question chips */}
      <div className="p-3 bg-white border-t border-neutral-100">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Preset Regulatory Queries</p>
        <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handlePresetClick(pq.query)}
              className="px-2.5 py-1 text-[11px] text-neutral-700 bg-neutral-100 hover:bg-neutral-950 hover:text-white border border-neutral-200 hover:border-neutral-950 font-medium rounded-full transition-all cursor-pointer disabled:opacity-50"
            >
              {pq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 border-t border-neutral-200 bg-neutral-50 flex gap-2 items-center"
      >
        <input
          type="text"
          disabled={isLoading}
          className="flex-1 bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-950 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          placeholder="Ask about tariffs, CCPA/GDPR compliance, hazardous items or carrier Partner rules..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-neutral-950 hover:bg-emerald-600 disabled:bg-neutral-300 text-white p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      
    </div>
  );
}

import bobMascot from '@/assets/bob-mascot.png';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isBob = message.role === 'assistant';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      {/* Bob's Avatar */}
      {isBob && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
          <img 
            src={bobMascot} 
            alt="Bob" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Message Content */}
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${
        isUser ? 'user-bubble' : 'bob-bubble'
      }`}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        
        <div className={`text-xs mt-2 ${
          isUser ? 'text-secondary-foreground/70' : 'text-primary-foreground/70'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-secondary">
          <span className="text-lg">👤</span>
        </div>
      )}
    </div>
  );
}
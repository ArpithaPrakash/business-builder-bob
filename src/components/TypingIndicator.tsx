import bobMascot from '@/assets/bob-mascot.png';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-fade-in-up">
      {/* Bob's Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
        <img 
          src={bobMascot} 
          alt="Bob" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Typing Animation */}
      <div className="bob-bubble">
        <div className="flex items-center gap-1">
          <span className="text-sm text-primary-foreground/80">Bob is thinking</span>
          <div className="flex gap-1">
            <div 
              className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-typing-dots"
              style={{animationDelay: '0ms'}}
            ></div>
            <div 
              className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-typing-dots"
              style={{animationDelay: '200ms'}}
            ></div>
            <div 
              className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-typing-dots"
              style={{animationDelay: '400ms'}}
            ></div>
          </div>
        </div>
        
        {/* Construction animations */}
        <div className="flex justify-center mt-2 gap-2">
          <span className="text-lg animate-bounce">🔨</span>
          <span className="text-lg animate-pulse">⚡</span>
        </div>
      </div>
    </div>
  );
}
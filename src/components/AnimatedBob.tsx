import { useEffect, useState } from 'react';
import bobMascot from '@/assets/bob-mascot.png';

interface AnimatedBobProps {
  isActive?: boolean;
}

export default function AnimatedBob({ isActive = true }: AnimatedBobProps) {
  const [position, setPosition] = useState({ x: 10, y: 20 });
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [currentAction, setCurrentAction] = useState<'running' | 'building' | 'thinking'>('running');

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + (direction * 2);
        let newDirection = direction;
        
        // Bounce off walls
        if (newX > 85) {
          newDirection = -1;
          newX = 85;
        } else if (newX < 5) {
          newDirection = 1;
          newX = 5;
        }
        
        setDirection(newDirection);
        
        // Random action changes
        if (Math.random() < 0.02) {
          const actions: ('running' | 'building' | 'thinking')[] = ['running', 'building', 'thinking'];
          setCurrentAction(actions[Math.floor(Math.random() * actions.length)]);
        }
        
        return { 
          x: newX, 
          y: Math.max(15, Math.min(25, prev.y + (Math.random() - 0.5) * 1))
        };
      });
    }, 100);

    // Reset to running after other actions
    const actionTimer = setInterval(() => {
      if (currentAction !== 'running') {
        setCurrentAction('running');
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(actionTimer);
    };
  }, [isActive, direction, currentAction]);

  const getActionEmoji = () => {
    switch (currentAction) {
      case 'building': return '🔨';
      case 'thinking': return '💭';
      default: return '🏃‍♂️';
    }
  };

  const getAnimationClass = () => {
    switch (currentAction) {
      case 'building': return 'hammer-swing';
      case 'thinking': return 'animate-pulse';
      default: return 'bob-bounce';
    }
  };

  return (
    <div 
      className="fixed z-50 pointer-events-none transition-all duration-300"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `scaleX(${direction})`,
      }}
    >
      {/* Bob character */}
      <div className={`relative ${getAnimationClass()}`}>
        <div className="flex items-center gap-1">
          {/* Bob's image */}
          <img 
            src={bobMascot} 
            alt="Bob running around" 
            className="w-12 h-12 rounded-full border-2 border-primary shadow-lg bg-card"
          />
          
          {/* Action indicator */}
          <span className="text-lg animate-bounce" style={{animationDelay: '0.2s'}}>
            {getActionEmoji()}
          </span>
        </div>
        
        {/* Speech bubble for special actions */}
        {currentAction !== 'running' && (
          <div className="absolute -top-8 -right-2 bg-card text-primary text-xs px-2 py-1 rounded-lg border shadow-lg animate-fade-in-up">
            {currentAction === 'building' && "Building!"}
            {currentAction === 'thinking' && "Hmm..."}
          </div>
        )}
        
        {/* Dust trail when running */}
        {currentAction === 'running' && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex gap-1">
              <span className="text-xs opacity-60 animate-bounce" style={{animationDelay: '0ms'}}>💨</span>
              <span className="text-xs opacity-40 animate-bounce" style={{animationDelay: '100ms'}}>💨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
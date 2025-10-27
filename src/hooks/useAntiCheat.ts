import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AntiCheatEvent {
  type: 'tab_switch' | 'fullscreen_exit';
  timestamp: number;
  details?: string;
}

interface UseAntiCheatOptions {
  userId: string;
  attemptId?: string;
  maxWarnings?: number;
  onMaxWarningsReached?: () => void;
  onWarning?: (event: AntiCheatEvent) => void;
  requireFullscreen?: boolean;
}

export function useAntiCheat({
  userId,
  attemptId,
  maxWarnings = 3,
  onMaxWarningsReached,
  onWarning,
  requireFullscreen = true,
}: UseAntiCheatOptions) {
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasLeftTab, setHasLeftTab] = useState(false);
  const eventsRef = useRef<AntiCheatEvent[]>([]);
  const hasEnteredFullscreenOnce = useRef(false);
  const warningsRef = useRef(0);
  const lastWarningTime = useRef<Record<string, number>>({});

  // Keep warningsRef in sync with warnings state
  useEffect(() => {
    warningsRef.current = warnings;
  }, [warnings]);

  // Log event to database
  const logEvent = async (event: AntiCheatEvent) => {
    eventsRef.current.push(event);

    try {
      await supabase.from('anti_cheat_logs').insert({
        user_id: userId,
        attempt_id: attemptId,
        event_type: event.type,
        event_details: event.details,
        timestamp: new Date(event.timestamp).toISOString(),
      });
    } catch (error) {
      
    }
  };

  // Add warning
  const addWarning = (event: AntiCheatEvent) => {
    const now = Date.now();
    const lastTime = lastWarningTime.current[event.type] || 0;
    
    // Debounce: prevent duplicate warnings within 2 seconds
    if (now - lastTime < 2000) {
      console.log('⏭️ Skipping duplicate warning (debounced):', event.type);
      return;
    }
    
    lastWarningTime.current[event.type] = now;
    
    const newWarningCount = warningsRef.current + 1;
    
    console.log('⚠️ Adding warning:', {
      type: event.type,
      newCount: newWarningCount,
      maxWarnings,
      details: event.details
    });

    logEvent(event);

    if (onWarning) {
      console.log('📢 Calling onWarning callback with event:', event);
      onWarning(event);
    }
    
    setWarnings(newWarningCount);

    if (newWarningCount >= maxWarnings && onMaxWarningsReached) {
      console.log('🚨 Max warnings reached, calling onMaxWarningsReached');
      setTimeout(() => {
        onMaxWarningsReached();
      }, 100);
    }
  };

  // Request fullscreen
  const requestFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (error) {
      
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔍 Tab switch detected - visibility changed to hidden');
        setHasLeftTab(true);
        addWarning({
          type: 'tab_switch',
          timestamp: Date.now(),
          details: 'User switched tabs or minimized window',
        });
      } else {
        console.log('✅ User returned to tab');
        setHasLeftTab(false);
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      console.log('🖥️ Fullscreen change detected:', isCurrentlyFullscreen ? 'Entered' : 'Exited');
      setIsFullscreen(isCurrentlyFullscreen);

      if (isCurrentlyFullscreen) {
        hasEnteredFullscreenOnce.current = true;
      }

      if (!isCurrentlyFullscreen && requireFullscreen && hasEnteredFullscreenOnce.current) {
        console.log('⚠️ Fullscreen exit violation detected');
        addWarning({
          type: 'fullscreen_exit',
          timestamp: Date.now(),
          details: 'User exited fullscreen mode',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Don't automatically request fullscreen - it must be triggered by user action
    // Users can manually enter fullscreen if needed

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [userId, attemptId, requireFullscreen]);

  return {
    warnings,
    isFullscreen,
    hasLeftTab,
    requestFullscreen,
    events: eventsRef.current,
  };
}
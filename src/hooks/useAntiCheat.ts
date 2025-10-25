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
      console.error('Failed to log anti-cheat event:', error);
    }
  };

  // Add warning
  const addWarning = (event: AntiCheatEvent) => {
    logEvent(event);
    
    const newWarningCount = warnings + 1;
    setWarnings(newWarningCount);

    if (onWarning) {
      onWarning(event);
    }

    if (newWarningCount >= maxWarnings && onMaxWarningsReached) {
      onMaxWarningsReached();
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
      console.error('Failed to enter fullscreen:', error);
    }
  };

  useEffect(() => {
    // Tab visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setHasLeftTab(true);
        addWarning({
          type: 'tab_switch',
          timestamp: Date.now(),
          details: 'User switched tabs or minimized window',
        });
      }
    };

    // Fullscreen change detection
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      // Only track fullscreen exit if user has entered fullscreen at least once
      if (isCurrentlyFullscreen) {
        hasEnteredFullscreenOnce.current = true;
      }

      if (!isCurrentlyFullscreen && requireFullscreen && hasEnteredFullscreenOnce.current) {
        addWarning({
          type: 'fullscreen_exit',
          timestamp: Date.now(),
          details: 'User exited fullscreen mode',
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Request fullscreen on mount if required
    if (requireFullscreen) {
      requestFullscreen();
    }

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [userId, attemptId, warnings, requireFullscreen]);

  return {
    warnings,
    isFullscreen,
    hasLeftTab,
    requestFullscreen,
    events: eventsRef.current,
  };
}
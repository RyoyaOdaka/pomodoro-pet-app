import { useReducer, useEffect, useRef } from 'react';
import type { TimerState, TimerAction, Settings } from '../types';

function createInitialState(settings: Settings): TimerState {
  return {
    mode: 'work',
    status: 'idle',
    timeLeft: settings.workDuration * 60, // convert minutes to seconds
    sessionsCompleted: 0,
    currentSession: 1,
  };
}

function createTimerReducer(settings: Settings) {
  const WORK_TIME = settings.workDuration * 60;
  const BREAK_TIME = settings.breakDuration * 60;
  const LONG_BREAK_TIME = settings.longBreakDuration * 60;
  const SESSIONS_UNTIL_LONG_BREAK = settings.sessionsUntilLongBreak;

  return function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
      case 'START':
        return { ...state, status: 'running' };

      case 'PAUSE':
        return { ...state, status: 'paused' };

      case 'RESET':
        return {
          ...createInitialState(settings),
          sessionsCompleted: state.sessionsCompleted,
          currentSession: state.currentSession,
        };

      case 'TICK':
        if (state.timeLeft <= 1) {
          return state;
        }
        return { ...state, timeLeft: state.timeLeft - 1 };

      case 'COMPLETE_SESSION':
        return {
          ...state,
          sessionsCompleted: state.mode === 'work' ? state.sessionsCompleted + 1 : state.sessionsCompleted,
        };

      case 'SWITCH_MODE': {
        let newMode: 'work' | 'break' | 'longBreak';
        let newTime: number;
        let newSession = state.currentSession;

        if (state.mode === 'work') {
          // Work finished, decide if it's a short break or long break
          if (state.currentSession >= SESSIONS_UNTIL_LONG_BREAK) {
            newMode = 'longBreak';
            newTime = LONG_BREAK_TIME;
          } else {
            newMode = 'break';
            newTime = BREAK_TIME;
          }
        } else if (state.mode === 'longBreak') {
          // Long break finished, reset to session 1
          newMode = 'work';
          newTime = WORK_TIME;
          newSession = 1;
        } else {
          // Short break finished, move to next session
          newMode = 'work';
          newTime = WORK_TIME;
          newSession = state.currentSession + 1;
        }

        return {
          ...state,
          mode: newMode,
          timeLeft: newTime,
          currentSession: newSession,
          status: 'idle',
        };
      }

      default:
        return state;
    }
  };
}

export function useTimer(settings: Settings, onSessionComplete?: () => void) {
  const reducerRef = useRef(createTimerReducer(settings));
  const initialStateRef = useRef(createInitialState(settings));

  // Update reducer when settings change
  useEffect(() => {
    reducerRef.current = createTimerReducer(settings);
  }, [settings]);

  const [state, dispatch] = useReducer(reducerRef.current, initialStateRef.current);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.status === 'running') {
      intervalRef.current = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.status]);

  // Check if session is complete
  useEffect(() => {
    if (state.timeLeft === 0 && state.status === 'running') {
      dispatch({ type: 'COMPLETE_SESSION' });
      if (state.mode === 'work' && onSessionComplete) {
        onSessionComplete();
      }
      dispatch({ type: 'SWITCH_MODE' });
    }
  }, [state.timeLeft, state.status, state.mode, onSessionComplete]);

  const start = () => dispatch({ type: 'START' });
  const pause = () => dispatch({ type: 'PAUSE' });
  const reset = () => dispatch({ type: 'RESET' });

  return {
    ...state,
    start,
    pause,
    reset,
  };
}

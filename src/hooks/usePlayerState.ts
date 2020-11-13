import { secondsToMs } from '../utils';
import type { ICurrentStatus, IPlayerState, IPlayerStateKey } from '../types';

const playerStates: Record<string, IPlayerState | undefined> = {};

const initialPlayerState: IPlayerState = {
  playerId: undefined,
  currentStatus: undefined,
  currentTime: 0,
  isFullscreen: false,
  isPaused: false,
  sourceWidth: 0,
  sourceHeight: 0,
  duration: 0,
};

const saveStateForPlayer = (
  playerId: string,
  key: IPlayerStateKey,
  value: any
) => {
  playerStates[playerId] = playerStates[playerId] || initialPlayerState;
  (playerStates[playerId]![key] as any) = value;
};

const getStateForPlayer = (playerId: string, key: IPlayerStateKey) => {
  return playerStates[playerId] && playerStates[playerId]![key];
};

export function usePlayerState(playerId: string) {
  const setStatus = (status: ICurrentStatus) =>
    saveStateForPlayer(playerId, 'currentStatus', status);

  const getStatus = () =>
    getStateForPlayer(playerId, 'currentStatus') as ICurrentStatus;

  const getCurrentTime = () =>
    getStateForPlayer(playerId, 'currentTime') as number;

  const setCurrentTime = (currentTime: number) =>
    saveStateForPlayer(playerId, 'currentTime', secondsToMs(currentTime));

  const getDuration = () => getStateForPlayer(playerId, 'duration') as number;

  const setDuration = (duration: number) =>
    saveStateForPlayer(playerId, 'duration', secondsToMs(duration));

  const getSourceWidth = () =>
    getStateForPlayer(playerId, 'sourceWidth') as number;

  const getSourceHeight = () =>
    getStateForPlayer(playerId, 'sourceHeight') as number;

  const getIsPaused = () => getStateForPlayer(playerId, 'isPaused') as boolean;

  const setSourceWidth = (width: number) =>
    saveStateForPlayer(playerId, 'sourceWidth', width);

  const setSourceHeight = (height: number) =>
    saveStateForPlayer(playerId, 'sourceHeight', height);

  const getLastRateChange = () =>
    getStateForPlayer(playerId, 'lastRateChange') as number;

  const setLastRateChange = (playbackRate: number) =>
    saveStateForPlayer(playerId, 'lastRateChange', playbackRate);

  const getIsFullscreen = () =>
    getStateForPlayer(playerId, 'isFullscreen') as boolean;

  const setIsFullscreen = (isFullscreen: boolean) =>
    saveStateForPlayer(playerId, 'isFullscreen', isFullscreen);

  const destroy = () => delete playerStates.playerId;

  return {
    setStatus,
    getStatus,
    getCurrentTime,
    setCurrentTime,
    getDuration,
    setDuration,
    getIsPaused,
    getSourceWidth,
    getSourceHeight,
    setSourceWidth,
    setSourceHeight,
    getLastRateChange,
    setLastRateChange,
    getIsFullscreen,
    setIsFullscreen,
    destroy,
  };
}

import mux from 'mux-embed';
import { secondsToMs } from '../utils';

export function useMuxPlayerEvents(playerId: string) {
  const emit: any = (eventType: any, data: any) => {
    mux.emit(playerId, eventType, data);
  };

  return {
    trackPlay: () => emit('play'),
    trackTimeUpdate: (currentTime: number) =>
      emit('timeupdate', {
        player_playhead_time: secondsToMs(currentTime),
      }),
    trackEnded: () => emit('ended'),
    trackSeeked: () => emit('seeked'),
    trackPaused: () => emit('pause'),
  };
}

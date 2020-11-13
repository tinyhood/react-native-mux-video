import type { VideoProperties } from 'react-native-video';

export interface IMuxOptions {
  data: {
    env_key: string;
    player_is_paused?: boolean;
    player_name: string;
    video_id: string;
    video_title: string;
  };
  debug: boolean;
}

export interface IMuxStateData {
  player_is_paused: boolean; // Return whether the player is paused, stopped, or complete (i.e. in any state that is not actively trying to play back the video)
  // player_width: number; // Return the width, in pixels, of the player on screen
  // player_height: number; // Return the height, in pixels, of the player on screen
  video_source_height: number; // Return the height, in pixels, of the current rendition playing in the player
  video_source_width: number; // Return the height, in pixels, of the current rendition playing in the player
  // Preferred properties - these should be provided in this callback if possible
  // If any are missing, that is okay, but this will be a lack of data for the customer at a later time
  player_is_fullscreen?: boolean; // Return true if the player is fullscreen
  player_autoplay_on?: boolean; // Return true if the player is autoplay
  player_preload_on?: boolean; // Return true if the player is preloading data (metadata, on, auto are all "true")
  video_source_url?: string; // Return the playback URL (i.e. URL to master manifest or MP4 file)
  video_source_mime_type?: string; // Return the mime type (if possible), otherwise the source type (hls, dash, mp4, flv, etc)
  video_source_duration?: number; // Return the duration of the source as reported by the player (could be different than is reported by the customer)
  // Optional properties - if you have them, send them, but if not, no big deal
  video_poster_url?: string; // Return the URL of the poster image used
  player_language_code?: string; // Return
}

export interface IMuxInitOptions {
  data: {
    env_key: string;
    player_is_paused?: boolean;
    player_mux_plugin_name: string;
    player_mux_plugin_version: string;
    player_name: string;
    player_software_name: string;
    video_id: string;
    video_title: string;
  };
  debug: boolean;
  getPlayheadTime: () => number;
  getStateData: () => IMuxStateData;
  minimumRebufferDuration: number;
  platform: {
    name: string;
    os: {
      family: string;
      version: string;
    };
    version: string;
  };
}

export interface IReactNativeMuxVideoProps
  extends Omit<VideoProperties, 'ref' | 'progressUpdateInterval'> {
  options: IMuxOptions;
  paused?: boolean;
  source: { uri: string };
}

export type ICurrentStatus = undefined | 'play' | 'paused' | 'playing';

export interface IPlayerState {
  playerId?: string;
  currentStatus: ICurrentStatus;
  currentTime: number;
  duration: number;
  sourceWidth: number;
  sourceHeight: number;
  lastRateChange?: number;
  isFullscreen: boolean;
  isPaused: boolean;
}

export type IPlayerStateKey = keyof IPlayerState;

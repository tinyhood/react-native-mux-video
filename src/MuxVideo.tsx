import mux from 'mux-embed';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Video, {
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import type { IMuxInitOptions, IReactNativeMuxVideoProps } from './types';
import { useMuxPlayerEvents, usePlayerState } from './hooks';
import { MIN_REBUFFER_DURATION, generateShortId } from './utils';

const MuxVideo = React.forwardRef(
  (
    {
      onProgress = () => null,
      onEnd = () => null,
      onSeek = () => null,
      onLoad = () => null,
      onPlaybackRateChange = () => null,
      onFullscreenPlayerDidPresent = () => null,
      onFullscreenPlayerDidDismiss = () => null,
      options,
      source,
      paused = false,
      ...otherProps
    }: IReactNativeMuxVideoProps,
    ref: React.ComponentPropsWithRef<typeof Video>['ref']
  ) => {
    const [state, setState] = useState<any>({ playerID: null });
    const { playerID } = state;
    const didStartPaused = paused;
    const {
      trackPlay,
      trackTimeUpdate,
      trackEnded,
      trackSeeked,
      trackPaused,
    } = useMuxPlayerEvents(playerID);
    const {
      getCurrentTime,
      getStatus,
      setStatus,
      setDuration,
      getDuration,
      setSourceHeight,
      setSourceWidth,
      getLastRateChange,
      setLastRateChange,
      setIsFullscreen,
      destroy,
      getIsPaused,
      getSourceHeight,
      getSourceWidth,
      getIsFullscreen,
    } = usePlayerState(playerID);

    const emitPlay = () => {
      setStatus('play');
      trackPlay();
    };

    const _onProgress = (evt: OnProgressData) => {
      if (getStatus() === 'paused') {
        return;
      }

      if (getStatus() === 'play') {
        setStatus('playing');
        trackPlay();
      }
      trackTimeUpdate(evt.currentTime);
      onProgress(evt);
    };

    const _onEnd = () => {
      trackEnded();
      onEnd();
    };

    const _onSeek = (evt: OnSeekData) => {
      trackSeeked();
      onSeek(evt);
    };

    const _onLoad = (evt: OnLoadData) => {
      /*
       * We're comparing this value to the string 'undefined' instead of the
       * value 'undefined because sometimes the value actually is the string
       * 'undefined' contrary to the provided types.
       *
       * https://github.com/react-native-community/react-native-video/issues/1194
       */
      const sourceWidthPresent =
        evt.naturalSize.width && (evt.naturalSize.width as any) !== 'undefined';
      const sourceHeightPresent =
        evt.naturalSize.height &&
        (evt.naturalSize.height as any) !== 'undefined';

      if (evt.duration) {
        setDuration(evt.duration);
      }
      if (evt.naturalSize) {
        if (sourceWidthPresent) {
          setSourceWidth(evt.naturalSize.width);
        }
        if (sourceHeightPresent) {
          setSourceHeight(evt.naturalSize.height);
        }
      }
      onLoad(evt);
    };

    const _onPlaybackRateChange = (evt: OnPlaybackRateData) => {
      const lastRate = getLastRateChange();
      const newRate = evt.playbackRate;
      const isFirstPlayAttempt =
        didStartPaused && lastRate === undefined && newRate;
      const isUnPausing = lastRate === 0 && newRate;

      setLastRateChange(evt.playbackRate);

      if (lastRate === newRate) {
        onPlaybackRateChange(evt);
        return;
      }

      if (isFirstPlayAttempt || isUnPausing) {
        emitPlay();
        onPlaybackRateChange(evt);
        return;
      }

      if (newRate === 0) {
        trackPaused();
        setStatus('paused');
        onPlaybackRateChange(evt);
        return;
      }
    };

    const _onFullscreenPlayerDidPresent = () => {
      setIsFullscreen(true);
      onFullscreenPlayerDidPresent();
    };

    const _onFullscreenPlayerDidDismiss = () => {
      setIsFullscreen(false);
      onFullscreenPlayerDidDismiss();
    };

    useEffect(() => {
      // eslint-disable-next-line no-shadow
      const playerID = generateShortId();

      setState({ ...state, playerID });
      //
      // The callback below gets called when the component is unmounted,
      // and by that time the `state` and `state.playerID` have been cleaned
      // up, so the `playerID` variable will be `null`. For that reason,
      // let's cache the playerID in a local variable, `playerIDCopy` and use
      // it to emit the 'destroy' event.
      //
      const playerIDCopy = playerID;

      return () => {
        mux.emit(playerIDCopy, 'destroy');
        destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!playerID) return;

      const getStateData = () => {
        return {
          player_is_paused: getIsPaused(),
          video_source_height: getSourceWidth(),
          video_source_width: getSourceHeight(),
          player_is_fullscreen: getIsFullscreen(),
          player_autoplay_on: !paused,
          video_source_url: source && source.uri,
          video_source_duration: getDuration(),
          video_poster_url: otherProps.poster,
        };
      };

      const userOptions = options;
      const userOptionsData = options.data;
      const muxInitOptions: IMuxInitOptions = {
        data: {
          env_key: userOptionsData.env_key,
          player_mux_plugin_name: 'react-native-mux-video',
          player_mux_plugin_version: '0.1.0',
          player_name: 'ReactNativeMuxVideo',
          player_software_name: 'React Native Video',
          video_id: userOptionsData.video_id,
          video_title: userOptionsData.video_title,
          player_is_paused: userOptionsData.player_is_paused,
        },
        debug: userOptions.debug,
        getPlayheadTime: () => getCurrentTime(),
        getStateData,
        minimumRebufferDuration: MIN_REBUFFER_DURATION,
        platform: {
          name: 'React Native',
          version: '0.62.2',
          os: {
            family: Platform.OS,
            version: Platform.Version.toString(),
          },
        },
      };

      mux.init(playerID, muxInitOptions);
      if (!didStartPaused) {
        emitPlay();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerID]);

    return (
      <Video
        onProgress={_onProgress}
        onEnd={_onEnd}
        onSeek={_onSeek}
        onLoad={_onLoad}
        onPlaybackRateChange={_onPlaybackRateChange}
        paused={paused}
        progressUpdateInterval={MIN_REBUFFER_DURATION}
        onFullscreenPlayerDidPresent={_onFullscreenPlayerDidPresent}
        onFullscreenPlayerDidDismiss={_onFullscreenPlayerDidDismiss}
        source={source}
        ref={ref}
        {...otherProps}
      />
    );
  }
);

export default MuxVideo;

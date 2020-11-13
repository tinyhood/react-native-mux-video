declare module 'mux-embed' {
  export const emit: any;
  export const utils: {
    secondsToMs: (seconds: number) => number;
  };
  export const init: (
    playerId: string,
    options: {
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
  ) => null;
}

# react-native-mux-video

A wrapper around react-native-video that integrates Mux Data.

## Installation

```sh
yarn add react-native-mux-video
```

## Usage

```js
import { MuxVideo } from 'react-native-mux-video';

// ...

return (
  <MuxVideo
    style={styles.video}
    source={{
      uri:
        'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    }}
    controls
    muted
    ref={ref}
    options={{
      debug: true,
      data: {
        env_key: 'YOUR_ENV_KEY',
        player_name: 'Test player',
        video_id: 'video-id-1',
        video_title: 'Big buck bunny',
        player_is_paused: undefined,
      },
    }}
  />
);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

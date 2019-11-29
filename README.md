# House Temps

Widgets - https://thingspeak.com/channels/557585

*Warning:* Current code is specific for my hue sensors, need to change this to allow configuration via the `.env` file or autodiscover.

Requires;

- Hue Motion Sensors + Hue Hub
- Hue API Key
- Thingspeak account
- Node v8.x
- npm

### Running

Configure details in `.env`

Run with;
```
node main.js
```

Example output;

```
$ node main.js
Hue temperature sensor 1,23.68
Hue temperature sensor 2,22.38
Hue temperature sensor 3,21.85
435
```

# Clappr Level Selector Plugin

<img src="https://raw.githubusercontent.com/lucasmundim/clappr-level-selector-plugin/master/screenshot.png"/>

## Usage

Add both Clappr and Level Selector plugin scripts to your HTML:

```html
<head>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
  <script type="text/javascript" src="dist/level-selector.js"></script>
</head>
```

Then just add `LevelSelector` into the list of plugins of your player instance:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.m3u8",
  plugins: {
    'core': [LevelSelector]
  }
});
```

You can also customize the labels and title:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.m3u8",
  plugins: {
    'core': [LevelSelector]
  },
  levelSelectorConfig: {
    title: 'Quality',
    labels: {
        500: 'High', // 500kbps
        240: 'Med', // 240kbps
        120: 'Low', // 120kbps
    }
  },
});
```

*Note: There is a minified version served through CDNs too:*
```html
<script type="text/javascript"
        src="//cdn.jsdelivr.net/clappr.level-selector/latest/level-selector.min.js"></script>
```

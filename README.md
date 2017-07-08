# download-with-webtorrent-button
Transform ordinary download links into super-powered WebTorrent ones!

## Example

Check out the demo page: https://wmhilton.github.io/download-with-webtorrent-button

[![screenshot of WebTorrent button](https://github.com/wmhilton/download-with-webtorrent-button/blob/master/dist/animated.gif?raw=true)](https://wmhilton.github.io/download-with-webtorrent-button)


## Rationale

Do you have a big, popular file that lots of people download and the Internet
would grind to a halt if your website went down?
It is EASY to spread the burden of hosting a file among all the people who are
downloading it. Bittorrent (despite its association with piracy) is a fabulous
network protocol that does exactly that. It use to be that you needed to install
separate software to use Bittorrent, but with the advent of
[WebTorrent](https://webtorrent.io) it is now possible to use the Bittorrent
protocol seamlessly in the browser without visitors ever having to leave your site!

Despite how FREAKING AWESOME WebTorrent is, not enough sites are taking advantage
of it. To make taking advantage of WebTorrent as easy and
accessible as possible, I decided to make a "Download with WebTorrent" button
that turns your ordinary download link into a super-powered WebTorrent download
link! All you have to do is paste a small code snippet in your HTML.


## Installation using a CDN

Add the following stylesheet to `<head>`:

```html
<link rel="stylesheet" href="https://unpkg.com/download-with-webtorrent-button/dist/index.css">
```

And the following scripts to the bottom of `<body>`:

```html
<script src="https://unpkg.com/webtorrent/webtorrent.min.js"></script>
<script src="https://unpkg.com/download-with-webtorrent-button/dist/index.js"></script>
```

This adds a single function `registerWebtorrentLinks()` to the global scope.
It automatically initializes `a` tags. If you add additional `a` tags after the
initial page load (such as in the case of single page apps) you can rerun registerWebtorrentLinks().

If you want to override the CSS styles, take a look at `index.css`.

## Installation using a module bundler?

Somebody should fork this and make it a React component. Pull requests welcome!


## Usage

### The easiest way

To add a **Download with WebTorrent** button to your page, use a regular `<a>` link.
The link's `href` attribute will be provided as a fallback on browsers that can't run WebTorrent,
or if an error occurs. Then add a `data-webtorrent` attribute.

You can use `data-webtorrent="auto"` and these
[fabulous](https://github.com/wmhilton/webtorrentify-link)
[free](https://github.com/wmhilton/webtorrentify-server)
[services](https://github.com/wmhilton/cors-buster)
will auto-generate a WebTorrent-compatible .torrent file for your link.

```html
<a href="file.mp4" data-webtorrent="auto">Link Text</a>
```

### Bring your own torrent

If you already have a magnet URI, you can use that,

```html
<a href="file.mp4" data-webtorrent="magnet:?xt=urn:btih:...">Link Text</a>
```

or the location of a .torrent file,

```html
<a href="file.mp4" data-webtorrent="https://example.com/path/to/file.torrent">Link Text</a>
```

but know that WebTorrent is not yet compatible with the DHT and requires `ws` or `http` trackers. If your .torrent only includes `udp` trackers or is tracker-less and relies on the DHT, you are better off using `data-webtorrent="auto"`.

If your torrent is a folder torrent rather than a single file, add a `data-file` attribute with the name of the individual file you intend the link for.

```html
<a href="https://webtorrent.io/torrents/Sintel/Sintel.mp4" data-webtorrent="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent" data-file="Sintel.mp4">Sintel</a>
```

## License

Copyright 2017 William Hilton.
Licensed under [The Unlicense](http://unlicense.org/).

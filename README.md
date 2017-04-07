# download-with-webtorrent-button
Transform ordinary download links into super-powered WebTorrent ones!

## Example

Check out the demo page: https://wmhilton.com/download-with-webtorrent-button

[![screenshot of WebTorrent button](https://github.com/wmhilton/download-with-webtorrent-button/blob/master/dist/animated.gif?raw=true)](https://wmhilton.com/download-with-webtorrent-button)


## Rationale

Do you have a big, popular file that lots of people download and the Internet
would grind to a halt if your website went down? (*Cough*, nodejs.org, *cough*)
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

## Usage

You will need a .torrent file or a `magnet:` link for your file. If you don't have one yet,
you can make one here: http://www.urlhash.com/ (Hopefully I can automate that
step for you in the future.)

To add a **Download with WebTorrent** button to your page, use a regular `<a>` link.
Add a `data-webtorrent` attribute with the magnet URI or a URL pointing to a .torrent file.
The `href` attribute will be used as a fallback on browsers that can't run WebTorrent.
Note: If the torrent is a folder rather than a single file, add a `data-file` attribute
with the name of the individual file.

    <a href="file.mp4" data-webtorrent="file.torrent">Link Text</a>

## Installation using a CDN

Add the following stylesheet to `<head>`:

    <link rel="stylesheet" href="https://unpkg.com/download-with-webtorrent-button/dist/index.css">

And the following scripts to the bottom of `<body>`:

    <script src="https://unpkg.com/webtorrent/webtorrent.min.js"></script>
    <script src="https://unpkg.com/download-with-webtorrent-button/dist/index.js"></script>

This adds a single function `registerWebtorrentLinks()` to the global scope.
It automatically initializes `a` tags. If you add additional `a` tags after the
initial page load (such as in the case of single page apps) you can rerun the
initializer

## Installation using a module bundler

WIP

## TODO

- [x] explain what it is and how to use it
- [ ] make available as npm package
- [x] make usage example
- [ ] on more browsers
- [x] correctly auto-prefix CSS gradients

## License

Copyright 2017 William Hilton.
Licensed under [The Unlicense](http://unlicense.org/).

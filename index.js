/* global WebTorrent */
function registerWebtorrentLinks () {
  'use strict'
  // Add onclick handlers to all <a data-webtorrent="..."> elements
  var links = document.querySelectorAll('a[data-webtorrent]')
  for (var i = 0; i < links.length; i++) {
    // Wrap the link innerHTML so its easier to update
    var a = links[i]
    var span = document.createElement('span')
    span.innerText = a.innerText

    var sub = document.createElement('sub')
    if (WebTorrent.WEBRTC_SUPPORT) {
      sub.innerText = 'Download with WebTorrent'
      a.addEventListener('click', downloadWithWebTorrent)
    } else {
      console.log('WebRTC is not supported')
      a.classList.add('no-webrtc')
      var sublink = document.createElement('a')
      sublink.href = a.dataset.webtorrent
      sublink.innerText = 'Download with Bittorrent'
      sub.appendChild(sublink)
    }
    a.innerText = ''
    a.appendChild(span)
    a.appendChild(sub)
    a.classList.add('init')
  }

  // This is what runs when user clicks the link
  function downloadWithWebTorrent (e) {
    var a = e.currentTarget
    // Once the file is downloaded, we change the href to point to a blob.
    // If we already have the blob then return to let the link do its default behavior.
    if (a.classList.contains('ready')) {
      // yay lets store state in the DOM because we're lazy!
      a.classList.remove('ready')
      a.classList.add('seeding')
      return true
    }
    // If we're already downloading don't start another download
    if (a.classList.contains('downloading')) {
      e.preventDefault()
      return false
    }
    // Otherwise, do this stuff instead:
    try {
      // Wrap the link text so we can update it easily
      var span = a.querySelector('span')
      var sub = a.querySelector('sub')
      var title = span.innerText

      // Initialize WebTorrent
      var client = new WebTorrent()
      client.on('error', function (err) {
        console.error('ERROR: ' + err.message)
      })

      // If there is no torrent file / magnet link / btih then try to
      // dynamically generate one with the free service I built.
      if (a.dataset.webtorrent === 'auto') {
        a.dataset.webtorrent = 'https://webtorrentify.now.sh/?href=' + a.href
        sub.innerText = 'Generating .torrent file...'
      }

      // This starts downloading the torrent
      client.add(a.dataset.webtorrent, function (torrent) {
        console.log(torrent)

        // Torrents can contain multiple files, so we gotta deal with that.
        var file
        if (torrent.files.length === 1 || a.dataset.file === undefined) {
          file = torrent.files[0]
        } else {
          file = torrent.files.find(function (file) { return file.name === a.dataset.file })
        }

        a.classList.add('downloading')

        // Show progress bar
        function progress () {
          var numPeers = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')
          var percent = Math.round(torrent.progress * 100) + '%'
          if (!torrent.done) {
            // Nifty progress bar using CSS gradient backgrounds
            a.style = 'background-size: 28px 28px, ' + percent + ' 100%, 100%;'
            // Update download percentage
            if (!span.innerText.endsWith(' - Ready')) {
              span.innerText = title + ' - ' + percent
              sub.innerText = 'Downloading from ' + numPeers
            }
          } else if (torrent.done && a.classList.contains('seeding')) {
            span.innerText = file.name + ' - Ready'
            sub.innerText = 'Seeding to ' + numPeers
          }
        }
        progress()
        setInterval(progress, 500)

        // When the file is ready, change the button text to reflect that
        file.getBlobURL(function (err, url) {
          if (err) {
            window.alert('WebTorrent error: source getBlobURL')
            return
          }
          a.classList.remove('downloading')
          a.classList.add('ready')
          span.innerText = file.name + ' - Ready'
          sub.innerText = 'Click to save file'
          a.download = file.name
          a.href = url
        })
      })
      // Prevent default link behavior and don't follow it.
      e.preventDefault()
      return false
    } catch (err) {
      console.log(err)
      // If something went wrong, bail and use the default link behavior
      // to download the link without WebTorrent if possible.
      return true
    }
  }
}

if (window) {
  window.registerWebtorrentLinks = registerWebtorrentLinks
  registerWebtorrentLinks()
}

function registerWebtorrentLinks () {
  'use strict'
  // Add onclick handlers to all <a class="webtorrent-download"> elements
  var links = document.querySelectorAll('a.webtorrent-download')
  for (let i = 0; i < links.length; i++) {
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
      sublink.href = a.dataset.torrent
      sublink.innerText = 'Download with Bittorrent'
      sub.appendChild(sublink)
    }
    a.innerText = ''
    a.appendChild(span)
    a.appendChild(sub)
    a.classList.add('initialized')
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
      // Initialize WebTorrent
      var client = new WebTorrent()
      client.on('error', function (err) {
        console.error('ERROR: ' + err.message)
      })

      // This starts downloading the torrent
      client.add(a.dataset.torrent, function (torrent) {
        console.log(torrent)
        
        // Torrents can contain multiple files, so we gotta deal with that.
        if (torrent.files.length === 1 || a.dataset.file == undefined) {
          var file = torrent.files[0]
        } else {
          var file = torrent.files.find(function (file) { return file.name === a.dataset.file })
        }
        
        // Wrap the link text so we can update it easily
        var span = a.querySelector('span')
        var sub = a.querySelector('sub')
        var title = span.innerText
        span.innerText = title + ' - ' + Math.round(torrent.progress * 100) + '%'
        sub.innerText = 'Downloading from ' + torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')
        a.classList.add('downloading')
        
        // Show progress bar
        var timer = setInterval(function () {
          if (!torrent.done) {
            // Nifty progress bar using CSS gradient backgrounds
            a.style = 'background-size: 28px 28px, ' + Math.round(torrent.progress * 100) + '% 100%, 100%;'
            // Update download percentage
            if (!span.innerText.endsWith(' - Ready')) {
              span.innerText = title + ' - ' + Math.round(torrent.progress * 100) + '%'
              sub.innerText = 'Downloading from ' + torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')
            }
          } else if (torrent.done && a.classList.contains('seeding')) {
            span.innerText = file.name + ' - Ready'
            sub.innerText = 'Seeding to ' + torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')
          }
        }, 500)
        
        // When the file is ready, change the button text to reflect that
        file.getBlobURL(function (err, url) {
          a.classList.remove('downloading')
          a.classList.add('ready')
          span.innerText = file.name + ' - Ready'
          sub.innerText = 'Click to save file'
          a.href = url
          a.download = a.dataset.file
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

registerWebtorrentLinks()
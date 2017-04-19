/* global WebTorrent */
function registerWebtorrentLinks () {
  'use strict'
  // Add onclick handlers to all <a data-webtorrent="..."> elements
  var links = document.querySelectorAll('a[data-webtorrent]')
  for (var i = 0; i < links.length; i++) {
    // Wrap the link innerHTML so its easier to update
    var a = links[i]

    if (WebTorrent.WEBRTC_SUPPORT) {
      a.title = 'Download with WebTorrent'
      a.addEventListener('click', onButtonClick)
    } else {
      a.classList.add('no-webrtc')
      if (a.dataset.webtorrent !== 'auto') {
        a.title = ''
        var sublink = document.createElement('a')
        sublink.href = a.dataset.webtorrent
        sublink.innerText = 'alternate Bittorrent link'
        a.appendChild(sublink)
      } else {
        a.title = 'Download'
      }
    }
    a.classList.add('init')
  }

  function onButtonClick (e) {
    // The button has a simple state machine that progresses from
    // 'init' to 'downloading' to 'ready' to 'seeding' and clicks
    // are handled differently in each case.
    var a = e.currentTarget
    if (a.classList.contains('init')) return downloadWithWebTorrent(e)
    if (a.classList.contains('downloading')) return ignoreClicks(e)
    if (a.classList.contains('ready')) return saveFile(e)
    if (a.classList.contains('seeding')) return saveFile(e)
    return true
  }

  // This is what runs when user clicks the link
  function downloadWithWebTorrent (e) {
    var a = e.currentTarget
    a.classList.remove('init')
    a.classList.add('downloading')
    try {
      var title = a.innerText

      // Initialize WebTorrent
      var client = new WebTorrent()
      client.on('error', function (err) {
        console.error('ERROR: ' + err.message)
      })

      // The 'auto' option will dynamically generate a .torrent file
      // using a free service I built
      if (a.dataset.webtorrent === 'auto') {
        a.dataset.webtorrent = 'https://webtorrentify.now.sh/?href=' + a.href
        a.title = 'Generating .torrent file...'
      }

      // This starts downloading the torrent
      client.add(a.dataset.webtorrent, function (torrent) {
        console.log(torrent)

        // Torrents can contain multiple files, so we have to deal with that.
        var file
        if (torrent.files.length === 1 || a.dataset.file === undefined) {
          file = torrent.files[0]
        } else {
          file = torrent.files.find(function (file) { return file.name === a.dataset.file })
        }

        // Show progress bar
        function progress () {
          var numPeers = torrent.numPeers
          numPeers += (numPeers === 1 ? ' peer' : ' peers')
          var percent = Math.floor(torrent.progress * 100) + '%'
          // Nifty progress bar using CSS gradient backgrounds
          a.style = 'background-size: 28px 28px, ' + percent + ' 100%, 100%;'
          if (!torrent.done) {
            // Update download percentage
            if (!a.innerText.endsWith(' - Ready')) {
              a.innerText = title + ' - ' + percent
              a.title = 'Downloading (' + numPeers + ')'
            }
          } else if (torrent.done && a.classList.contains('seeding')) {
            a.innerText = file.name + ' - Ready'
            a.title = 'Seeding (' + numPeers + ')'
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
          a.innerText = file.name + ' - Ready'
          a.title = 'Click to save file'
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

  // If we're already downloading don't start another download
  function ignoreClicks (e) {
    e.preventDefault()
    return false
  }

  // Once the file is downloaded, we change the href to point to a blob.
  // Thus we just let the link do its default behavior.
  function saveFile (e) {
    var a = e.currentTarget
    a.classList.remove('ready')
    a.classList.add('seeding')
    return true
  }
}

if (window) {
  window.registerWebtorrentLinks = registerWebtorrentLinks
  registerWebtorrentLinks()
}

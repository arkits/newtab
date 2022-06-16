const FEED_CONFIGS = [
    {
        url: 'https://www.theverge.com/rss/index.xml'
    },
    {
        url: 'https://www.androidpolice.com/feed/'
    },
    {
        url: 'http://feeds.arstechnica.com/arstechnica/index'
    }
];

const NUMBER_OF_ARTICLES_TO_DISPLAY = 5;

var COVER_ART_URL;

function updateNowPlaying() {
    fetch('https://musick.archit.xyz/musick/now', {
        method: 'GET',
        redirect: 'follow'
    })
        .then((r) => r.json())
        .then((response) => {
            // Set Now Playing text...
            document.getElementById('now-playing-track-name').textContent = response.nowPlaying.trackName;
            document.getElementById('now-playing-artist-name').textContent = response.nowPlaying.artistName;
            document.getElementById('now-playing-album-name').textContent = response.nowPlaying.albumName;

            // Set the background of the Now Playing card...
            document.getElementById(
                'now-playing-fullscreen'
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${response.nowPlaying.coverArtUrl})`;
            document.getElementById('now-playing-fullscreen').style.backgroundPosition = `center`;
            document.getElementById('now-playing-fullscreen').style.backgroundSize = `cover`;

            if (COVER_ART_URL != response.nowPlaying.coverArtUrl) {
                COVER_ART_URL = response.nowPlaying.coverArtUrl;
                updateAccentColor(COVER_ART_URL);
            }
        })
        .catch((error) => console.log('Caught error when fetching now playing!', error));

    setTimeout(function () {
        updateNowPlaying();
    }, 10000);
}

function updateAccentColor(imageUrl) {
    const colorThief = new ColorThief();

    // This will load the image again... TODO: find a better way to grab the image
    var img = document.createElement('img');
    img.setAttribute('src', imageUrl);
    img.crossOrigin = 'Anonymous';

    img.addEventListener('load', function () {
        // default dominantColor
        var dominantColor = [206, 206, 206];

        // get colors from the image
        var colorPalette = colorThief.getPalette(img);

        for (var color of colorPalette) {
            // if the color is a dark color...
            if (isDark(color[0], color[1], color[2])) {
                // ignore it...
                console.log('Too dark!', color);
                continue;
            } else {
                dominantColor = [color[0], color[1], color[2]];
                console.log('Setting dominantColor=', dominantColor);
                break;
            }
        }

        var dominantColorHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);

        // update accent color css var
        document.documentElement.style.setProperty('--accent-color', dominantColorHex);
        if (isLight(dominantColor[0], dominantColor[1], dominantColor[2])) {
            document.documentElement.style.setProperty('--inverted-accent-color', '#25292C');
        } else {
            document.documentElement.style.setProperty('--inverted-accent-color', '#E0BCB0');
        }

        // update navbar color
        document.getElementById('navbar').style.backgroundColor = dominantColorHex;
    });
}

const rgbToHex = (r, g, b) =>
    '#' +
    [r, g, b]
        .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');

function isDark(r, g, b) {
    if (calculateHsp(r, g, b) > 90) {
        return false;
    } else {
        return true;
    }
}

function isLight(r, g, b) {
    if (calculateHsp(r, g, b) < 120) {
        return false;
    } else {
        return true;
    }
}

function calculateHsp(r, g, b) {
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    var hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp;
}

window.addEventListener('DOMContentLoaded', (event) => {
    halfmoon.toggleDarkMode();
    updateNowPlaying();
});
ƒ;

const FEED_CONFIGS = [
    {
        url: 'https://www.theverge.com/rss/index.xml',
        pretty_name: 'The Verge'
    },
    {
        url: 'https://www.androidpolice.com/feed/',
        pretty_name: 'Android Police'
    },
    {
        url: 'http://feeds.arstechnica.com/arstechnica/index',
        pretty_name: 'Ars Technica'
    }
];

const NUMBER_OF_ARTICLES_TO_DISPLAY = 5;

var COVER_ART_URL;

function updateNowPlaying() {
    fetch('https://archit.xyz/musick/now', {
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
                'now-playing-card'
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${response.nowPlaying.coverArtUrl})`;
            document.getElementById('now-playing-card').style.backgroundPosition = `center`;
            document.getElementById('now-playing-card').style.backgroundSize = `cover`;

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

function updateNewsFeeds() {
    var feedRow = document.createElement('div');
    feedRow.className = 'row';

    var feed = document.getElementById('feed');
    feed.appendChild(feedRow);

    let feedUrls = FEED_CONFIGS.map((feedConfig) => `https://archit.xyz/rss/feed?url=${feedConfig.url}`);

    let feedPromises = feedUrls.map((feedUrl) =>
        fetch(feedUrl, {
            method: 'GET',
            redirect: 'follow'
        })
    );

    Promise.all(feedPromises)
        .then((responses) => {
            return Promise.all(
                responses.map(function (r) {
                    return r.json();
                })
            );
        })
        .then((responsesJson) => {
            responsesJson.forEach((response) => {
                console.log(response);
                var articles = document.createElement('div');

                response.items.slice(0, NUMBER_OF_ARTICLES_TO_DISPLAY).forEach((newsItem) => {
                    var articleLink = document.createElement('a');
                    articleLink.innerHTML = newsItem.title;
                    articleLink.href = newsItem.link;
                    articleLink.target = '_blank';
                    articleLink.className = 'medium-bold';

                    var articleListing = document.createElement('ul');
                    articleListing.appendChild(articleLink);

                    articles.appendChild(articleListing);
                });

                var feedCol = document.createElement('div');
                feedCol.className = 'col-sm feed-col';

                var feedTitle = document.createElement('h4');
                feedTitle.className = 'card-title accent semi-bold';
                feedTitle.textContent = response.title;

                feedCol.appendChild(feedTitle);
                feedCol.appendChild(articles);

                feedRow.appendChild(feedCol);
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function loadLinks() {
    var linkRow = document.createElement('div');
    linkRow.className = 'row';

    var links = document.getElementById('links');
    links.appendChild(linkRow);

    fetch('static/links.json', {
        method: 'GET',
        redirect: 'follow'
    })
        .then((r) => r.json())
        .then((response) => {
            for (var linkType in response) {
                // Create a column for the link type
                var linkCol = document.createElement('div');
                linkCol.className = 'col-sm';

                // Create a title for the link type
                var linkColTitle = document.createElement('h4');
                linkColTitle.className = 'card-title accent semi-bold';
                linkColTitle.textContent = linkType;

                // Add the title to the column
                linkCol.appendChild(linkColTitle);

                // Traves the associated object for the linkType
                var linksObject = response[linkType];
                for (var prettyLinkName in linksObject) {
                    // Generate a elements for each element in the object
                    var linkLink = document.createElement('a');
                    linkLink.innerHTML = prettyLinkName;
                    linkLink.href = linksObject[prettyLinkName];
                    linkLink.className = 'medium-bold';

                    linkCol.appendChild(linkLink);
                    linkCol.appendChild(document.createElement('br'));
                }

                // Append the column to the main row
                linkRow.appendChild(linkCol);
            }
        })
        .catch((error) => console.log('Caught error when fetching links!', error));
}

function updateCurrentTime() {
    document.getElementById('datetime').innerHTML = new Date().toLocaleTimeString();
    setTimeout(function () {
        updateCurrentTime();
    }, 500);
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
    updateNewsFeeds();
    loadLinks();
    updateCurrentTime();
    updateNowPlaying();
});

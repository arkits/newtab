const FEED_CONFIGS = [
  {
    url: "https://www.theverge.com/rss/index.xml",
    pretty_name: "The Verge",
  },
  {
    url: "https://www.androidpolice.com/feed/",
    pretty_name: "Android Police",
  },
  {
    url: "http://feeds.arstechnica.com/arstechnica/index",
    pretty_name: "Ars Technica",
  },
];

const NUMBER_OF_ARTICLES_TO_DISPLAY = 5;

function updateNowPlaying() {
  fetch("https://archit.xyz/musick/now", {
    method: "GET",
    redirect: "follow",
  })
    .then((r) => r.json())
    .then((response) => {
      document.getElementById("now-playing-cover-art").src =
        response.nowPlaying.coverArtUrl;
      document.getElementById("now-playing-track-name").textContent =
        response.nowPlaying.trackName;
      document.getElementById("now-playing-artist-name").textContent =
        response.nowPlaying.artistName;
      document.getElementById("now-playing-album-name").textContent =
        response.nowPlaying.albumName;
    })
    .catch((error) =>
      console.log("Caught error when fetching now playing!", error)
    );
}

function updateNewsFeeds() {
  var feedRow = document.createElement("div");
  feedRow.className = "row";

  var feed = document.getElementById("feed");
  feed.appendChild(feedRow);

  FEED_CONFIGS.forEach((FEED_CONFIG) => {
    fetch(`https://archit.xyz/rss/feed?url=${FEED_CONFIG.url}`, {
      method: "GET",
      redirect: "follow",
    })
      .then((r) => r.json())
      .then((response) => {
        var articles = document.createElement("div");

        response.items
          .slice(0, NUMBER_OF_ARTICLES_TO_DISPLAY)
          .forEach((newsItem) => {
            var articleLink = document.createElement("a");
            articleLink.innerHTML = newsItem.title;
            articleLink.href = newsItem.link;
            articleLink.target = "_blank";

            var articleListing = document.createElement("ul");
            articleListing.appendChild(articleLink);

            articles.appendChild(articleListing);
          });

        var feedCol = document.createElement("div");
        feedCol.className = "col-sm feed-col";

        var feedTitle = document.createElement("h4");
        feedTitle.className = "card-title";
        feedTitle.textContent = FEED_CONFIG.pretty_name;

        feedCol.appendChild(feedTitle);
        feedCol.appendChild(articles);

        feedRow.appendChild(feedCol);
      })
      .catch((error) =>
        console.log("Caught error when fetching feed!", error)
      );
  });
}

function loadLinks() {
  var linkRow = document.createElement("div");
  linkRow.className = "row";

  var links = document.getElementById("links");
  links.appendChild(linkRow);

  fetch("static/links.json", {
    method: "GET",
    redirect: "follow",
  })
    .then((r) => r.json())
    .then((response) => {
      for (var linkType in response) {
        // Create a column for the link type
        var linkCol = document.createElement("div");
        linkCol.className = "col-sm";

        // Create a title for the link type
        var linkColTitle = document.createElement("h4");
        linkColTitle.className = "card-title";
        linkColTitle.textContent = linkType;

        // Add the title to the column
        linkCol.appendChild(linkColTitle);

        // Traves the associated object for the linkType
        var linksObject = response[linkType];
        for (var prettyLinkName in linksObject) {
          // Generate a elements for each element in the object
          var linkLink = document.createElement("a");
          linkLink.innerHTML = prettyLinkName;
          linkLink.href = linksObject[prettyLinkName];
          linkCol.appendChild(linkLink);
          linkCol.appendChild(document.createElement("br"));
        }

        // Append the column to the main row
        linkRow.appendChild(linkCol);
      }
    })
    .catch((error) =>
      console.log("Caught error when fetching links!", error)
    );
}

updateNowPlaying();
updateNewsFeeds();
loadLinks();

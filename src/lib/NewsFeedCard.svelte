<script>
  const FEED_CONFIGS = [
    {
      url: "https://www.theverge.com/rss/index.xml",
    },
    {
      url: "https://www.reddit.com/r/Android.rss",
    },
    {
      url: "http://feeds.arstechnica.com/arstechnica/index",
    },
  ];

  async function getFeed(feedUrl) {
    let response = await fetch(
      `https://rss.archit.xyz/rss/feed?url=${feedUrl}`
    );
    let links = await response.json();
    return links;
  }

  async function getFeeds() {
    let feeds = [];
    for (const feedConfig of FEED_CONFIGS) {
      let response = await fetch(
        `https://rss.archit.xyz/rss/feed?url=${feedConfig.url}`
      );

      let feedJson = await response.json();
      feeds.push(feedJson);
    }
    return feeds;
  }

  const promise = getFeeds();
</script>

<div>
  <div class="rounded overflow-hidden shadow-lg bg-gray-800 p-5">
    {#await promise}
      <p>Loading...</p>
    {:then feeds}
      <div class="flex">
        {#each feeds as feed}
          <div class="max-w-sm pr-10">
            <h1 class="font-bold">{feed.title}</h1>
            {#each feed.items.slice(0, 4) as feedItem}
              <li>{feedItem.title}</li>
            {/each}
            <br />
          </div>
        {/each}
      </div>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>

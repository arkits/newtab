<script>
  const FEED_CONFIGS = [
    {
      url: "https://www.theverge.com/rss/index.xml",
    },

    {
      url: "http://feeds.arstechnica.com/arstechnica/index",
    },
    {
      url: "https://www.reddit.com/r/Android.rss",
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

<div class="flex flex-col m-auto p-auto">
  <div class="flex overflow-x-scroll pb-10 hide-scroll-bar">
    <div class="flex flex-nowrap">
      {#await promise}
        <p>Loading...</p>
      {:then feeds}
        {#each feeds as feed}
          <div class="inline-block pr-10">
            <div
              class="w-96 h-128 max-w-sm overflow-hidden rounded-lg shadow-md bg-slate-800 hover:shadow-xl transition-shadow duration-300 ease-in-out p-5"
            >
              <h1 class="font-bold">{feed.title}</h1>
              {#each feed.items.slice(0, 6) as feedItem}
                <li>{feedItem.title}</li>
              {/each}
            </div>
          </div>
        {/each}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </div>
  </div>
</div>

<style>
  .hide-scroll-bar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }
</style>

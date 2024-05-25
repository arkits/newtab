<script>
  async function getLinks() {
    let response = await fetch("https://newtab.archit.xyz/static/links.json");
    let links = await response.json();
    return links;
  }
  const promise = getLinks();
</script>

<div>
  <div class="rounded overflow-hidden shadow-lg bg-gray-800 p-5">
    {#await promise}
      <p>Loading...</p>
    {:then links}
      <div class="flex">
        {#each Object.entries(links) as [category, linksMap]}
          <div class="max-w-sm pr-10">
            <h1 class="font-bold text-lg">{category}</h1>
            {#each Object.entries(linksMap) as [name, url]}
              <li>
                <a href={url}>{name}</a>
              </li>
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

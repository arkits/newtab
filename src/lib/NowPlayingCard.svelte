<script>
  async function getMusick() {
    let response = await fetch("https://musick.archit.xyz/musick/now");
    let musick = await response.json();
    return musick;
  }
  const promise = getMusick();
</script>

<div class="mr-10">
  <div class="max-w-sm rounded overflow-hidden shadow-lg bg-gray-800">
    {#await promise}
      <p>Loading...</p>
    {:then musick}
      <img
        class="w-full"
        src={musick.nowPlaying.coverArtUrl}
        alt="Sunset in the mountains"
      />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{musick.nowPlaying.trackName}</div>
        <p>
          {musick.nowPlaying.albumName}
        </p>
        <p>
          {musick.nowPlaying.artistName}
        </p>
      </div>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>

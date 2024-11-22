<script>
  import Carousel from "./lib/Carousel.svelte";
  import LinksCard from "./lib/LinksCard.svelte";
  import NowPlayingCard from "./lib/NowPlayingCard.svelte";
</script>

<main>
  <div class="container mx-auto mt-10">
    <div class="flex">
      <div>
        <NowPlayingCard />
      </div>
      <div class="grow">
        <LinksCard />
      </div>
    </div>
    <div class="mt-10">
      <Carousel />
    </div>
  </div>
</main>

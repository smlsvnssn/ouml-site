<script>
  import '../style.scss'
  import '../hljs.css'
  import * as ö from 'ouml'
  import scrollback from 'scrollbackheader'

  let { data } = $props()

  let toc

  let innerWidth = $state(0)

  const scrollToc = id => {
    Array.from(toc.querySelectorAll('a'))
      .find(v => v.href.includes(encodeURI(id)))
      .scrollIntoView({ behavior: 'smooth' })
  }

  function scrollbackNav(node) {
    const toggleChildElement = (element, childselector) => {
      // todo: If child height changes on resize, update cachedchildHeight
      const child = element.querySelector(childselector),
        cachedHeight = element.offsetHeight,
        cachedchildHeight = child.offsetHeight

      return (el, state) => {
        if (scrollY > cachedHeight) {
          if (child.style.display !== 'none') child.style.display = 'none'
        } else if (state === 'fixed') {
          if (child.style.display !== 'block') child.style.display = 'block'
          child.style.height = Math.max(0, cachedchildHeight - scrollY) + 'px'
        }
      }
    }

    $effect(() => {
      const sb = scrollback(node, toggleChildElement(node, '.top'))

      return sb.destroy
    })
  }
</script>

<svelte:window bind:innerWidth />

{#snippet navContent()}
  <div class="top"></div>
  <span class="logo"><a href="#">ouml.</a></span>

  <!-- todo: github link -->

  <ul>
    <!-- <li class="title">modules:</li> -->
    {#each data.nav as navItem}
      <li>
        <a
          href="#{navItem.properties.id}"
          onclick={() => scrollToc(navItem.properties.id)}
          >{navItem.children[0].value.toLowerCase()}</a
        >
      </li>
    {/each}
  </ul>

  <span class="toc">toc</span>
{/snippet}

{#snippet nav()}
  {#if innerWidth > 920}
    <nav class="main" use:scrollbackNav>
      {@render navContent()}
    </nav>
  {:else}
    <nav class="main">
      {@render navContent()}
    </nav>
  {/if}
{/snippet}

{#if innerWidth > 920}
  {@render nav()}
{/if}

<aside bind:this={toc}>
  {@html data.toc}
</aside>
<main>
  {#if innerWidth < 920}
    <button onclick={() => toc.scrollIntoView({ behavior: 'smooth' })}>➔</button>
    {@render nav()}
  {/if}
  {@html data.content}
</main>

<style>
  button {
    border: none;
    background: var(--code);
    padding: 0.5rem;
	width: 2rem;
    aspect-ratio: 1;
    display: grid;
	border-radius: 50%;
	cursor: pointer;
    mix-blend-mode: var(--blendMode);
	z-index: 1;

	position: sticky;
	float: right;
	top: 3rem;
  }
</style>

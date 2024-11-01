<script>
	import '../style.scss'
	import '../hljs.css'
	import * as ö from 'ouml'
	import scrollback from 'scrollbackheader'

	let { data } = $props()

	let toc

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
					if (child.style.display !== 'none')
						child.style.display = 'none'
				} else if (state === 'fixed') {
					if (child.style.display !== 'block')
						child.style.display = 'block'
					child.style.height =
						Math.max(0, cachedchildHeight - scrollY) + 'px'
				}
			}
		}

		$effect(() => {
			const sb = scrollback(node, toggleChildElement(node, '.top'))

			return sb.destroy
		})
	}
</script>

<nav class="main" use:scrollbackNav>
	<div class="top"></div>
	<span class="logo"><a href="#">ouml.</a></span>

	<!-- todo: github link -->
	<!-- todo: handle scroll-snap on mobile -->
	<!-- todo: handle mobile nicely -->

	<ul>
		<li class="title">modules:</li>
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
</nav>

<aside bind:this={toc}>
	<div class="stick">
		{@html data.toc}
	</div>
	<div class="filler"></div>
</aside>
<main>
	{@html data.content}
</main>

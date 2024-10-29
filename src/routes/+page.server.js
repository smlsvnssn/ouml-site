import rehypeSlug from 'rehype-slug'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkToc from 'remark-toc'
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'
import { selectAll, select } from 'hast-util-select'
import { unified } from 'unified'

import * as ö from 'ouml'

// const url = `https://raw.githubusercontent.com/smlsvnssn/ouml/refs/heads/master/README.md`

const url = `/static/README.md`

const removeNode = (index, parent) => parent.children.splice(index, 1)

export const load = async ({ fetch }) => {
	let res = await fetch(url)

	let nav

	const getNav = () => async tree => {
		nav = selectAll('h1', tree)
	}

	let toc

	const getToc = () => async tree => {
		let tocNode = select('ul', tree)

		let newTree = h(null, tocNode)

		toc = await unified().use(rehypeStringify).stringify(newTree)
	}

	const cleanupToc = () => async tree => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName === 'li' && node.children?.[0]?.tagName == 'a') {
				let v = node.children[0].children[0].value.split('(')

				node.children[0].children[0].value =
					v.length > 1 ? v[0] + '()' : v[0]
			}

			if (node.tagName === 'h6' && node.children[0].value == 'toc') {
				removeNode(index, parent)
			}
		})
	}

	const removeToc = () => async tree => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName === 'li') {
				removeNode(index, parent)
			}
		})
	}

	let md = await res.text()

	let parsed = await unified()
		.use(remarkParse)
		.use(remarkToc)
		// todo: fix some links that don't parse correctly
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeSlug)
		// todo: optimise, visits the tree several times. Move all into the same method?
		.use(cleanupToc) // should move to getToc, and run in new tree. (Has no effect when using stringify, solve)
		.use(getToc)
		.use(removeToc)
		.use(getNav)
		.use(rehypeStarryNight)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(md)

	return { content: parsed.value, toc, nav }
}

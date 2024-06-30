import $chunk from "./chunk.js";
import $dummy from "./dummy.js";
import $editor from "./editor.js";

const $buffer = {
	init() {
		this.types = ["chunk", "dummy"];
		this.clear();
	},

	push(entries) {
		this.ioEntries.push(...entries);
	},

	flush() {
		this.ioEntries.forEach(entry => this.entryIterator(entry));
		this.types.forEach(type => this.bufferFlush(type));
		this.clear();
	},

	clear() {
		this.ioEntries = [];
		this.chunk = { html: [], index: [], oldElements: [] };
		this.dummy = { html: [], index: [], oldElements: [] };
	},

	/**
	 * entries 일괄 처리
	 * @param {IntersectionObserverEntry} entry
	 */
	entryIterator(entry) {
		const { isIntersecting, target, boundingClientRect } = entry;

		const isDummy = target.classList.contains("content-dummy");
		if (isIntersecting !== isDummy) return;

		const isUnsafeElement = target.hasAttribute("data-ck-unsafe-element");
		if (isUnsafeElement) return;

		const type = isIntersecting ? this.types[0] : this.types[1];
		const index = getIndex(target);
		const height = isIntersecting ? 0 : boundingClientRect.height;
		this.setBuffer(type, index, height);
	},

	setBuffer(type, index, height) {
		const html = type === this.types[0] ? $chunk.getData(index) : $dummy.getDummyHtml(height);
		if (!html) return;

		this[type].html.push(html);
		this[type].index.push(index);
		this[type].oldElements.push($editor.getRootChild(index));
	},

	bufferFlush(type) {
		if (this[type].html.length <= 0) return;

		if (type === this.types[1]) {
			const htmlText = $editor.getHtmlText();
			const body = $chunk.getBody(htmlText);
			this[type].index.forEach(idx => this.dummyIterator(idx, body));
		}

		$editor.replaceAll(this[type].index, this[type].html, this[type].oldElements);
	},

	dummyIterator(index, data) {
		const element = $editor.getElement(index, data);
		const text = element?.outerHTML;
		if (!text) return;
		const isDummy = text.includes("content-dummy");
		if (!isDummy) return;
		const isUnsafe = text.includes("data-ck-unsafe-element");
		if (isUnsafe) return;
		const isSame = text === $chunk.getData(index);
		if (isSame) return;
		$chunk.setData(index, text);
	},
}

export default $buffer;

/**
 * 노드 순회하며 인덱스 반환
 * @param {HTMLParagraphElement} element
 * @returns {number}
 */
function getIndex(element) {
	let index = 0;
	while ((element = element.previousElementSibling) != null) {
		index++;
	}
	return index;
}

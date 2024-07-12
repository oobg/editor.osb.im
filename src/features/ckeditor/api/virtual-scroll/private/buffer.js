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
		this.types.forEach(type => this[type].html.length > 0 && this.bufferFlush(type));
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

		const isDummy = target.hasAttribute("data-content-dummy");
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
		this[type].oldElements.push($editor.model.getChild(index));
	},

	bufferFlush(type) {
		if (type === this.types[1]) {
			this[type].index.forEach(idx => this.dummyIterator(idx));
		}
		$editor.replaceAll(this[type].index, this[type].html, this[type].oldElements);
	},

	dummyIterator(index) {
		const element = $editor.getContentAtIndex(index);
		if (!element) return;
		if (element.includes("data-content-dummy") || element.includes("data-ck-unsafe-element")) return;
		const chunk = $chunk.getData(index);
		if (element !== chunk) $chunk.setData(index, element);
	},
}

export default $buffer;

/**
 * 노드 순회하며 인덱스 반환
 * @param {HTMLElement} element
 * @returns {number}
 */
function getIndex(element) {
	let index = 0;
	while ((element = element.previousElementSibling) != null) {
		index++;
	}
	return index;
}

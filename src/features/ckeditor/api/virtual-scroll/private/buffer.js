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
		this.types.forEach(type => this.get(type).length > 0 && this.bufferFlush(type));
		this.clear();
	},

	clear() {
		this.ioEntries = [];
		this.chunk = [];
		this.dummy = [];
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
		const isChunk = type === this.types[0];
		const html = isChunk ? $chunk.getData(index) : $dummy.getHtml(height);
		if (!html) return;

		const oldEl = $editor.model.getChild(index);
		const newEl = $editor.createModelFragment(html);
		this.get(type).push({ index, oldEl, newEl });
	},

	bufferFlush(type) {
		const isDummy = type === this.types[1];
		isDummy && this.dummy.forEach(({index}) => this.dummyIterator(index));
		$editor.replaceAll(this.get(type));
	},

	dummyIterator(index) {
		const element = $editor.getContentAtIndex(index);
		if (!element) return;
		if (element.includes("data-content-dummy") || element.includes("data-ck-unsafe-element")) return;
		const chunk = $chunk.getData(index);
		if (element !== chunk) $chunk.setData(index, element);
	},

	get(type) {
		return this[type];
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
	while ((element = element.previousElementSibling) != null) index++;
	return index;
}

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
		this.ioEntries.forEach(entry => entryIterator(entry));
		this.types.forEach(type => getBuffer(type).length > 0 && bufferFlush(type));
		this.clear();
	},

	clear() {
		this.ioEntries = [];
		this.chunk = [];
		this.dummy = [];
	},
}

export default $buffer;

/**
 * entries 일괄 처리
 * @param {IntersectionObserverEntry} entry
 */
function entryIterator(entry) {
	const { isIntersecting, target, boundingClientRect } = entry;

	const isDummy = target.hasAttribute("data-content-dummy");
	if (isIntersecting !== isDummy) return;

	const isUnsafeElement = target.hasAttribute("data-ck-unsafe-element");
	if (isUnsafeElement) return;

	const type = isIntersecting ? $buffer.types[0] : $buffer.types[1];
	const index = getIndex(target);
	const height = isIntersecting ? 0 : boundingClientRect.height;
	setBuffer(type, index, height);
}

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

function getBuffer(type) {
	return $buffer[type];
}

function setBuffer(type, index, height) {
	const isChunk = type === $buffer.types[0];
	const html = isChunk ? $chunk.getData(index) : $dummy.getHtml(height);
	if (!html) return;

	const oldEl = $editor.model.getChild(index);
	const newEl = $editor.model.createFragment(html);
	const buffer = { index, oldEl, newEl };
	getBuffer(type).push(buffer);
}

function bufferFlush(type) {
	const isDummy = type === $buffer.types[1];
	isDummy && $buffer.dummy.forEach(({index}) => dummyIterator(index));
	$editor.replaceAll(getBuffer(type));
}

function dummyIterator(index) {
	const element = $editor.getDataAtIndex(index);
	if (!element) return;
	if (element.includes("data-content-dummy") || element.includes("data-ck-unsafe-element")) return;
	const chunk = $chunk.getData(index);
	if (element !== chunk) $chunk.setData(index, element);
}

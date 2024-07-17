import $chunk from "./chunk.js";
import $dummy from "./dummy.js";
import $editor from "./editor.js";

const types = [ Symbol("chunk"), Symbol("dummy") ];
let chunk = [];
let dummy = [];

const init = () => clear();

const push = (entries) => {
	const filtered = entries.filter(entry => validateDataSet(entry.target));
	entryIterator(filtered);
}

const flush = () => {
	chunk.length > 0 && bufferFlush(types[0]);
	dummy.length > 0 && bufferFlush(types[1]);
	clear();
};

const clear = () => {
	chunk = [];
	dummy = [];
};

/**
 * entries 일괄 처리
 * @param {IntersectionObserverEntry[]} entries
 */
const entryIterator = (entries) => {
	for (const entry of entries) {
		const { isIntersecting, target, boundingClientRect } = entry;

		const isDummy = target.hasAttribute("data-content-dummy");
		if (isIntersecting !== isDummy) return;

		const type = isIntersecting ? types[0] : types[1];
		const index = getIndex(target);
		const height = isIntersecting ? 0 : boundingClientRect.height;
		setBuffer(type, index, height);
	}
};

/**
 * 노드 순회하며 인덱스 반환
 * @param {HTMLElement} element
 * @returns {number}
 */
const getIndex = (element) => {
	let index = 0;
	while ((element = element.previousElementSibling) != null) index++;
	return index;
};

const getBuffer = (type) => type === types[0] ? chunk : dummy;

const setBuffer = (type, index, height) => {
	const isChunk = type === types[0];
	const html = isChunk ? $chunk.getData(index) : $dummy.getHtml(height);
	if (!html) return;

	const oldEl = $editor.model.getChild(index);
	const newEl = $editor.model.createFragment(html);
	const buffer = { index, oldEl, newEl };
	getBuffer(type).push(buffer);
};

const bufferFlush = (type) => {
	const isDummy = type === types[1];
	isDummy && dummy.forEach(({ index }) => dummyIterator(index));
	$editor.replaceAll(getBuffer(type));
};

const dummyIterator = (index) => {
	const element = $editor.getDataAtIndex(index);
	if (!element) return;
	if (detectDataSet(element)) return;
	const chunk = $chunk.getData(index);
	if (element !== chunk) $chunk.setData(index, element);
};

const detectDataSet = (element) => /data-(content-dummy|ck-unsafe-element)/.test(element);
const validateDataSet = (element) => !element.hasAttribute("data-ck-unsafe-element");

export default {
	init,
	push,
	flush,
	clear,
};

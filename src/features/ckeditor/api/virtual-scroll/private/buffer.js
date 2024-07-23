import $chunk from "./chunk.js";
import $editor from "./editor.js";

const types = [ Symbol.for("chunk"), Symbol.for("dummy") ];
let chunk = [];
let dummy = [];

const init = () => clear();

const push = (entries) => {
	const filtered = entries.filter(entry => !entry.target.hasAttribute("data-ck-unsafe-element"));
	entryIterator(filtered);
}

const flush = () => {
	if (chunk.length > 0) bufferFlush(types[0]);
	if (dummy.length > 0) bufferFlush(types[1]);
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
		if (isIntersecting !== isDummy) continue;

		const type = isIntersecting ? types[0] : types[1];
		const index = getIndex(target);
		const height = isIntersecting ? 0 : boundingClientRect.height;
		setBuffer(type, index, height);
	}
};

const getIndex = (element) => {
	let index = 0;
	while ((element = element.previousElementSibling) != null) index++;
	return index;
};

const getBuffer = (type) => type === types[0] ? chunk : dummy;

const setBuffer = (type, index, height) => {
	const html = type === types[0] ? $chunk.getInnerData(index) : "";
	const isHtml = isHtmlString(html);
	const element = isHtml ? $editor.model.createFragment(html) : html;
	getBuffer(type).push({ index, element, type, height });
};

const bufferFlush = (type) => {
	if (type === types[1]) {
		for (const { index } of dummy) {
			dummyIterator(index);
		}
	}
	$editor.replaceAll(getBuffer(type));
};

const dummyIterator = (index) => {
	const element = $editor.getDataAtIndex(index);
	if (!element && element.trim() === "") return;
	$chunk.setInnerData(index, element);
};

const isHtmlString = str => /<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/i.test(str);

export default {
	init,
	push,
	flush,
	clear,
};

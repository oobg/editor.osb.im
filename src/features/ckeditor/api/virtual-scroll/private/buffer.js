import $chunk from "./chunk.js";
import $dummy from "./dummy.js";
import $editor from "./editor.js";

const types = [ Symbol("chunk"), Symbol("dummy") ];
const chunk = [];
const dummy = [];

/**
 * 버퍼 초기화
 */
const init = () => clear();

/**
 * IntersectionObserver 콜백 함수: viewport와 target element의 교차 여부 확인
 * @param {IntersectionObserverEntry[]} entries
 */
const push = (entries) => entryIterator(entries);

/**
 * 버퍼에 쌓인 데이터를 CKEditor 모델에 일괄 삽입
 */
const flush = () => {
	if (chunk.length > 0) bufferFlush(types[0]);
	if (dummy.length > 0) bufferFlush(types[1]);
	clear();
};

/**
 * 버퍼 초기화
 */
const clear = () => {
	chunk.length = 0;
	dummy.length = 0;
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

		const isUnsafe = target.hasAttribute("data-ck-unsafe-element");
		if (isUnsafe) continue;

		const type = isIntersecting ? types[0] : types[1];
		const index = getIndex(target);
		const height = isIntersecting ? 0 : boundingClientRect.height;

		setBuffer(type, index, height);
		if (!isIntersecting && !isDummy) setDummy(index, target.outerHTML);
	}
};

/**
 * Element의 인덱스 반환
 * @param {Element} element
 * @returns {number} 인덱스
 */
const getIndex = (element) => {
	let index = 0;
	while ((element = element.previousElementSibling) != null) index++;
	return index;
};

/**
 * 버퍼 반환
 * @param {Symbol} type
 * @returns {chunk[]|dummy[]}
 */
const getBuffer = (type) => type === types[0] ? chunk : dummy;

/**
 * 버퍼에 데이터 추가
 * @param {Symbol} type
 * @param {number} index
 * @param {number} height
 */
const setBuffer = (type, index, height) => {
	const html = type === types[0] ? $chunk.getData(index) : $dummy.getHtml(height);
	const oldEl = $editor.model.getChild(index);
	const newEl = $editor.model.createFragment(html);

	const buffer = getBuffer(type);
	buffer.push({ index, oldEl, newEl });
};

/**
 * 더미 데이터 추가
 * @param {number} index
 * @param {string} text
 */
const setDummy = (index, text) => $chunk.setData(index, text);

/**
 * 버퍼 비우기
 * @param {Symbol} type
 */
const bufferFlush = (type) => $editor.replaceAll(getBuffer(type));

export default {
	init,
	push,
	flush,
	clear,
};

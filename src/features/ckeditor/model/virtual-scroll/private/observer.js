import $editor from "./editor.js";
import $buffer from "./buffer.js";

const observers = {
	io: null,
	mo: null,
};

const options = {
	root: null,
	rootMargin: "1000% 0px",
	threshold: 0,
	delay: 100,
};

/**
 * IntersectionObserver config root 설정
 */
const init = () => options.root = $editor.document.getRoot();

/**
 * IntersectionObserver와 MutationObserver 연결
 */
const connect = () => {
	observers.io = new IntersectionObserver(intersectionHandler, options);
	observers.mo = new MutationObserver(mutationHandler);
	observers.mo.observe(options.root, { childList: true });
}

/**
 * IntersectionObserver와 MutationObserver 해제
 */
const disconnect = () => {
	for (const name in observers) {
		if (!observers[name]) continue;
		observers[name].takeRecords();
		observers[name].disconnect();
		observers[name] = null;
	}
}

/**
 * IntersectionObserver 콜백 함수: viewport와 target element의 교차 여부 확인
 * @param {IntersectionObserverEntry[]} entries
 * @param {IntersectionObserver} observer
 */
const intersectionHandler = (entries, observer) => {
	$buffer.push(entries);
	$buffer.flush();
}

/**
 * MutationObserver 콜백 함수: DOM 변경 감지
 * @param {MutationRecord[]} mutations
 */
const mutationHandler = (mutations) => {
	mutations.forEach(mutation => {
		if (mutation.type !== "childList") return;
		const { addedNodes, removedNodes } = mutation;
		addedNodes && processNodes(addedNodes, observe);
		removedNodes && processNodes(removedNodes, unobserve);
	});
}

/**
 * NodeList 순회하며 콜백 함수 실행
 * @param {NodeList} nodes
 * @param {Function} action
 * @returns {*}
 */
const processNodes = (nodes, action) => nodes.forEach(node => node.nodeType === 1 && action(node));

/**
 * target element를 IntersectionObserver에 등록
 * @param {Element} node
 * @returns {void|*}
 */
const observe = (node) => validate(node) && observers.io.observe(node);

/**
 * target element를 IntersectionObserver에서 해제
 * @param {Element} node
 * @returns {void|*}
 */
const unobserve = (node) => observers.io.unobserve(node);

/**
 * target element 유효성 검사
 * @param {Element} node
 * @returns {boolean}
 */
const validate = (node) => !node.querySelector("img") && !node.classList.contains("ck-fake-selection-container");

export default {
	init,
	connect,
	disconnect,
}
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

const init = () => options.root = $editor.document.getRoot();

const connect = () => {
	observers.io = new IntersectionObserver(intersectionHandler, options);
	observers.mo = new MutationObserver(mutationHandler);
	observers.mo.observe(options.root, { childList: true });
}

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
	if (entries.length === 1 && isSelection(entries[0].target)) return;
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

const processNodes = (nodes, action) => nodes.forEach(node => node.nodeType === 1 && action(node));
const observe = (element) => !isSelection(element) && !isImage(element) && observers.io.observe(element);
const unobserve = (element) => observers.io.unobserve(element);
const isSelection = (element) => element.classList.contains("ck-fake-selection-container");
const isImage = (element) => element.querySelector("img");

export default {
	init,
	connect,
	disconnect,
}
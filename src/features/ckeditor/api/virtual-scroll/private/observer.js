import $editor from "./editor.js";
import $buffer from "./buffer.js";

const $observer = {
	options: {
		root: null,
		rootMargin: "1000% 0px",
		threshold: 0,
	},
	io: null,
	mo: null,

	init() {
		this.root = $editor.document.getRoot();
		this.options.root = this.root;
		this.connect();
	},

	connect() {
		// Intersection Observer 초기화
		this.io = new IntersectionObserver(intersectionHandler.bind(this), this.options);

		// Mutation Observer 초기화
		this.mo = new MutationObserver(mutationHandler.bind(this));
		this.mo.observe(this.root, { childList: true });
	},

	disconnect() {
		const observerList = ["io", "mo"];
		observerList.forEach(observer => {
			this[observer]?.takeRecords();
			this[observer]?.disconnect();
			this[observer] = null;
		});
	},
}

export default $observer;

/**
 * IntersectionObserver 콜백 함수: viewport와 target element의 교차 여부 확인
 * @param {IntersectionObserverEntry[]} entries
 * @param {IntersectionObserver} observer
 */
function intersectionHandler(entries, observer) {
	$buffer.push(entries);
	$buffer.flush();
}

/**
 * MutationObserver 콜백 함수: DOM 변경 감지
 * @param {MutationRecord[]} mutations
 */
function mutationHandler(mutations) {
	mutations.forEach(mutation => {
		if (mutation.type !== "childList") return;
		const { addedNodes, removedNodes } = mutation;
		addedNodes && processNodes(addedNodes, observe);
		removedNodes && processNodes(removedNodes, unobserve);
	});
}

/**
 * 노드 목록을 순회하며 콜백 함수 실행
 * @param {NodeList} nodes
 * @param {function} action
 */
function processNodes(nodes, action) {
	nodes.forEach(node => node.nodeType === 1 && action.call(this, node));
}

function observe(element) {
	$observer.io.observe(element);
}

function unobserve(element) {
	$observer.io.unobserve(element);
}
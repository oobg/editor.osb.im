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
		// Intersection Observer 초기화
		const root = $editor.document.getRoot();
		this.options.root = root;
		this.io = new IntersectionObserver(this.intersectionHandler.bind(this), this.options);

		// Mutation Observer 초기화
		this.mo = new MutationObserver(this.mutationHandler.bind(this));
		this.mo.observe(root, { childList: true });
	},

	/**
	 * IntersectionObserver 콜백 함수: viewport와 target element의 교차 여부 확인
	 * @param {IntersectionObserverEntry[]} entries
	 * @param {IntersectionObserver} observer
	 */
	intersectionHandler(entries, observer) {
		$buffer.push(entries);
		$buffer.flush();
	},

	/**
	 * MutationObserver 콜백 함수: DOM 변경 감지
	 * @param {MutationRecord[]} mutations
	 */
	mutationHandler(mutations) {
		requestAnimationFrame(() => {
			mutations.forEach(mutation => {
				if (mutation.type !== "childList") return;

				this.processNodes(mutation.addedNodes, this.observe);
				this.processNodes(mutation.removedNodes, this.unobserve);
			});
		})
	},

	/**
	 * 노드 목록을 순회하며 콜백 함수 실행
	 * @param {NodeList} nodes
	 * @param {function} action
	 */
	processNodes(nodes, action) {
		nodes.forEach(node => node.nodeType === 1 && action.call(this, node));
	},

	observe(element) {
		this.io.observe(element);
	},

	unobserve(element) {
		this.io.unobserve(element);
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

import $editor from "./editor.js";
import $buffer from "./buffer.js";

const $observer = {
	options: {
		root: null,
		rootMargin: "0px",
		threshold: 0,
	},
	io: null,
	mo: null,

	async init() {
		// Intersection Observer 초기화
		this.root = await $editor.getEditorDom();
		this.options.root = this.root;
		this.options.rootMargin = "1000% 0px";
		this.io = new IntersectionObserver(this.intersectionHandler.bind(this), this.options);

		// Mutation Observer 초기화
		this.mo = new MutationObserver(this.mutationHandler.bind(this));
		this.mo.observe(this.root, { childList: true });
	},

	change(isAccessibility) {
		this.io.takeRecords();
		this.io.disconnect();
		this.options.rootMargin = isAccessibility ? "0px" : "1000% 0px";

		this.io = new IntersectionObserver(this.intersectionHandler.bind(this), this.options);
		const elements = Array.from(this.root.children);
		elements.forEach(element => this.observe(element));
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

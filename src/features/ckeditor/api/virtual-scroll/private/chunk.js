
const $chunk = {
	parser: new DOMParser(),

	init(html) {
		this.data = this.parseHtml(html);
	},

	getBody(html) {
		const doc = this.parser.parseFromString(html, 'text/html');
		return doc.body;
	},

	/**
	 * HTML Text 파싱해서 배열로 반환
	 * @param {string} html
	 * @returns {string[]}
	 */
	parseHtml(html) {
		const body = this.getBody(html);
		const elements = Array.from(body.childNodes).filter(node => node.nodeType === 1);

		if (elements.length === 0) return [""];

		return elements.map(element => element.outerHTML);
	},

	/**
	 * 배열의 특정 데이터 가져오기
	 * @param {number} index
	 * @returns {string}
	 */
	getData(index) {
		return this.data[index];
	},

	getText() {
		return this.data.join("");
	},

	/**
	 * 배열의 특정 데이터 변경
	 * @param {number} index
	 * @param {string} value
	 */
	setData(index, value) {
		this.data[index] = value;
	},

	getLength() {
		return this.data.length;
	},

	/**
	 * 배열의 특정 위치에 데이터 삽입
	 * @param {number} index
	 * @param {string} value
	 */
	insertData(index, value) {
		this.data.splice(index, 0, value);
	},

	/**
	 * 배열의 특정 위치의 데이터 삭제
	 * @param {number} index
	 */
	removeData(index) {
		this.data.splice(index, 1);
	},

	updateData(html) {
		const children = this.parseHtml(html);
		this.data.length = children.length;

		children.forEach((child, index) => {
			const isDummy = child.includes("data-content-dummy");
			if (!isDummy) this.setData(index, child);
		});
	},
}

export default $chunk;

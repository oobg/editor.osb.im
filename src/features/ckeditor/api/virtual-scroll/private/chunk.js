let data = [];

const parser = new DOMParser();
const parse = (html) => parser.parseFromString(html, 'text/html');
const parseHtml = (html) => {
	const elements = Array.from(parse(html).body.childNodes)
		.filter(node => node.nodeType === 1)
		.map(element => element.outerHTML);

	return elements.length > 0 ? elements : [""];
};

const init = (html) => (data = parseHtml(html));
const getLength = () => data.length;
const getText = () => data.join("");
const getData = (index) => data[index];
const setData = (index, value) => (data[index] = value);
const insertData = (index, value = "") => data.splice(index, 0, value);
const removeData = (index) => data.splice(index, 1);

const updateData = (html) => {
	const children = parseHtml(html);

	// 비교를 통해 기존 데이터와 새 데이터 업데이트
	const maxLength = Math.max(data.length, children.length);
	for (let i = 0; i < maxLength; i++) {
		const oldChild = data[i];
		const newChild = children[i];

		// 새 데이터가 더 길다면 새로운 요소 추가
		if (i >= data.length) {
			data.push(newChild);
			continue;
		}

		// 기존 데이터가 더 길다면 기존 요소 삭제
		if (i >= children.length) {
			data.splice(i, 1);
			i--; // 삭제 후 인덱스를 조정
			continue;
		}

		// 두 데이터가 다르다면 업데이트
		if (oldChild !== newChild) {
			const isDummy = newChild.includes("data-content-dummy");
			if (!isDummy) {
				data[i] = newChild;
			}
		}
	}
};

export default {
	init,
	getLength,
	getText,
	getData,
	setData,
	insertData,
	removeData,
	updateData,
};

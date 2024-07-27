let data = [];

const parser = new DOMParser();
const parse = (html) => parser.parseFromString(html, "text/html");
const getChildren = (html) => [...parse(html).body.children].filter(node => node.nodeType === 1);
const validate = (element) => element && element.hasAttribute("data-content-dummy");

const init = (html) => {
	data = [];
	const elements = getChildren(html);
	for (const element of elements) {
		data.push(element.outerHTML);
	}
};

const getLength = () => data.length;
const getText = () => data.join("");
const getData = (index = null) => index !== null ? data[index] : data;
const setData = (index, value) => (data[index] = value);

const insertData = (index, value = "") => data.splice(index, 0, value);
const removeData = (index) => data.splice(index, 1);
const updateData = (html) => {
	const elements = getChildren(html);
	let maxLength = Math.max(data.length, elements.length);
	let i = 0;

	while (i < maxLength) {
		if (i < elements.length && validate(elements[i])) {
			i++;
			continue;
		}

		if (i >= data.length) {
			data.push(elements[i].outerHTML);
		} else if (i >= elements.length) {
			data.splice(i, 1);
			maxLength--;
		} else if (data[i] !== elements[i].outerHTML) {
			data[i] = elements[i].outerHTML;
		}
		i++;
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
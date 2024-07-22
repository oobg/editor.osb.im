let outer = [];
let inner = [];

const parser = new DOMParser();
const parse = (html) => parser.parseFromString(html, "text/html");
const getChildren = (html) => [...parse(html).body.children].filter(node => node.nodeType === 1);
const validate = (element) => element.hasAttribute("data-content-dummy");

const init = (html) => {
	outer = [];
	inner = [];
	const elements = getChildren(html);
	for (const parent of elements) {
		outer.push(parent.cloneNode(false));
		inner.push(parent.innerHTML ?? "");
	}
};

const getLength = () => Math.max(outer.length, inner.length);
const getText = () => {
	return outer.map((parent, i) => {
		const out = parent.cloneNode(false);
		out.innerHTML = inner[i];
		return out.outerHTML;
	}).join("");
};

const getOuterData = (index) => outer[index].cloneNode(false);
const getInnerData = (index) => inner[index];
const setOuterData = (index, value) => (outer[index] = value.cloneNode(false));
const setInnerData = (index, value) => (inner[index] = value);

const insertData = (index, value = "") => {
	outer.splice(index, 0, value);
	inner.splice(index, 0, value);
};

const removeData = (index) => {
	outer.splice(index, 1);
	inner.splice(index, 1);
};

const updateData = (html) => {
	const elements = getChildren(html);
	const maxLength = Math.max(outer.length, elements.length);

	for (let i = 0; i < maxLength; i++) {
		if (validate(elements[i])) continue;

		if (i >= outer.length) {
			outer.push(elements[i].cloneNode(false));
			inner.push(elements[i].innerHTML ?? "");
		} else if (i >= elements.length) {
			outer.splice(i, 1);
			inner.splice(i, 1);
			i--;
		} else {
			const newOuter = elements[i].cloneNode(false);
			const newInner = elements[i].innerHTML ?? "";

			if (outer[i].outerHTML !== newOuter.outerHTML) {
				outer[i] = newOuter;
				inner[i] = newInner;
			}
		}
	}
};

export default {
	init,
	getLength,
	getText,
	getOuterData,
	getInnerData,
	setOuterData,
	setInnerData,
	insertData,
	removeData,
	updateData,
};

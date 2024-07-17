import $chunk from './chunk.js';

const $editor = {
	init(editor) {
		this.editor = editor;

		this.isReplacing = false;
		this.lastParagraphCount = 0;
	},

	setData(html) {
		this.editor.setData(html);
	},

	getData() {
		return this.editor.getData();
	},

	getDataAtIndex(index) {
		const modelElement = this.model.getChild(index);
		if (!modelElement) return "";
		let tagName = convertTagName(modelElement.name);
		const attributes = convertAttributesToHtmlString(modelElement);
		const viewFragment = this.editor.data.toView(modelElement);
		let html = this.editor.data.processor.toData(viewFragment);
		return createHtmlTag(tagName, attributes, html);
	},

	/**
	 * 1 change 내에서 여러 Element를 교체
	 * @param {[{ index: number, oldEl: HTMLModElement, newEl: DocumentFragment }]} data
	 *  - index: 삽입할 인덱스
	 *  - oldEl: 삭제할 Element
	 *  - newEl: 새로운 Element
	 */
	replaceAll(data) {
		this.isReplacing = true;
		this.editor.model.change(writer => replace(writer, data));
		this.isReplacing = false;
	},

	document: {
		/**
		 * Model Element -> View Element -> DOM Element
		 * @param {HTMLModElement} modelElement
		 * @returns {HTMLElement}
		 */
		findElement(modelElement) {
			const viewElement = $editor.editor.editing.mapper.toViewElement(modelElement);
			return $editor.editor.editing.view.domConverter.mapViewToDom(viewElement);
		},

		getRoot() {
			const root = $editor.model.getRoot();
			return this.findElement(root);
		},
	},

	model: {
		getRoot() {
			return $editor.editor.model.document.getRoot();
		},

		getChild(index) {
			return this.getRoot().getChild(index);
		},

		getChildCount() {
			return this.getRoot().childCount;
		},

		/**
		 * HTML String -> View Fragment -> Model Fragment
		 * @param {string} html
		 * @returns {DocumentFragment}
		 */
		createFragment(html) {
			const viewFragment = $editor.editor.data.processor.toView(html);
			return $editor.editor.data.toModel(viewFragment);
		},

		insertElement(target, index) {
			$editor.editor.model.change(writer => writer.insert(target, this.getRoot(), index));
		},

		removeElement(target) {
			$editor.editor.model.change(writer => writer.remove(target));
		},
	},

	paragraph: {
		// 문단 수 카운트 및 감시
		setWatch() {
			$editor.lastParagraphCount = $editor.model.getChildCount();
			$editor.editor.model.document.on("change:data", () => paragraphWatcher);
		},

		removeWatch() {
			$editor.editor.model.document.off("change:data", () => paragraphWatcher);
		},
	},

	scroll: {
		setWatch() {
			const root = $editor.document.getRoot();
			root.addEventListener("scroll", scrollEvent);
		},

		removeWatch() {
			const root = $editor.document.getRoot();
			root.removeEventListener("scroll", scrollEvent);
		},
	},
}

export default $editor;

function replace(writer, data) {
	data.forEach(({ index, oldEl, newEl }) => {
		writer.insert(newEl, $editor.model.getRoot(), index);
		writer.remove(oldEl);
	});
}

function convertTagName(tagName) {
	if (tagName.startsWith('heading')) {
		tagName = `h${tagName.slice(-1)}`;
	} else if (tagName === 'paragraph') {
		tagName = 'p';
	}
	return tagName;
}

function convertAttributesToHtmlString(modelElement) {
	const attributes = modelElement.getAttributes();
	if (Object.keys(attributes).length === 0) return;

	const keys = Object.keys(attributes);
	return keys.map(key => `${key}="${attributes[key]}"`).join(" ");
}

function createHtmlTag(tagName, attributes, html) {
	const attribute = attributes ? ` ${attributes}` : "";
	return `<${tagName}${attribute}>${html}</${tagName}>`;
}

function paragraphWatcher(eventInfo, batch) {
	const count = $editor.model.getChildCount();
	if ($editor.isReplacing || $editor.lastParagraphCount === count) return;

	// 문단 수 동기화
	$editor.lastParagraphCount = count;

	// 문단 수가 변경되었을 때 처리
	const changes = eventInfo.source.differ.getChanges();
	changes.forEach(change => onChange(change));
}

function onChange(change) {
	const index = change.position.path[0];
	switch (change.type) {
		case 'insert':
			$chunk.insertData(index);
			break;
		case 'remove':
			$chunk.removeData(index);
			break;
		default:
			break;
	}
}

function scrollEvent(event) {
	const isFocus = $editor.editor.ui.focusTracker.isFocused;
	if (!isFocus) return;

	event.target.blur();
	$editor.scroll.removeWatch();
}

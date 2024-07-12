import $chunk from './chunk.js';

const $editor = {
	init(editor) {
		this.editor = editor;
		this.root = this.editor.model.document.getRoot();

		this.isReplacing = false;
		this.lastParagraphCount = 0;
	},

	/**
	 * HTML String -> View Fragment -> Model Fragment
	 * @param {string} html
	 * @returns {DocumentFragment}
	 */
	createModelFragment(html) {
		const viewFragment = this.editor.data.processor.toView(html);
		return this.editor.data.toModel(viewFragment);
	},

	insertModelElement(target, index) {
		this.editor.model.change(writer => writer.insert(target, this.root, index));
	},

	removeModelElement(target) {
		this.editor.model.change(writer => writer.remove(target));
	},

	/**
	 * 1 change 내에서 여러 Element를 교체
	 * @param {index[]} index
	 * @param {string[]} html
	 * @param {HTMLModElement[]} oldElements
	 */
	replaceAll(index, html, oldElements) {
		this.isReplacing = true;
		const fragments = html.map(html => this.createModelFragment(html));
		this.editor.model.change(writer => {
			fragments.forEach((fragment, i) => {
				writer.insert(fragment, this.root, index[i]);
				oldElements[i] && writer.remove(oldElements[i]);
			});
		});
		this.isReplacing = false;
	},

	/**
	 * Model Element -> View Element -> DOM Element
	 * @param {HTMLModElement} modelElement
	 * @returns {HTMLElement}
	 */
	findDomElement(modelElement) {
		const viewElement = this.editor.editing.mapper.toViewElement(modelElement);
		return this.editor.editing.view.domConverter.mapViewToDom(viewElement);
	},

	getContentAtIndex(index) {
		const modelElement = this.model.getChild(index);
		if (!modelElement) return "";
		const viewFragment = this.editor.data.toView(modelElement);
		let html = this.editor.data.processor.toData(viewFragment);

		let tagName = modelElement.name;
		if (tagName.startsWith('heading')) {
			tagName = `h${tagName.slice(-1)}`;
		} else if (tagName === 'paragraph') {
			tagName = 'p';
		}

		const attributes = Array.from(modelElement.getAttributeKeys())
			.map(attrKey => `${attrKey}="${modelElement.getAttribute(attrKey)}"`)
			.join(' ');

		return `<${tagName}${attributes && ` ${attributes}`}>${html}</${tagName}>`;
	},

	setData(html) {
		this.editor.setData(html);
	},

	getData() {
		return this.editor.getData();
	},

	document: {
		getRoot() {
			return $editor.findDomElement($editor.model.getRoot());
		},

		getChildCount() {
			return this.getRoot().childElementCount;
		},
	},

	model: {
		getRoot() {
			return $editor.root;
		},

		getChild(index) {
			return this.getRoot().getChild(index);
		},
	},

	// 문단 수 카운트 및 감시
	setParagraphWatch() {
		this.lastParagraphCount = this.document.getChildCount();
		this.editor.model.document.on("change:data", () => this.paragraphWatcher);
	},

	removeParagraphWatch() {
		this.editor.model.document.off("change:data", () => this.paragraphWatcher);
	},

	paragraphWatcher(eventInfo, batch) {
		const count = this.root.childCount;
		if (this.isReplacing || this.lastParagraphCount === count) return;

		// 문단 수 동기화
		this.lastParagraphCount = count;

		// 문단 수가 변경되었을 때 처리
		const changes = eventInfo.source.differ.getChanges();
		changes.forEach(change => handleModelChange(change));
	}
}

export default $editor;

function handleModelChange(change, htmlText) {
	const index = change.position.path[0];
	switch (change.type) {
		case 'insert':
			const data = $editor.getContentAtIndex(index);
			$chunk.insertData(index, data);
			break;
		case 'remove':
			$chunk.removeData(index);
			break;
		default:
			break;
	}
}

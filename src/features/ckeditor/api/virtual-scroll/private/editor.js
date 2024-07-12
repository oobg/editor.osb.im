import $chunk from './chunk.js';

const $editor = {
	init(editor) {
		this.editor = editor;
		this.engine = this.editor.editing;
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
		const viewElement = this.engine.mapper.toViewElement(modelElement);
		return this.engine.view.domConverter.mapViewToDom(viewElement);
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
	},

	model: {
		getRoot() {
			return $editor.root;
		},

		getChild(index) {
			return this.getRoot().getChild(index);
		},

		getChildCount() {
			return this.getRoot().childCount;
		},
	},

	// 문단 수 카운트 및 감시
	setParagraphWatch() {
		this.lastParagraphCount = this.model.getChildCount();
		this.editor.model.document.on("change:data", () => paragraphWatcher);
	},

	removeParagraphWatch() {
		this.editor.model.document.off("change:data", () => paragraphWatcher);
	},
}

export default $editor;

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
			$chunk.insertData(index, $editor.getContentAtIndex(index));
			break;
		case 'remove':
			$chunk.removeData(index);
			break;
		default:
			break;
	}
}

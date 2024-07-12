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

	getHtmlText() {
		return this.editor.getData();
	},

	getElement(index, body) {
		return body?.children[index] || null;
	},

	getRootChild(index) {
		return this.root.getChild(index);
	},

	getEditorDom() {
		return this.findDomElement(this.root);
	},

	setData(html) {
		this.editor.setData(html);
	},

	getData(index, htmlText = null) {
		const body = $chunk.getBody(htmlText);
		return body?.children[index]?.outerHTML || "";
	},

	// 문단 수 카운트 및 감시
	setParagraphWatch() {
		this.lastParagraphCount = this.getEditorDom().childElementCount;
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
		const htmlText = $editor.getHtmlText();
		changes.forEach(change => handleModelChange(change, htmlText) );
	}
}

export default $editor;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * dummy element를 기다리는 함수
 * @param {Element} element - 현재 element
 * @param {number[]} childIndex - 자손 element의 index 배열
 * @param {number} startTime - 탐색 시작 시간
 * @param {number} timeout - 탐색 제한 시간
 * @returns {Promise<void>} - dummy element가 아니게 될 때까지 대기
 */
async function waitForNonDummyElement(element, childIndex, startTime, timeout) {
	let isDummy = true;

	while (isDummy) {
		// Timeout check
		if (Date.now() - startTime >= timeout) {
			throw new Error("Operation timed out");
		}

		// Check dummy element
		const parent = element.getChild(childIndex[0]);
		isDummy = parent.hasAttribute("data-content-dummy");

		// Wait for 50ms
		if (isDummy) await sleep(50);
	}
}

function handleModelChange(change, htmlText) {
	const index = change.position.path[0];
	switch (change.type) {
		case 'insert':
			const data = $editor.getData(index, htmlText);
			$chunk.insertData(index, data);
			break;
		case 'remove':
			$chunk.removeData(index);
			break;
		default:
			break;
	}
}

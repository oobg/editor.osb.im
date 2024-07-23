import $chunk from './chunk.js';

let editor = null;
let isReplacing = false;
let lastParagraphCount = 0;
const $document = {};
const $model = {};
const $paragraph = {};
const $scroll = {};

const init = (instance) => editor = instance;

const setData = (html) => editor.setData(html);
const getData = () => editor.getData();
const getDataAtIndex = (index) => $document.getChild(index)?.innerHTML ?? "";

/**
 * 1 change 내에서 여러 Element를 교체
 * @param {[{ index: number, oldEl: HTMLModElement, newEl: DocumentFragment }]} data
 *  - index: 삽입할 인덱스
 *  - oldEl: 삭제할 Element
 *  - newEl: 새로운 Element
 */
const replaceAll = (data) => {
	isReplacing = true;
	editor.model.change(writer => replace(writer, data));
	isReplacing = false;
}

$document.getRoot = () => $document.findElement($model.getRoot());
$document.getChild = (index) => $document.findElement($model.getChild(index));
$document.findElement = (modelElement) => {
	const viewElement = editor.editing.mapper.toViewElement(modelElement);
	return editor.editing.view.domConverter.mapViewToDom(viewElement);
}

$model.getRoot = () => editor.model.document.getRoot();
$model.getChild = (index) => $model.getRoot().getChild(index);
$model.getChildCount = () => $model.getRoot().childCount;
$model.createFragment = (html) => editor.data.toModel( editor.data.processor.toView(html) );
$model.insertElement = (target, index) => editor.model.change(writer => writer.insert(target, $model.getRoot(), index));
$model.removeElement = (target) => editor.model.change(writer => writer.remove(target));

$paragraph.setCount = () => lastParagraphCount = $model.getChildCount();
$paragraph.setWatch = () => editor.model.document.on("change:data", () => paragraphWatcher);
$paragraph.removeWatch = () => editor.model.document.off("change:data", () => paragraphWatcher);

$scroll.setWatch = () => $document.getRoot()?.addEventListener("wheel", scrollEvent);
$scroll.removeWatch = () => $document.getRoot()?.removeEventListener("wheel", scrollEvent);

const replace = (writer, data) => {
	for (const { index, element, type, height } of data) {
		const parent = $model.getChild(index);
		const children = parent.getChildren();
		for (const child of children) {
			writer.remove(child);
		}
		writer.insert(element, parent, "end");
		editAttribute(index, type, height);
	}
}

const editAttribute = (index, type, height) => {
	requestAnimationFrame(() => {
		const node = $document.getChild(index);
		if (type === Symbol.for("chunk")) {
			node.removeAttribute("data-content-dummy");
			node.style.removeProperty("height");
		} else {
			node.setAttribute("data-content-dummy", "");
			node.style.height = `${height}px`;
		}
	});
}

const paragraphWatcher = (eventInfo, batch) => {
	const count = $model.getChildCount();
	if (isReplacing || lastParagraphCount === count) return;

	// 문단 수 동기화
	lastParagraphCount = count;

	// 문단 수가 변경되었을 때 처리
	const changes = eventInfo.source.differ.getChanges();
	changes.forEach(change => onChange(change));
}

const onChange = (change) => {
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

const scrollEvent = () => {
	const isFocus = editor.ui.focusTracker.isFocused;
	if (isFocus) document.activeElement.blur();
}

export default {
	init,
	setData,
	getData,
	getDataAtIndex,
	replaceAll,
	document: $document,
	model: $model,
	paragraph: $paragraph,
	scroll: $scroll,
};

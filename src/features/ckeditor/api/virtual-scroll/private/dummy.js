import $chunk from "./chunk.js";
import $editor from "./editor.js";

const batchSize = 1000;
const chunkSize = 50;
const dummyHTML = `<p data-content-dummy style="height: ;"></p>`;
let buffer = [];

const init = () => {
	$editor.setData("");
	const length = $chunk.getLength();

	for (let index = 0; index < length; index++) {
		pushBuffer(index);
		flushBuffer(index, length);
	}
	removeFirstElement();
}

/**
 * 더미 HTML을 반환합니다.
 * @param {number | string} height 더미의 높이. 기본값은 100
 * @returns {string} 더미 HTML 문자열
 */
const getHtml = (height = 24) => dummyHTML.replace("height: ;", `height: ${height}px;`);

/**
 * 버퍼에 HTML 청크 또는 더미 데이터를 추가
 * @param {number} index 삽입할 위치 인덱스
 */
const pushBuffer = (index) => {
	const sizeCheck = index < chunkSize;
	const html = sizeCheck ? $chunk.getData(index) : getHtml();
	buffer.push(html);
}

/**
 * 버퍼에 쌓인 데이터를 CKEditor 모델에 일괄 삽입
 * BATCH_SIZE 만큼 쌓이거나 마지막 청크 데이터까지 도달하면 버퍼 비우기
 * @param {number} index
 * @param {number} length
 */
const flushBuffer = (index, length) => {
	if ((index % batchSize !== 0 || index === 0) && index !== length - 1) return;
	const html = buffer.join("");
	const documentFragment = $editor.model.createFragment(html);
	$editor.model.insertElement(documentFragment, "end");
	buffer = [];
}

// 가장 첫 번째 공백 요소 제거
const removeFirstElement = () => {
	const firstElement = $editor.model.getChild(0);
	firstElement && $editor.model.removeElement(firstElement);
}

export default {
	init,
	getHtml,
}
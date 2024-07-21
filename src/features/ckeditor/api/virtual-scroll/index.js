import $buffer from "./private/buffer.js";
import $chunk from "./private/chunk.js";
import $dummy from "./private/dummy.js";
import $editor from "./private/editor.js";
import $observer from "./private/observer.js";

const scroll = {};

const init = async (editor, html = "") => {
	$editor.init(editor);
	$observer.init();
	await initialize(html);
}

const destroy = () => {
	$editor.paragraph.removeWatch();
	$editor.scroll.removeWatch();
	$observer.disconnect();
}

const getData = async () => {
	const html = await $editor.getData();
	await $chunk.updateData(html);
	return $chunk.getText();
}

const setData = async (html = "") => {
	destroy();
	await initialize(html);
}

scroll.addEvent = () => $editor.scroll.setWatch();
scroll.removeEvent = () => $editor.scroll.removeWatch()

const initialize = async (html = "") => {
	$chunk.init(html);
	$buffer.init();
	$observer.connect();
	await $dummy.init();

	$editor.paragraph.setCount();
	$editor.paragraph.setWatch();
	$editor.scroll.setWatch();
}

export default {
	init,
	destroy,
	getData,
	setData,
	scroll,
};
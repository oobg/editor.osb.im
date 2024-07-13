import $buffer from "./private/buffer.js";
import $chunk from "./private/chunk.js";
import $dummy from "./private/dummy.js";
import $editor from "./private/editor.js";
import $observer from "./private/observer.js";

const $plugin = {
	async init(editor, html = "") {
		$editor.init(editor);
		$observer.init();
		await initialize(html);
	},

	destroy() {
		$editor.removeParagraphWatch();
		$observer.disconnect();
	},

	async getData() {
		const html = await $editor.getData();
		await $chunk.updateData(html);
		return $chunk.getText();
	},

	async setData(html = "") {
		this.destroy();
		await initialize(html);
	},
}

export default $plugin;

async function initialize(html = "") {
	$chunk.init(html);
	$buffer.init();
	$observer.connect();
	await $dummy.init();

	$editor.setParagraphWatch();
}

import $buffer from "./private/buffer.js";
import $chunk from "./private/chunk.js";
import $dummy from "./private/dummy.js";
import $editor from "./private/editor.js";
import $observer from "./private/observer.js";

const $plugin = {
	async init(editor, html = "") {
		$editor.init(editor);
		await initialize(html);
	},

	destroy() {
		$editor.removeParagraphWatch();
		$observer.disconnect();
	},

	async getData() {
		const html = await $editor.getHtmlText();
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
	await $observer.init();
	await $dummy.init();

	$editor.setParagraphWatch();
}

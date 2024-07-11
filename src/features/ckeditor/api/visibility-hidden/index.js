import $editor from "./private/editor.js";
import $observer from "./private/observer.js";

const $plugin = {
	async init(editor, html = "") {
		$editor.init(editor);
		await $observer.init();
	},

	destroy() {
		$observer.disconnect();
	},

	getData() {
		return $editor.getData();
	},

	setData(html = "") {
		$editor.setData(html);
	},
}

export default $plugin;

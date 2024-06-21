import { App } from "vue";

import CKEditor from "@ckeditor/ckeditor5-vue";

/**
 * Register package. Automatically included in
 * @param {App} app - The Vue app instance
 */
function register(app) {
	app.use(CKEditor);
}

export default {
	register,
}
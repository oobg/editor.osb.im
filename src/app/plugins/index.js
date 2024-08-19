import router from "@/app/plugins/router";
import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue";
import vuetify from "@/app/plugins/vuetify";
import meta from "meta";

/**
 * Register package. Automatically included in
 * @param app - The Vue app instance
 */
function register(app) {
	app.use(router);
	app.use(CkeditorPlugin);
	app.use(vuetify);
	app.use(meta);
}

export default { register }
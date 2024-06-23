import { ref, onMounted, onUnmounted } from 'vue';

const currentMeta = ref({});

function setMeta(meta) {
	currentMeta.value = meta;
	document.title = currentMeta.value.title;
}

function useMeta(meta) {
	onMounted(() => setMeta(meta));
	onUnmounted(() => setMeta({}));
}

const metaPlugin = {
	install(app) {
		app.config.globalProperties.$setMeta = setMeta;
		app.config.globalProperties.$useMeta = useMeta;
		app.provide('currentMeta', currentMeta);
	}
};

export default metaPlugin;
export { currentMeta, useMeta };

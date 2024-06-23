import { createRouter, createWebHistory } from "vue-router";
import { currentMeta } from "meta";

// 동적으로 pages 디렉토리의 모든 파일을 가져온다.
const pageModules = import.meta.glob('@/pages/**/*.vue');

const routes = Object.keys(pageModules).map(path => {
	// 파일 경로에서 디렉토리 구조와 파일명을 추출
	const segments = path.match(/\/pages\/(.+)\.vue$/)[1].split('/');
	const lastSegment = segments[segments.length - 1];

	// Index.vue로 끝나는 경우, 마지막 디렉토리명을 사용
	if (lastSegment.toLowerCase() === 'index') {
		segments.pop();
	}

	const name = segments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
	const routePath = '/' + segments.map(segment => segment.toLowerCase()).join('/');

	return {
		path: routePath,
		name: name,
		component: pageModules[path],
		meta: {
			title: `editor : ${segments.join(' | ').toLowerCase()}`
		}
	};
});

// add 404 route
routes.push({
	path: '/:pathMatch(.*)*',
	name: 'NotFound',
	component: () => import('@/pages/NotFound.vue'),
	meta: {
		title: 'editor : 404',
	},
});

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

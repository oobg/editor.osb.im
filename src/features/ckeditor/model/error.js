export const error = {
	heading: {
		tag: "heading",
		type: "heading",
		additional: "제목",
		title: "문서에는 하나 이상의 제목 문단이 존재해야 합니다.",
		detail: "문서에는 하나 이상의 제목 문단이 존재해야 합니다.",
	},
	contrast: {
		tag: "paragraph",
		type: "contrast",
		additional: "",
		title: "텍스트 색상과 배경 색상의 대비가 적절하지 않습니다.",
		detail: "텍스트 색상과 배경 색상의 대비가 적절하지 않습니다.",
	},
	text: {
		tag: "a",
		type: "text",
		additional: "",
		title: "<a> 태그의 속성을 입력해주세요.",
		detail: "<a> 태그의 속성을 입력해주세요.",
	},
	ariaLabel: {
		tag: "a",
		type: "aria-label",
		additional: "aria-label",
		title: "'aria-label'의 속성을 입력해주세요.",
		detail: "'aria-label'의 속성을 입력해주세요.",
	},
	href: {
		tag: "a",
		type: "href",
		additional: "url",
		title: "URL을 입력해주세요",
		detail: "URL을 입력해주세요"
	},
	alt: {
		tag: "image",
		type: "alt",
		additional: "대체 텍스트",
		title: "이미지는 대체 텍스트를 제공해야 합니다.",
		detail: "대체 텍스트는 이미지와 동일한 정보를 전달해야 합니다. 이 텍스트는 브라우저가 이미지를 비활성화했거나 서버에서 이미지를 찾을 수 없거나 스크린 리더를 사용하는 시력이 없는 방문자가 사용할 때 사용됩니다.",
	},
}
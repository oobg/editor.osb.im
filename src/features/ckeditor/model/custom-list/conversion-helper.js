const allowAttributes = [
	"data-ke-list-type",
	"blockIndent",
	"listType",
	"listItemId",
	"listIdent",
	"listStyle",
	"htmlUlAttributes",
	"htmlOlAttributes",
	"htmlLiAttributes",
	"htmlDlAttributes",
	"htmlDtAttributes",
	"htmlDdAttributes",
];

const listItemType = (modelElement) => {
	const type = modelElement.parent.getAttribute("listType");
	switch (type) {
		case "ul":
		case "ol":
			return "li";
		case "dl":
			return "dd";
		default:
			return null;
	}
}

// Downcast converter (Model -> View) for list
const downcastList = (modelElement, { writer }) => {
	const listType = modelElement.getAttribute("listType");
	const listStartIndex = modelElement.getAttribute("startIndex");
	const listStyle = modelElement.getAttribute("style");
	const listConfig = {
		...(listStartIndex && { start: listStartIndex }),
		...(listStyle && { style: listStyle })
	};

	return writer.createContainerElement(listType, listConfig);
};

// Downcast converter (Model -> View) for listItem
const downcastListItem = (modelElement, { writer }) => {
	const listType = listItemType(modelElement);
	return writer.createContainerElement(listType);
};

// Upcast converter (View -> Model)
const upcastList = (viewElement, { writer }) => {
	const listConfig = {
		listType: viewElement.name, // 'ul' 또는 'ol'
		startIndex: viewElement.getAttribute("start"),
		style: viewElement.getAttribute("style"),
	};
	const listParent = writer.createElement("customList", listConfig);

	// 자식 요소를 순서대로 처리하여 리스트 항목으로 변환
	for (const child of viewElement.getChildren()) {
		if (!child.is("element", "li")) continue;

		const listItem = writer.createElement("customListItem");

		// 각 자식 요소의 텍스트 노드를 순서대로 삽입
		for (const grandChild of child.getChildren()) {
			if (grandChild.is("text")) {
				writer.insert(writer.createText(grandChild.data), listItem, 'end');
			} else if (grandChild.is("element")) {
				const textNode = grandChild.getChild(0);
				if (textNode && textNode.is("text")) {
					writer.insert(writer.createText(textNode.data), listItem, 'end');
				}
			}
		}

		writer.append(listItem, listParent);
	}

	writer.setAttribute("listIndent", null, listParent);
	writer.setAttribute("listStyle", "default", listParent);

	return listParent;
};

// 리스트 요소로 자동 변환되는 키워드
const autoFormattingKeywords = [ "- ", "* ", "1. ", "1) " ];

// 편집 요소로 리스트를 추가 시, 커스텀 모델 요소로 변경
const afterExecuteIndent = (type, eventInfo, changedBlocks) => {
	const editor = eventInfo.source.editor;
	editor.model.change(writer => {
		const listParent = writer.createElement("customList", { listType: type });

		changedBlocks.forEach(block => {
			const customListItem = writer.createElement("customListItem");

			// 자식 요소 순서대로 처리
			const childrenArray = Array.from(block.getChildren()); // 배열로 변환하여 순서 보장
			childrenArray
				.filter(child => child.is("text") && !autoFormattingKeywords.includes(child.data))
				.forEach(child => writer.insert(writer.createText(child.data), customListItem, 'end'));

			writer.insert(customListItem, listParent, "end");
			writer.insert(listParent, block, "after");
			writer.remove(block);
		});

		writer.insert(writer.createElement("paragraph"), listParent, "after");
		writer.setSelection(listParent, "in", { backward: true });
	});
};

// 커스텀 UL 요소로 변경
const afterExecuteBullet = (eventInfo, changedBlocks) => {
	afterExecuteIndent("ul", eventInfo, changedBlocks);
};

// 커스텀 OL 요소로 변경
const afterExecuteNumberedList = (eventInfo, changedBlocks) => {
	afterExecuteIndent("ol", eventInfo, changedBlocks);
};

export {
	allowAttributes,
	downcastListItem,
	downcastList,
	upcastList,
	afterExecuteBullet,
	afterExecuteNumberedList,
}

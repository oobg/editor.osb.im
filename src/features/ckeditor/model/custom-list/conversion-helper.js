const allowAttributes = [
	"data-ke-custom-list-type",
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
	"htmlDdAttributes"
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

// Downcast converter (Model -> View) for listItem
const downcastListItem = (modelElement, { writer }) => {
	const listType = listItemType(modelElement);
	return writer.createContainerElement(listType);
};

// Downcast converter (Model -> View) for custom-list
const downcastList = (modelElement, { writer }) => {
	const listType = modelElement.getAttribute("listType");
	return writer.createContainerElement(listType);
};

// Upcast converter (View -> Model)
const upcastList = (viewElement, { writer }) => {
	const listType = viewElement.name;
	const listElement = writer.createElement("list", { listType: listType });

	for (const child of viewElement.getChildren()) {
		if (child.is("element", "li")) {
			const listItem = writer.createElement("listItem");
			const grandChild = child.getChild(0);
			const textNode = grandChild?.is("text") ? grandChild : grandChild?.getChild(0);
			const data = textNode ? textNode?.data : "";
			writer.insert(writer.createText(data), listItem);
			writer.append(listItem, listElement);
		}
	}
	return listElement;
};

// 리스트 요소로 자동 변환되는 키워드
const autoFormattingKeywords = [ "- ", "* ", "1. ", "1) " ];

// 편집 요소로 리스트를 추가 시, 커스텀 모델 요소로 변경
const afterExecuteIndent = (type, eventInfo, changedBlocks) => {
	const editor = eventInfo.source.editor;
	editor.model.change(writer => {
		const listParent = writer.createElement("list", { listType: type });

		changedBlocks.forEach(block => {
			const listItem = writer.createElement("listItem");

			block.getChildren()
				.filter(child => child.is("text") && !autoFormattingKeywords.includes(child.data))
				.forEach(child => writer.insert(writer.createText(child.data), listItem, 'end'));

			writer.insert(listItem, listParent);
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
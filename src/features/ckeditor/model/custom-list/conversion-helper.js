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

export {
	allowAttributes,
	downcastListItem,
	downcastList,
	upcastList
}
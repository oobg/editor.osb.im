const $editor = {
	init(editor) {
		this.editor = editor;
		this.root = this.editor.model.document.getRoot();
	},

	getData() {
		return this.editor.getData();
	},

	setData(html = "") {
		this.editor.setData(html);
	},

	/**
	 * Model Element -> View Element -> DOM Element
	 * @param {HTMLModElement} modelElement
	 * @returns {HTMLElement}
	 */
	findDomElement(modelElement) {
		const viewElement = this.editor.editing.mapper.toViewElement(modelElement);
		return this.editor.editing.view.domConverter.mapViewToDom(viewElement);
	},

	getEditorDom() {
		return this.findDomElement(this.root);
	},
}

export default $editor;

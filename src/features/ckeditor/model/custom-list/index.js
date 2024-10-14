import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {
	afterExecuteBullet,
	afterExecuteNumberedList,
	allowAttributes,
	downcastList,
	downcastListItem,
	upcastList,
} from "./conversion-helper.js";

class CustomList extends Plugin {
	init() {
		this._defineSchema();
		this._defineConversion();
		this._defineCommands();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register("customList", {
			allowIn: ["$root", "$block", "$blockObject", "$container", "listItem"],
			inheritAllFrom: "$blockObject",
			allowChildren: ["customListItem"],
			allowAttributes,
		});

		schema.register("customListItem", {
			allowIn: "customList",
			// inheritAllFrom: "$listItem",
			inheritAllFrom: "paragraph",
			allowContentOf: "$block",
			allowAttributes,
			isContent: true,
		});
	}

	_defineConversion() {
		const conversion = this.editor.conversion;
		const downcastType = ["dataDowncast", "editingDowncast"];
		const viewList = ["ul", "ol"];

		downcastType.forEach(type => {
			// Downcast converter (View -> Model) for list
			conversion.for(type).elementToElement({
				model: "customList",
				view: downcastList,
				converterPriority: "high",
			});

			// Downcast converter (View -> Model) for listItem
			conversion.for(type).elementToElement({
				model: "customListItem",
				view: downcastListItem,
				converterPriority: "high",
			});
		});

		viewList.forEach(viewName => {
			// Upcast converter (View -> Model) for list
			conversion.for("upcast").elementToElement({
				view: { name: viewName },
				model: upcastList,
				converterPriority: "high",
			});
		});
	}

	_defineCommands() {
		const commands = this.editor.commands;

		commands.get("bulletedList").on("afterExecute", afterExecuteBullet);
		commands.get("numberedList").on("afterExecute", afterExecuteNumberedList);

		this.editor.model.document.selection.on("change:range", (evt, data) => {
			const selectedElement = this.editor.model.document.selection.getSelectedElement();

			// 특정 블록이 선택되면 커서를 다른 곳으로 이동
			if (selectedElement && selectedElement.is("element", "customList")) {
				this.editor.model.change(writer => {
					// 커서를 블록 밖으로 이동
					const firstChild = selectedElement.getChild(0); // 첫 번째 자식 요소 가져오기
					const lastChild = selectedElement.getChild(selectedElement.childCount - 1); // 마지막 자식 요소 가져오기

					if (firstChild) {
						this.editor.model.change(writer => {
							if (event.key === "ArrowUp" || event.key === "ArrowLeft" && event.key === "Backspace") {
								// 위쪽과 좌측 화살표인 경우, 자식 요소의 마지막 위치로 포커스 이동
								const endPosition = this.editor.model.createPositionAt(lastChild, 'end');
								writer.setSelection(endPosition);
							} else {
								// 아래쪽과 우측 화살표인 경우, 기존대로 자식 요소의 시작 위치로 포커스 이동
								writer.setSelection(firstChild, "before");
							}
						});
					}
				});
			}
		});
	}
}

export default CustomList;
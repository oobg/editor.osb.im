import { Plugin } from "ckeditor5";
import {
	afterExecuteBullet,
	afterExecuteNumberedList,
	allowAttributes,
	downcastList,
	downcastListItem,
	upcastList
} from "./conversion-helper.js";

class CustomList extends Plugin {
	init() {
		this._defineSchema();
		this._defineConversion();
		this._defineCommands();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register("list", {
			allowIn: ["$root", "$block", "$blockObject", "$container"], // 블록 내에서도 리스트를 사용할 수 있게 설정
			allowAttributes: allowAttributes,
		});

		schema.register("listItem", {
			allowIn: "list", // 리스트 내에서만 리스트 아이템을 허용
			allowContentOf: "$block", // 리스트 아이템 내에서 블록 요소를 허용
			allowAttributes: allowAttributes,
		});
	}

	_defineConversion() {
		const conversion = this.editor.conversion;

		// Upcast converter (View -> Model) for listItem
		conversion.for("dataDowncast").elementToElement({
			model: "listItem",
			view: downcastListItem
		});

		conversion.for("editingDowncast").elementToElement({
			model: "listItem",
			view: downcastListItem
		});

		// Upcast converter (View -> Model) for custom-list
		conversion.for("dataDowncast").elementToElement({
			model: "list",
			view: downcastList,
			converterPriority: "high"
		});

		conversion.for("editingDowncast").elementToElement({
			model: "list",
			view: downcastList,
			converterPriority: "high"
		});

		// Upcast converter (View -> Model) for listItem
		conversion.for("upcast").elementToElement({
			view: { name: "ul" },
			model: upcastList,
			converterPriority: "high",
		});

		conversion.for("upcast").elementToElement({
			view: { name: "ol" },
			model: upcastList,
			converterPriority: "high",
		});
	}

	_defineCommands() {
		const command = this.editor.commands;

		// 편집 요소로 리스트를 추가 시, 커스텀 모델 요소로 변경
		command.get("bulletedList").on("afterExecute", afterExecuteBullet);
		command.get("numberedList").on("afterExecute", afterExecuteNumberedList);
	}
}

export default CustomList;

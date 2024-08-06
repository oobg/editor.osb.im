import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { allowAttributes, downcastList, downcastListItem, upcastList } from "./conversion-helper.js";

class CustomList extends Plugin {
	init() {
		const conversion = this.editor.conversion;
		const schema = this.editor.model.schema;

		schema.register("list", {
			allowIn: ["$root", "$block", "$blockObject", "$container"], // 블록 내에서도 리스트를 사용할 수 있게 설정
			isObject: true,
			allowAttributes: allowAttributes,
		});

		schema.register("listItem", {
			allowIn: "list", // 리스트 내에서만 리스트 아이템을 허용
			allowContentOf: "$block", // 리스트 아이템 내에서 블록 요소를 허용
			allowAttributes: allowAttributes,
		});

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
}

export default CustomList;

import { ClassicEditor as CKEditorBase } from "ckeditor5";
import type { EditorConfig as EditorConfigType } from "@ckeditor/ckeditor5-core";
import defaultConfig from "./defaultConfig";
import * as plugins from "./builtinPlugins";

// Import CKEditor5 Styles
import "ckeditor5/ckeditor5.css";

// Extract all plugin modules and define a type for them.
const builtinPlugins = Object.values(plugins);
type EditorPluginType = (typeof plugins)[keyof typeof plugins];

export class EditorBaseConfig extends CKEditorBase {
	static override builtinPlugins: EditorPluginType[] = builtinPlugins;
	static override defaultConfig: EditorConfigType = defaultConfig;
}

export type { CKEditorBase as EditorInstanceType };

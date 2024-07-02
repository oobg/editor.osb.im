import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Title from "@ckeditor/ckeditor5-heading/src/heading";
import Font from "@ckeditor/ckeditor5-font/src/font";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import PageBreak from "@ckeditor/ckeditor5-page-break/src/pagebreak";
import {LinkImage} from "@ckeditor/ckeditor5-link";
import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";
import "@ckeditor/ckeditor5-build-classic/build/translations/ko";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import AutoFormat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import FindAndReplace from "@ckeditor/ckeditor5-find-and-replace/src/findandreplace";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import SelectAll from "@ckeditor/ckeditor5-select-all/src/selectall";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import HtmlEmbed from "@ckeditor/ckeditor5-html-embed/src/htmlembed";
import Markdown from "@ckeditor/ckeditor5-markdown-gfm/src/markdown";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount";
import TextPartLanguage from "@ckeditor/ckeditor5-language/src/textpartlanguage";
import TextTransFormation from "@ckeditor/ckeditor5-typing/src/typing";
// import { DocumentList, DocumentListProperties } from "@ckeditor/ckeditor5-list";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import {
	Table,
	TableToolbar,
	TableCaption,
	TableCellProperties,
	TableProperties,
	TableColumnResize,
} from "@ckeditor/ckeditor5-table";
import {
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
} from "@ckeditor/ckeditor5-special-characters";
import {
	FullPage,
	HtmlComment,
	GeneralHtmlSupport,
} from "@ckeditor/ckeditor5-html-support";
import {
	Bold,
	Code,
	Italic,
	Strikethrough,
	Subscript,
	Superscript,
	Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import {
	Image,
	ImageInsert,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageResize,
	ImageUpload,
	AutoImage,
} from "@ckeditor/ckeditor5-image";

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	FindAndReplace,
	AutoFormat,
	SelectAll,
	// DocumentList,
	// DocumentListProperties,
	TextPartLanguage,
	TextTransFormation,
	WordCount,
	AutoImage,
	Image,
	ImageInsert,
	ImageCaption,
	ImageResize,
	CodeBlock,
	Essentials,
	Paragraph,
	Highlight,
	HorizontalLine,
	Bold,
	Code,
	Strikethrough,
	Subscript,
	Superscript,
	RemoveFormat,
	Italic,
	Underline,
	BlockQuote,
	MediaEmbed,
	HtmlEmbed,
	PasteFromOffice,
	Heading,
	Font,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Markdown,
	Alignment,
	Table,
	TableToolbar,
	TableCaption,
	TableCellProperties,
	TableProperties,
	TableColumnResize,
	TextTransformation,
	Indent,
	IndentBlock,
	PageBreak,
	Base64UploadAdapter,
	LinkImage,
	Title,
	FullPage,
	GeneralHtmlSupport,
	HtmlComment,
	SourceEditing,

];

ClassicEditor.defaultConfig = {
	toolbar: {
		language: "en",
		items: [
			"undo",
			"redo",
			"|",
			// "sourceEditing",
			"heading",
			"|",
			"bold",
			"italic",
			"underline",
			"strikethrough",
			"|",
			"fontSize",
			"fontColor",
			"fontBackgroundColor",
			"|",
			"alignment",
			"outdent",
			"indent",
			"blockQuote",
			"|",
			"insertTable",
			// "imageUpload",
			// "mediaEmbed",
			"|",
			"pageBreak",
		]
	},
	codeBlock: {
		languages: [
			{ language: "plaintext", label: "Plain text" }, // The default language.
			{ language: "c", label: "C" },
			{ language: "cs", label: "C#" },
			{ language: "cpp", label: "C++" },
			{ language: "css", label: "CSS" },
			{ language: "diff", label: "Diff" },
			{ language: "html", label: "HTML" },
			{ language: "java", label: "Java" },
			{ language: "javascript", label: "JavaScript" },
			{ language: "php", label: "PHP" },
			{ language: "python", label: "Python" },
			{ language: "ruby", label: "Ruby" },
			{ language: "typescript", label: "TypeScript" },
			{ language: "xml", label: "XML" },
		],
	},
	heading: {
		options: [
			{ model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
			{
				model: "heading1",
				view: "h1",
				title: "Heading 1",
				class: "ck-heading_heading1",
			},
			{
				model: "heading2",
				view: "h2",
				title: "Heading 2",
				class: "ck-heading_heading2",
			},
			{
				model: "heading3",
				view: "h3",
				title: "Heading 3",
				class: "ck-heading_heading3",
			},
			{
				model: "heading4",
				view: "h4",
				title: "Heading 4",
				class: "ck-heading_heading4",
			},
			{
				model: "heading5",
				view: "h5",
				title: "Heading 5",
				class: "ck-heading_heading5",
			},
			{
				model: "heading6",
				view: "h6",
				title: "Heading 6",
				class: "ck-heading_heading6",
			},
		],
	},
	htmlSupport: {
		allow: [
			{
				name: /.*/,
				attributes: true,
				classes: true,
				styles: true,
			},
		],
	},
	fontSize: {
		options: [
			9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 27, 29, 31, 33,
			35,
		],
	},
	language: 'ko',
	extraAllowedContent: '*[*]{*}',
	fontFamily: {
		options: [
			"default",
			"Arial",
			"Calibri",
			"Consolas",
			"Courier",
			"Sans-serif",
			"Verdana",
			"굴림",
			"궁서",
			"돋움",
			"맑은고딕",
			"바탕",
		],
		supportAllValues: true,
	},
	list: {
		properties: {
			styles: true,
			startIndex: true,
			reversed: true,
		},
	},
	alignment: {
		options: ["justify", "left", "center", "right"],
	},
	table: {
		contentToolbar: [
			"tableColumn", "tableRow",
			"|", "mergeTableCells",
			"|", "tableCellProperties", "tableProperties",
			"|", "toggleTableCaption",
		],
	},
	image: {
		resizeUnit: "%",
		toolbar: [
			"dtmCreateContextMenu", "dtmEditContextMenu", "dtmDeleteContextMenu", "imageTextAlternative", "toggleImageCaption",
			"|", "imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight",
			"|", "imageStyle:alignBlockLeft", "imageStyle:block", "imageStyle:alignBlockRight",
			"|", { items: ["imageStyle:side", "imageStyle:inline"], defaultItem: "imageStyle:side", },
			"|", "linkImage", "resizeImage",
		],
		resizeOptions: [
			{
				name: "resizeImage:original",
				value: null,
				label: "Original",
			},
			{
				name: "resizeImage:25",
				value: "25",
				label: "25%",
			},
			{
				name: "resizeImage:50",
				value: "50",
				label: "50%",
			},
			{
				name: "resizeImage:75",
				value: "75",
				label: "75%",
			},
		],
		styles: ["full", "alignLeft", "alignRight"],
	},
	typing: {
		transformations: {
			includes: ["quotes", "typography", "mathematical", "symbols"],
		},
	},
	htmlEmbed: {
		showPreviews: true,
	},
};

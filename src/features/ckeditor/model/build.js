// src/ckeditor/build.js
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import { Bold, Italic, Code, Strikethrough, Subscript, Superscript, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
	Essentials,
	Bold,
	Italic,
	Code,
	Strikethrough,
	Subscript,
	Superscript,
	Underline,
	GeneralHtmlSupport
];

ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'undo', 'redo'
		]
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
	language: 'ko',
	extraAllowedContent: '*[*]{*}',
};

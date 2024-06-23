<script setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ref } from 'vue';

const editor = ClassicEditor;
const editorData = ref('<p>Type here...</p>');

const config = {
  toolbar: ["heading", "|", "bold", "italic"],
};

function onReady(editor) {
  const editorElement = editor.ui.view.editable.element;
  editorElement.style.height = '500px';
}
</script>

<template>
  <v-container>
    <h1>CKEditor</h1>
    <ckeditor :editor="editor" v-model="editorData" :config="config" @ready="onReady" />
  </v-container>
</template>

<style>
</style>

<script setup>
import { ref } from "vue";
import { useMeta } from "meta";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import config from "@/features/ckeditor/model/config.js";

useMeta({
  title: "editor : ckeditor",
  description: "ckeditor Virtual Scrolling",
});

const editor = ClassicEditor;
const editorData = ref("");

function onReady(editor) {
  console.log("Editor is ready to use!", editor);
}
</script>

<template>
  <v-container>
    <h1>CKEditor</h1>
    <div class="ck-container">
      <ckeditor :editor="editor" v-model="editorData" :config="config" @ready="onReady" />
    </div>
  </v-container>
</template>

<style lang="scss">
.v-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  gap: 10px;
}

.ck-container {
  width: 100%;
  display: flex;
  flex-direction: column;

  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 10px;
  background-color: whitesmoke;
}

.ck-editor {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  &__main {
    flex: 1 1 auto;
    .ck-content,
    .ck-source-editing-area {
      height: 100%;
      min-height: calc(100vh - 375px);
      max-height: calc(100vh - 375px);

      textarea {
        overflow: auto !important;
      }
    }
  }
}
</style>

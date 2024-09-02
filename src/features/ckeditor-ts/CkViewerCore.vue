<template>
  <ckeditor
    :editor="editor"
    :model-value="modelValue"
    @update:model-value="updateValue"
    @ready="onReady"
    @destroy="onDestroy"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onBeforeUnmount, onMounted } from "vue";
import { ref, watch } from "vue";
import { ClassicEditor } from "ckeditor5";
import {
  EditorBaseConfig,
  EditorInstanceType,
} from "@/features/ckeditor-ts/config";
import "@/features/ckeditor-ts/assets/content-style.scss";
import "@/features/ckeditor-ts/assets/viewer-style.scss";

interface Props {
  modelValue: string;
  onReady?: (editor: EditorInstanceType) => void;
  onDestroy?: (editor: EditorInstanceType) => void;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const editor = ref(EditorBaseConfig);
const content = ref(props.modelValue);
const isMounted = ref(false);
const ENUM = Object.freeze({
  READONLY: "ck-content--readonly",
  PANEL: ".ck.ck-sticky-panel__content",
  CONTENT: ".ck.ck-editor__main .ck-content",
});

const invokeCallback = (
    callbackFn: ((editor: ClassicEditor) => void) | undefined,
    editor: EditorInstanceType
) => {
  if (callbackFn) {
    callbackFn(editor);
  }
};

const onReady = (editor: EditorInstanceType) => {
  invokeCallback(props.onReady, editor);
  setReadOnlyMode(editor);
};
const onDestroy = (editor: EditorInstanceType) => {
  invokeCallback(props.onDestroy, editor);
};

const updateValue = (newValue: string) => {
  if (isMounted.value) {
    content.value = newValue;
  }
};

const setReadOnlyMode = (editor: EditorInstanceType) => {
  editor.enableReadOnlyMode(editor.id);

  const toolbar = editor.ui.view.toolbar.element as HTMLElement;
  toolbar.style.display = "none";

  const editorElement = editor.ui.view.element as HTMLElement;

  const stickyPanel = editorElement.querySelector(ENUM.PANEL);
  stickyPanel && stickyPanel.classList.add(ENUM.READONLY);

  const content = editorElement.querySelector(ENUM.CONTENT);
  content && content.classList.add(ENUM.READONLY);
};

onMounted(() => {
  isMounted.value = true;
});

onBeforeUnmount(() => {
  isMounted.value = false;
});

watch(content, (newValue) => {
  if (isMounted.value) {
    emit("update:modelValue", newValue);
  }
});
</script>

<style scoped></style>

<template>
  <ckeditor
      :editor="editor"
      :model-value="modelValue"
      @update:model-value="updateValue"
      @ready="onReady"
      @destroy="onDestroy"
      @focus="onFocus"
      @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onBeforeUnmount, onMounted } from "vue";
import { ref, watch } from "vue";
import {
  EditorBaseConfig,
  EditorInstanceType,
} from "@/features/ckeditor-ts/config";
import { ClassicEditor } from "ckeditor5";
import "@/features/ckeditor-ts/assets/content-style.scss";

const props = defineProps<{
  modelValue: string;
  onReady?: (editor: EditorInstanceType) => void;
  onDestroy?: (editor: EditorInstanceType) => void;
  onFocus?: (editor: EditorInstanceType) => void;
  onBlur?: (editor: EditorInstanceType) => void;
}>();

const emit = defineEmits(["update:modelValue"]);

const editor = ref(EditorBaseConfig);
const content = ref(props.modelValue);
const isMounted = ref(false);

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
};
const onDestroy = (editor: EditorInstanceType) => {
  invokeCallback(props.onDestroy, editor);
};
const onFocus = (editor: EditorInstanceType) => {
  invokeCallback(props.onFocus, editor);
};
const onBlur = (editor: EditorInstanceType) => {
  invokeCallback(props.onBlur, editor);
};

const updateValue = (newValue: string) => {
  if (isMounted.value) {
    content.value = newValue;
  }
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

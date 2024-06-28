<script setup>
import { useMeta } from "meta";

useMeta({
  title: "editor : main",
  description: "editor site main page",
});
</script>

<template>
  <v-container>
    <router-link to="/ckeditor">
      <v-btn class="mx-4 white--text" elevation="2" x-large rounded color="deep-purple darken-1" to="/ckeditor/virtual-scroll">
        ckeditor
      </v-btn>
    </router-link>
  </v-container>
</template>

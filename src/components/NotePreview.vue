<template>
  <div class="preview">
    <div class="title">实时预览</div>
    <div class="content" v-html="html"></div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { marked } from "marked";
  import hljs from "highlight.js";
  import "highlight.js/styles/github.css";

  marked.setOptions({
    highlight: (code) => hljs.highlightAuto(code).value,
  });

  const props = defineProps({ content: String });
  const html = computed(() => marked(props.content));
</script>

<style scoped>
  .preview {
    width: 400px;
    background: var(--panel-bg);
    border-radius: 8px;
    padding: 16px;
    overflow-y: auto;
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--text-color);
  }
  .content {
    line-height: 1.6;
    color: var(--text-color);
  }
</style>

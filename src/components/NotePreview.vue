<template>
  <div class="preview">
    <div class="title">实时预览</div>
    <div class="content" v-html="html"></div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import { useThemeStore } from "../stores/theme.js";

marked.setOptions({
  highlight: (code) => hljs.highlightAuto(code).value,
});

const themeStore = useThemeStore();
const props = defineProps({ content: String });
const html = computed(() => marked(props.content));

function setHighlightTheme() {
  const id = "hljs-theme";
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = themeStore.isDark
    ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css"
    : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css";
  document.head.appendChild(link);
}

watch(() => themeStore.isDark, setHighlightTheme);
onMounted(setHighlightTheme);
onUnmounted(() => {
  const existing = document.getElementById("hljs-theme");
  if (existing) existing.remove();
});
</script>

<style scoped>
.preview {
  width: 380px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  overflow-y: auto;
  box-shadow: var(--color-shadow);
  transition: var(--transition-smooth);
  flex-shrink: 0;
}

.title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content {
  line-height: 1.7;
  color: var(--color-text);
  font-size: 15px;
}

/* Preview content styling */
.content :deep(h1) {
  font-size: 1.6em;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}
.content :deep(h2) {
  font-size: 1.3em;
  font-weight: 600;
  color: var(--color-text);
  margin: 16px 0 8px;
}
.content :deep(h3) {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--color-text);
  margin: 14px 0 6px;
}
.content :deep(p) {
  margin: 0 0 10px;
}
.content :deep(blockquote) {
  margin: 0 0 10px;
  padding: 8px 14px;
  border-left: 3px solid var(--color-accent);
  background: var(--color-surface-secondary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--color-text-secondary);
}
.content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--color-surface-secondary);
  color: var(--color-danger);
}
.content :deep(pre) {
  margin: 0 0 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
}
.content :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}
.content :deep(ul),
.content :deep(ol) {
  margin: 0 0 10px;
  padding-left: 20px;
}
.content :deep(li) {
  margin-bottom: 4px;
}
.content :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
}
.content :deep(a:hover) {
  text-decoration: underline;
}
.content :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-md);
}
.content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0 0 12px;
}
.content :deep(th),
.content :deep(td) {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
}
.content :deep(th) {
  background: var(--color-surface-secondary);
  font-weight: 600;
}
.content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 16px 0;
}

@media (max-width: 900px) {
  .preview {
    width: 100%;
    max-height: 40vh;
  }
}
</style>

<template>
  <div class="editor">
    <input
      v-model="localTitle"
      class="title-input"
      placeholder="笔记标题"
      @input="update"
    />
    <div class="md-toolbar">
      <button title="粗体 Ctrl+B" @click="insertMarkdown('**', '**', '粗体')">B</button>
      <button title="斜体 Ctrl+I" @click="insertMarkdown('*', '*', '斜体')"><i>I</i></button>
      <button title="标题" @click="insertMarkdown('## ', '', '标题')">H</button>
      <button title="代码块" @click="insertMarkdown('```\n', '\n```', '代码')">&lt;/&gt;</button>
      <button title="无序列表" @click="insertMarkdown('- ', '', '列表')">≡</button>
    </div>
    <textarea
      ref="textareaRef"
      v-model="localContent"
      class="content-text"
      placeholder="请输入 Markdown"
      @input="update"
    />
    <div class="toolbar">
      <span class="save-status">
        <template v-if="saveStatus === 'saving'">保存中...</template>
        <template v-else-if="saveStatus === 'saved'">已保存</template>
      </span>
      <div class="toolbar-btns">
        <button class="del-btn" @click="del">删除笔记</button>
        <button class="export-btn" @click="exportHtml">导出 HTML</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { marked } from "marked";
import { z } from "zod";

const props = defineProps({
  modelValue: Object,
  saveStatus: { type: String, default: "saved" },
});
const emit = defineEmits([
  "update:modelValue",
  "save",
  "delete",
  "export-html",
]);

const localTitle = ref("");
const localContent = ref("");
const textareaRef = ref(null);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    localTitle.value = val.title;
    localContent.value = val.content;
  },
  { immediate: true },
);

const noteSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
});

function insertMarkdown(before, after, placeholder) {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = localContent.value.slice(start, end) || placeholder;
  localContent.value =
    localContent.value.slice(0, start) +
    before +
    selected +
    after +
    localContent.value.slice(end);
  nextTick(() => {
    el.focus();
    el.setSelectionRange(
      start + before.length,
      start + before.length + selected.length,
    );
    update();
  });
}

function update() {
  const data = {
    ...props.modelValue,
    title: localTitle.value,
    content: localContent.value,
  };
  const result = noteSchema.safeParse(data);
  if (result.success) {
    emit("update:modelValue", data);
    emit("save", data);
  }
}

function del() {
  if (confirm("确定删除？")) emit("delete", props.modelValue.id);
}

function exportHtml() {
  const html = `<body style="padding:20px">${marked(localContent.value)}</body>`;
  emit("export-html", html);
}
</script>

<style scoped>
.editor {
  flex: 1;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--color-shadow);
  transition: var(--transition-smooth);
  min-width: 0;
}

.title-input {
  padding: 11px 14px;
  font-size: 16px;
  font-weight: 500;
  font-family: var(--font-sans);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-secondary);
  color: var(--color-text);
  outline: none;
  transition: var(--transition-smooth);
}
.title-input::placeholder {
  color: var(--color-text-tertiary);
}
.title-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}

.md-toolbar {
  display: flex;
  gap: 6px;
}
.md-toolbar button {
  width: 32px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}
.md-toolbar button:hover {
  background: var(--color-surface-secondary);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.content-text {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: none;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.7;
  background: var(--color-surface-secondary);
  color: var(--color-text);
  outline: none;
  transition: var(--transition-smooth);
}
.content-text::placeholder {
  color: var(--color-text-tertiary);
}
.content-text:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.save-status {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 60px;
}

.toolbar-btns {
  display: flex;
  gap: 8px;
}

.del-btn {
  padding: 7px 14px;
  background: var(--color-danger);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: opacity var(--transition-fast), transform 0.1s ease;
}
.del-btn:hover {
  opacity: 0.85;
}
.del-btn:active {
  transform: scale(0.97);
}

.export-btn {
  padding: 7px 14px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background var(--transition-fast), transform 0.1s ease;
}
.export-btn:hover {
  background: var(--color-accent-hover);
}
.export-btn:active {
  transform: scale(0.97);
}
</style>

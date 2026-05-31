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
        <template v-if="saveStatus === 'saving'">⏳ 保存中...</template>
        <template v-else-if="saveStatus === 'saved'">✓ 已保存</template>
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

  // Zod 校验
  const noteSchema = z.object({
    title: z.string().min(1, "标题不能为空"),
    content: z.string().min(1, "内容不能为空"),
  });

  // 在光标位置插入 Markdown 语法
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
    // 恢复光标位置（选中插入的内容）
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
    background: var(--panel-bg);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .title-input {
    padding: 12px;
    font-size: 16px;
    border: 1px solid var(--border-clr);
    border-radius: 6px;
    background: var(--input-bg);
    color: var(--text-color);
  }
  .md-toolbar {
    display: flex;
    gap: 4px;
  }
  .md-toolbar button {
    width: 30px;
    height: 28px;
    border: 1px solid var(--border-clr);
    border-radius: 4px;
    background: var(--input-bg);
    color: var(--text-color);
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .md-toolbar button:hover {
    background: var(--green-bg);
    border-color: var(--green);
  }
  .content-text {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--border-clr);
    border-radius: 6px;
    resize: none;
    font-family: monospace;
    background: var(--input-bg);
    color: var(--text-color);
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .save-status {
    font-size: 13px;
    color: var(--text-muted);
    min-width: 80px;
  }
  .toolbar-btns {
    display: flex;
    gap: 10px;
  }
  .del-btn {
    padding: 8px 14px;
    background: var(--red);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .export-btn {
    padding: 8px 14px;
    background: var(--blue);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
</style>

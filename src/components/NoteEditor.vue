<template>
  <div class="editor">
    <input
      v-model="localTitle"
      class="title-input"
      placeholder="笔记标题"
      @input="update"
    />
    <textarea
      v-model="localContent"
      class="content-text"
      placeholder="请输入 Markdown"
      @input="update"
    />
    <div class="toolbar">
      <button class="del-btn" @click="del">删除笔记</button>
      <button class="export-btn" @click="exportHtml">导出 HTML</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";
  import { z } from "zod";

  const props = defineProps(["modelValue"]);
  const emit = defineEmits([
    "update:modelValue",
    "save",
    "delete",
    "export-html",
  ]);

  const localTitle = ref("");
  const localContent = ref("");

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
    const html = `<body style="padding:20px">${parseMarkdown(localContent.value)}</body>`;
    emit("export-html", html);
  }
</script>

<style scoped>
  .editor {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .title-input {
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  .content-text {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    resize: none;
    font-family: monospace;
  }
  .toolbar {
    display: flex;
    gap: 10px;
  }
  .del-btn {
    padding: 8px 14px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 6px;
  }
  .export-btn {
    padding: 8px 14px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 6px;
  }
</style>

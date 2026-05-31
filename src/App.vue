<template>
  <div class="app-wrap">
    <div class="app-container">
      <!-- 左侧笔记列表 -->
      <NoteList
        :notes="notes"
        :activeId="currentNote?.id"
        @add="addNote"
        @select="selectNote"
      />

      <!-- 中间编辑器 -->
      <NoteEditor
        v-model="currentNote"
        @save="saveNote"
        @delete="deleteNote"
        @export-html="exportHtml"
      />

      <!-- 右侧预览 -->
      <NotePreview :content="currentNote?.content || ''" />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import NoteList from "./components/NoteList.vue";
  import NoteEditor from "./components/NoteEditor.vue";
  import NotePreview from "./components/NotePreview.vue";

  const notes = ref([]);
  const currentNote = ref(null);

  // 读取本地数据
  onMounted(() => {
    const data = localStorage.getItem("markdown-notes");
    if (data) notes.value = JSON.parse(data);
    if (notes.value.length) currentNote.value = notes.value[0];
  });

  // 保存到本地
  function saveToLocal() {
    localStorage.setItem("markdown-notes", JSON.stringify(notes.value));
  }

  // 新增笔记
  function addNote() {
    const newNote = {
      id: Date.now(),
      title: "未命名笔记",
      content: "# 请输入 Markdown\n\n## 二级标题",
      createTime: new Date().toLocaleString(),
    };
    notes.value.unshift(newNote);
    currentNote.value = newNote;
    saveToLocal();
  }

  // 选择笔记
  function selectNote(note) {
    currentNote.value = note;
  }

  // 保存笔记
  function saveNote(note) {
    const index = notes.value.findIndex((i) => i.id === note.id);
    if (index !== -1) notes.value[index] = note;
    saveToLocal();
  }

  // 删除笔记
  function deleteNote(id) {
    notes.value = notes.value.filter((i) => i.id !== id);
    if (currentNote.value?.id === id)
      currentNote.value = notes.value[0] || null;
    saveToLocal();
  }

  // 导出 HTML
  function exportHtml(html) {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `笔记_${new Date().getTime()}.html`;
    a.click();
  }
</script>

<style scoped>
  .app-wrap {
    width: 100vw;
    height: 100vh;
    background: #f5f7fa;
  }
  .app-container {
    display: flex;
    height: 100%;
    gap: 12px;
    padding: 12px;
    box-sizing: border-box;
  }
</style>

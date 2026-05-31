<template>
  <div class="app-wrap">
    <header class="app-header">
      <span class="app-logo">Markdown Note</span>
      <ThemeToggle />
    </header>
    <div class="app-container">
      <NoteList
        :notes="notes"
        :activeId="currentNote?.id"
        @add="addNote"
        @select="selectNote"
      />

      <NoteEditor
        v-model="currentNote"
        :saveStatus="saveStatus"
        @save="saveNote"
        @delete="deleteNote"
        @export-html="exportHtml"
      />

      <NotePreview :content="currentNote?.content || ''" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NoteList from "./components/NoteList.vue";
import NoteEditor from "./components/NoteEditor.vue";
import NotePreview from "./components/NotePreview.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

const notes = ref([]);
const currentNote = ref(null);
const saveStatus = ref("saved");

onMounted(() => {
  const data = localStorage.getItem("markdown-notes");
  if (data) notes.value = JSON.parse(data);
  if (notes.value.length) currentNote.value = notes.value[0];
});

function handleKeydown(e) {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return;

  if (e.key === "n" || e.key === "N") {
    e.preventDefault();
    addNote();
  } else if (e.key === "s" || e.key === "S") {
    e.preventDefault();
    _writeToLocal();
  }
}
onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));

function debounce(fn, delay = 1500) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function _writeToLocal() {
  localStorage.setItem("markdown-notes", JSON.stringify(notes.value));
  saveStatus.value = "saved";
}

const saveToLocal = debounce(_writeToLocal, 1500);

function triggerSave() {
  saveStatus.value = "saving";
  saveToLocal();
}

function addNote() {
  const newNote = {
    id: Date.now(),
    title: "未命名笔记",
    content: "# 请输入 Markdown\n\n## 二级标题",
    createTime: new Date().toLocaleString(),
  };
  notes.value.unshift(newNote);
  currentNote.value = newNote;
  _writeToLocal();
}

function selectNote(note) {
  currentNote.value = note;
}

function saveNote(note) {
  const index = notes.value.findIndex((i) => i.id === note.id);
  if (index !== -1) notes.value[index] = note;
  triggerSave();
}

function deleteNote(id) {
  notes.value = notes.value.filter((i) => i.id !== id);
  if (currentNote.value?.id === id)
    currentNote.value = notes.value[0] || null;
  _writeToLocal();
}

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
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  transition: var(--transition-smooth);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: var(--transition-smooth);
  flex-shrink: 0;
}

.app-logo {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.3px;
}

.app-container {
  display: flex;
  flex: 1;
  gap: 12px;
  padding: 12px;
  min-height: 0;
  transition: var(--transition-smooth);
}

@media (max-width: 900px) {
  .app-container {
    flex-direction: column;
  }
}
</style>

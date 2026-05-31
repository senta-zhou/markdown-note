<template>
  <div class="app-wrap">
    <button class="theme-btn" @click="toggleTheme" :title="theme === 'light' ? '切换暗色' : '切换亮色'">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
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
        :saveStatus="saveStatus"
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
  import { ref, onMounted, onUnmounted } from "vue";
  import NoteList from "./components/NoteList.vue";
  import NoteEditor from "./components/NoteEditor.vue";
  import NotePreview from "./components/NotePreview.vue";
  import { useTheme } from "./composables/useTheme.js";

  const { theme, toggle: toggleTheme } = useTheme();

  const notes = ref([]);
  const currentNote = ref(null);
  const saveStatus = ref("saved"); // 'saved' | 'saving' | ''

  // 读取本地数据
  onMounted(() => {
    const data = localStorage.getItem("markdown-notes");
    if (data) notes.value = JSON.parse(data);
    if (notes.value.length) currentNote.value = notes.value[0];
  });

  // 键盘快捷键
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

  // 防抖
  function debounce(fn, delay = 1500) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // 保存到本地（原始写入）
  function _writeToLocal() {
    localStorage.setItem("markdown-notes", JSON.stringify(notes.value));
    saveStatus.value = "saved";
  }

  // 带防抖的保存：输入中 → saving，写入后 → saved
  const saveToLocal = debounce(_writeToLocal, 1500);

  function triggerSave() {
    saveStatus.value = "saving";
    saveToLocal();
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
    _writeToLocal();
  }

  // 选择笔记
  function selectNote(note) {
    currentNote.value = note;
  }

  // 保存笔记（编辑触发 → 防抖写入）
  function saveNote(note) {
    const index = notes.value.findIndex((i) => i.id === note.id);
    if (index !== -1) notes.value[index] = note;
    triggerSave();
  }

  // 删除笔记（立即写入）
  function deleteNote(id) {
    notes.value = notes.value.filter((i) => i.id !== id);
    if (currentNote.value?.id === id)
      currentNote.value = notes.value[0] || null;
    _writeToLocal();
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
    background: var(--app-bg);
    position: relative;
  }
  .theme-btn {
    position: absolute;
    top: 16px;
    right: 20px;
    z-index: 10;
    background: var(--panel-bg);
    border: 1px solid var(--border-clr);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow);
    transition: transform 0.2s;
  }
  .theme-btn:hover {
    transform: scale(1.1);
  }
  .app-container {
    display: flex;
    height: 100%;
    gap: 12px;
    padding: 12px;
    box-sizing: border-box;
  }
</style>

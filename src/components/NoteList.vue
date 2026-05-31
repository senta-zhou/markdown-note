<template>
  <div class="note-list">
    <button class="add-btn" @click="emit('add')">+ 新建笔记</button>
    <input
      v-model="searchQuery"
      class="search-input"
      placeholder="搜索笔记..."
      @click.stop
    />
    <div class="list">
      <div
        v-for="item in filteredNotes"
        :key="item.id"
        class="item"
        :class="{ active: item.id === activeId }"
        @click="emit('select', item)"
      >
        <div class="title">{{ item.title }}</div>
        <div class="time">{{ item.createTime }}</div>
      </div>
      <div v-if="!filteredNotes.length" class="empty">
        {{ searchQuery ? '没有找到相关笔记' : '暂无笔记，点击上方按钮新建' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  notes: Array,
  activeId: [Number, String],
});
const emit = defineEmits(["add", "select"]);

const searchQuery = ref("");

const filteredNotes = computed(() => {
  if (!props.notes) return [];
  if (!searchQuery.value) return props.notes;
  const q = searchQuery.value.toLowerCase();
  return props.notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q),
  );
});
</script>

<style scoped>
.note-list {
  width: 260px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--color-shadow);
  transition: var(--transition-smooth);
  flex-shrink: 0;
}

.add-btn {
  width: 100%;
  padding: 10px 14px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background var(--transition-fast), transform 0.1s ease;
}
.add-btn:hover {
  background: var(--color-accent-hover);
}
.add-btn:active {
  transform: scale(0.98);
}

.search-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-family: var(--font-sans);
  background: var(--color-surface-secondary);
  color: var(--color-text);
  box-sizing: border-box;
  outline: none;
  transition: var(--transition-smooth);
}
.search-input::placeholder {
  color: var(--color-text-tertiary);
}
.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}

.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.item {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text);
  transition: background var(--transition-fast);
}
.item:hover {
  background: var(--color-surface-secondary);
}
.item.active {
  background: var(--color-accent-bg);
  border-left: 3px solid var(--color-accent);
  border-radius: 4px var(--radius-sm) var(--radius-sm) 4px;
}

.title {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.time {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
.empty {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 13px;
  padding: 24px 0;
}

@media (max-width: 900px) {
  .note-list {
    width: 100%;
    max-height: 40vh;
  }
}
</style>

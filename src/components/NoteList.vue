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
    width: 240px;
    background: var(--panel-bg);
    border-radius: 8px;
    padding: 12px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
  }
  .add-btn {
    width: 100%;
    padding: 10px;
    background: var(--green);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .search-input {
    width: 100%;
    margin-top: 10px;
    padding: 8px 10px;
    border: 1px solid var(--border-clr);
    border-radius: 6px;
    font-size: 13px;
    background: var(--input-bg);
    color: var(--text-color);
    box-sizing: border-box;
    outline: none;
  }
  .search-input:focus {
    border-color: var(--green);
  }
  .list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
  }
  .item {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-color);
  }
  .item.active {
    background: var(--green-bg);
    border-left: 3px solid var(--green);
  }
  .title {
    font-weight: 500;
  }
  .time {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }
  .empty {
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
    padding: 20px 0;
  }
</style>

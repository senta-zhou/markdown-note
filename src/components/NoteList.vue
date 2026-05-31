<template>
  <div class="note-list">
    <button class="add-btn" @click="emit('add')">+ 新建笔记</button>
    <div class="list">
      <div
        v-for="item in notes"
        :key="item.id"
        class="item"
        :class="{ active: item.id === activeId }"
        @click="emit('select', item)"
      >
        <div class="title">{{ item.title }}</div>
        <div class="time">{{ item.createTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    notes: Array,
    activeId: [Number, String],
  });
  const emit = defineEmits(["add", "select"]);
</script>

<style scoped>
  .note-list {
    width: 240px;
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 10px #0001;
  }
  .add-btn {
    width: 100%;
    padding: 10px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .item {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
  }
  .item.active {
    background: #e8f4f8;
    border-left: 3px solid #42b983;
  }
  .title {
    font-weight: 500;
  }
  .time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
</style>

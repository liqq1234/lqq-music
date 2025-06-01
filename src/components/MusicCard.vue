<!-- src/components/MusicCard.vue -->
<template>
  <el-card shadow="hover" style="width: 300px">
<div style="display: flex; align-items: center;">
  <!-- 封面图 -->
  <img
    :src="song.cover"
    alt="cover"
    style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 12px;"
  />

  <!-- 歌曲信息 -->
  <div>
    <div style="color: #000; font-size: 14px; font-weight: normal;">
      {{ song.name }}
    </div>
    <div style="color: #888; font-size: 12px;">
      {{ song.artist }} - {{ song.album }}
    </div>
  </div>
</div>
  </el-card>
</template>

<script setup>
defineProps({
  song: {
    type: Object,
    required: true,
  },
});

defineEmits(['play']);
</script>

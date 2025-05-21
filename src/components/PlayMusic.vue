<template>
  <div class="container">
    <h1>声动</h1>
    <input v-model="songname" placeholder="留下您最想听的歌" />
<button @click="getPlayUrl">
  <img src="@/assets/imgs/search.png" alt="搜索" style="width:100px; height:100px;">
</button>
    <!-- 使用播放器组件 -->
    <AudioPlayer :audioUrl="audioSrc" :isPauseTtsAudio="isPauseTtsAudio" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import AudioPlayer from './AudioPlayer.vue'

const songname = ref('')
const audioSrc = ref('') // 音频链接
const isPauseTtsAudio = ref(false) // 控制是否暂停播放试听

const getPlayUrl = async () => {
  if (!songname.value.trim()) {
    alert('好像还没有写')
    return
  }

  try {
    const res = await axios.get('http://localhost:3000/song/url', {
      params: {
        songName: songname.value,
      },
    })

    const resData = res.data
    const firstKey = Object.keys(resData)[0]
    const playUrl = resData[firstKey]

    if (playUrl) {
      audioSrc.value = playUrl
      isPauseTtsAudio.value = false // 确保播放不被暂停
    } else {
      alert('未获取到播放链接')
    }
  } catch (err) {
    console.error('请求出错:', err)
    alert('请求播放链接出错')
  }
}
</script>
<style scoped>
.container {
  min-height: 100vh; /* 撑满整个屏幕高度 */
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

input {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
  width: 80%;
  font-size: 16px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #000000;
}
</style>

<style>
/* 全局样式：页面背景彻底黑色，无边界 */
html, body {
  margin: 0;
  padding: 0;
  background-color: #000;
  color: #fff;
  font-family: sans-serif;
}
</style>
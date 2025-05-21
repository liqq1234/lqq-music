<template>
  <div class="container">
    <h1>音乐发烧友</h1>
    <input v-model="songname" placeholder="留下您最想听的歌" />
    <button @click="getPlayUrl">播放</button>
    <audio ref="audioRef" controls></audio>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const songname = ref('')
const audioRef = ref(null)

const getPlayUrl = async () => {
  if (!songname.value) {
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
      const audio = audioRef.value
      audio.src = playUrl
      await audio.play()
    } else {
      console.error('未获取到播放链接')
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
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #000;
  color: white;
  min-height: 100vh;
}
input {
  padding: 8px;
  margin-right: 10px;
  color: black;
}
button {
  padding: 8px 12px;
}
audio {
  display: block;
  margin-top: 20px;
  width: 100%;
}
</style>

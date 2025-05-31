<template>
  <div>
    <h1 class="classical-title">声动</h1>
    <el-space :size="10" direction="horizontal" alignment="center">
  <el-input v-model="songname" placeholder="请留下最想听的歌" style="width: 240px" />
  <el-button type="primary" @click="getPlayUrl" >
    <el-icon><Search /></el-icon>
  </el-button>
  <el-button
    style="background-color: #FFE066; border-color:#FFE066; color: white;"
    @click="getPlayUrl"
  >
   <el-icon><Star /></el-icon>
  </el-button>
  </el-space>

   <div
    id="aplayer"
    ref="aplayer"
    style="margin: 20px auto; width: 320px;"
>  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const songname = ref('')
const aplayer = ref(null)
let ap = null

const getPlayUrl = async () => {
  if (!songname.value.trim()) {
    ElMessage.warning('请输入歌曲名')
    return
  }

  try {
    const res = await axios.get('http://localhost:3000/song/url', {
      params: { songName: songname.value },
    })
    const { playUrlInfo, songInfo } = res.data
    console.log(songInfo)
    //播放链接
    const firstKey = Object.keys(playUrlInfo)[0]
    const playUrl = playUrlInfo[firstKey]
      //专辑图片
    const albumMid = songInfo.track_info.album.mid;
    const coverUrl = `https://y.qq.com/music/photo_new/T002R300x300M000${albumMid}.jpg`;
    if (!playUrl) {
      ElMessage.error('未获取到播放链接')
      return
    }

    // 播放器初始化
    if (ap) ap.destroy()

    if (window.APlayer) {
      ap = new window.APlayer({
        container: aplayer.value,
        autoplay: true,
        audio: [
            {
 
            name: songInfo.track_info.name, 
            artist: songInfo.track_info.singer[0].name || '未知',
            url: playUrl,
            cover:coverUrl,
          },
        ],
      })
    } else {
      console.error('APlayer 未加载')
      ElMessage.error('播放器加载失败，请刷新页面')
    }
  } catch (err) {
    console.error('请求出错:', err)
    ElMessage.error('请求播放链接失败')
  }
}
</script>
<style scoped>
.classical-title {
  font-family: 'Cinzel', serif;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 2px;
}
</style>


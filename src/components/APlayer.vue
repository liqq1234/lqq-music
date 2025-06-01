<template>
    <el-row :gutter="20">
        <el-col :span="12">
            <div class="grid-content ep-bg-purple" />
            <h1 class="classical-title">声动</h1>
            <el-space :size="10" direction="horizontal" alignment="center">
                <el-input v-model="songname" placeholder="请留下最想听的歌" style="width: 240px" />
                <el-button type="primary" @click="getPlayUrl">
                    <el-icon>
                        <Search />
                    </el-icon>
                </el-button>
                <el-button
                    style="background-color: #FFE066; border-color:#FFE066; color: white;"
                    @click="addSampleSong"
                >
                    <el-icon>
                        <Star />
                    </el-icon>
                </el-button>
            </el-space>

            <div id="aplayer" ref="aplayer" style="margin: 20px auto; width: 320px;"></div>
        </el-col>
        <el-col :span="12">
  <h3 style="margin-bottom: 12px;">🎧 我的收藏</h3>
  <div class="flex flex-wrap gap-4">
    <MusicCard
      v-for="(song, index) in favorites"
      :key="index"
      :song="song"
      @play="playSong"
    />
  </div>
        </el-col>
    </el-row>
</template>




<script setup>
import { ref,onMounted} from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import MusicCard from "@/components/MusicCard.vue"; // 路径根据你项目结构调整



const songname = ref("");
const aplayer = ref(null);
const playUrlInfo = ref("");
const songInfo = ref({});
let ap = null;
const favorites= ref([]) 


onMounted(() => {
  fetch("http://localhost:3000/favorites")
    .then(res => res.json())
    .then(data => {
      favorites.value = data;
    });
});
const getPlayUrl = async () => {

    if (!songname.value.trim()) {
        ElMessage.warning("请输入歌曲名");
        return;
    }

    try {
        const res = await axios.get("http://localhost:3000/song/url", {
            params: { songName: songname.value },
        });
const { playUrlInfo: resPlayUrlInfo, songInfo: resSongInfo } = res.data;
playUrlInfo.value = resPlayUrlInfo;
songInfo.value = resSongInfo;
        console.log(songInfo);
        //播放链接
const firstKey = Object.keys(playUrlInfo.value)[0];
const playUrl = playUrlInfo.value[firstKey];
        //专辑图片
        const albumMid = songInfo.value.track_info.album.mid;
        const coverUrl = `https://y.qq.com/music/photo_new/T002R300x300M000${albumMid}.jpg`;
        if (!playUrl) {
            ElMessage.error("未获取到播放链接");
            return;
        }

        // 播放器初始化
        if (ap) ap.destroy();

        if (window.APlayer) {
            ap = new window.APlayer({
                container: aplayer.value,
                autoplay: true,
                audio: [
                    {
                        name: songInfo.value.track_info.name,
                        artist: songInfo.value.track_info.singer[0].name || "未知",
                        url: playUrl,
                        cover: coverUrl,
                    },
                ],
            });
        } else {
            console.error("APlayer 未加载");
            ElMessage.error("播放器加载失败，请刷新页面");
        }
    } catch (err) {
        console.error("请求出错:", err);
        ElMessage.error("请求播放链接失败");
    }
};

const addSampleSong = async () => {
  const sampleSong = {
    name:  songInfo.value.track_info.name,
    artist: songInfo.value.track_info.singer[0].name || "未知",
    album: songInfo.value.track_info.album.name,
    cover: `https://y.qq.com/music/photo_new/T002R300x300M000${songInfo.value.track_info.album.mid}.jpg`,
    url:  playUrlInfo.value[Object.keys(playUrlInfo.value)[0]],
  };
    favorites.value.push(sampleSong);
    try {
    const res = await axios.post("http://localhost:3000/save-favorite", sampleSong);
    if (res.data.success) {
      ElMessage.success("添加成功,UP主会好好保留的！！");
    } else {
      ElMessage.error("保存失败");
    }
  } catch (err) {
    console.error("保存出错：", err);
    ElMessage.error("请求失败");
  }
}

</script>
<style scoped>
.classical-title {
    font-family: "Cinzel", serif;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 2px;
}

.el-row {
    margin-bottom: 20px;
}
.el-row:last-child {
    margin-bottom: 0;
}
.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>


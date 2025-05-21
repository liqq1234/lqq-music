<template>
  <div>
    <div class="audio-box" v-if="showAudio">
      <div
        class="play"
        :class="[status ? 'start' : '']"
        @click="audioStart"
      ></div>
      <div class="time-line" @click="turnPosition($event)">
        <div class="play-line" :style="{ width: translateX }"></div>
        <div class="atn" @mousedown.stop="mousedown($event)"></div>
      </div>
      <div class="time">{{ time }}/{{ duration }}</div>
    </div>
    <audio
      :controls="false"
      :autoplay="false"
      :loop="false"
      preload="auto"
      ref="audio"
      class="aud"
      id="audio"
      @loadstart="loadstart"
      @timeupdate="timeupdate"
      @canplay="canplay"
      @loadedmetadata="loadedmetadata"
    >
      <!-- <source src="../../assets/audio/xx.mp3" type="audio/mpeg" /> -->
      <!-- <source src="" type="audio/mpeg" /> -->
    </audio>
  </div>
</template>
<script>
export default {
  name: 'AudioPlayer', // ✅ 给组件起个名字
  data() {
    return {
      //音频
      status: false, //是否播放中
      time: "0:00",
      translateX: 0,
      duration: "0:00",
      listen: false,
      clientX: 0,
      clientY: 0,
      morX: 0,
      tranX: 0,
      showAudio: true,
      audio_url: "" //音频链接
    };
    },
  props: {
  src: {
    type: String,
    required: true
  }
  },
  mounted() {
    this.getAudio();
  },
  methods: {
    //鼠标按下移动后触发
    moveFun(event) {
      let that = this;
      console.log("move");
      // 处理鼠标移动事件的逻辑
      //console.log("鼠标的坐标：", event.clientX, event.clientY, event.which);
 
      if (event.which != 1) {
        //鼠标左键没有按下
        console.log("左键no");
        this.upFun();
        //当鼠标拖动dom时如果出现禁止拖动图标则重新刷新一下音频组件
        //this.resetPage();
        return;
      }
      //计算与原始位置的偏移距离
      if (that.listen) {
        console.log("计算", event.clientX, that.clientX);
        const x = event.clientX - that.clientX;
        this.tranX = that.morX + x;
        //console.log("tranX", this.tranX);
        if (this.tranX < 0) {
          this.tranX = 0;
        }
        if (this.tranX > document.querySelector(".time-line").clientWidth) {
          this.tranX = document.querySelector(".time-line").clientWidth;
        }
        this.translateX =
          (this.tranX / document.querySelector(".time-line").clientWidth) *
            100 +
          "%";
      }
    },
    //鼠标抬起时触发
    upFun() {
      this.listen = false;
      // 处理鼠标移动事件的逻辑
      //console.log("抬起");
      this.$refs.audio.currentTime =
        this.$refs.audio.duration *
        (this.tranX / document.querySelector(".time-line").clientWidth);
      // console.log('鼠标的坐标：', event.clientX, event.clientY);
      //去除监听
      window.removeEventListener("mousemove", this.moveFun);
      window.removeEventListener("mouseup", this.upFun);
      this.resetPage();
    },
    //刷新音频组件，防止出现拖动不了的情况
    resetPage() {
      console.log("刷新页面");
      this.showAudio = false;
      this.$nextTick(() => {
        this.showAudio = true;
      });
      this.$forceUpdate();
    },
    //鼠标按下
    mousedown(e) {
      console.log("鼠标按下", e);
      this.clientX = e.clientX;
      this.clientY = e.clientY;
      this.listen = true;
      this.morX =
        (this.$refs.audio.currentTime / this.$refs.audio.duration) *
        document.querySelector(".time-line").clientWidth; //原始位置
      document.querySelector(".time-line .atn").focus();
      window.addEventListener("mousemove", this.moveFun);
      window.addEventListener("mouseup", this.upFun);
    },
    //音频开关
    audioStart() {
      this.status = !this.status;
      console.log(this.status);
      this.status ? this.$refs.audio.play() : this.$refs.audio.pause();
      console.log(this.$refs.audio.duration);
    },
    //点击进度条某个位置播放
    turnPosition(e) {
      console.log(this.$refs.audio.fastSeek);
      console.log("turnPosition", e, e.layerX);
      console.log(e.layerX, document.querySelector(".time-line").clientWidth);
      console.log(
        this.$refs.audio.duration,
        (e.layerX / document.querySelector(".time-line").clientWidth) *
          this.$refs.audio.duration
      );
      this.$refs.audio.currentTime =
        (e.layerX / document.querySelector(".time-line").clientWidth) *
        this.$refs.audio.duration;
    },
    //播放时触发
    timeupdate() {
      //console.log("播放");
      console.log(this.$refs.audio.currentTime); //播放位置
      let currentTime = this.$refs.audio.currentTime;
      if (currentTime > 60) {
        let minute = Math.floor(currentTime / 60); //分
        let second = Math.floor(currentTime % 60); //秒
        this.time = minute + ":" + (second > 9 ? second : "0" + second);
      } else {
        let num = Math.floor(currentTime);
        this.time = num > 9 ? "0:" + num : "0:0" + num;
      }
      // this.translateX =
      //   (this.$refs.audio.currentTime / this.$refs.audio.duration) *
      //   (document.querySelector(".time-line").clientWidth - 9);
      //不在拖动事件时，实时显示进度
      if (!this.listen) {
        this.translateX =
          (this.$refs.audio.currentTime / this.$refs.audio.duration) * 100 +
          "%";
      }
      if (this.$refs.audio.currentTime == this.$refs.audio.duration) {
        this.status = false;
      }
    },
    //加载时触发
    loadstart() {
      console.log(
        "开始加载...",
        document.querySelector(".aud").parentNode.childNodes,
        this.$refs.audio.duration
      );
      // if (this.$refs.audio.duration + "" == "NaN") {
      //   this.$message.error("音频文件获取失败");
      // }
    },
    //进度条变化时触发
    loadedmetadata() {
      console.log("文件加载中...", this.$refs.audio.duration);
      let duration = this.$refs.audio.duration;
      let hour = null;
      if (duration > 3600) {
        hour = Math.floor(duration / 3600);
        duration = duration - hour * 3600;
      }
      let minute = Math.floor(duration / 60); //分
      let second = Math.floor(duration % 60); //秒
      this.duration =
        (hour ? (hour < 9 ? "0" + hour + ":" : hour + ":") : "") +
        minute +
        ":" +
        (second > 9 ? second : "0" + second);
    },
    canplay() {},
    // //获本地音频
    // getAudio() {
    //   //是否存在音频
    //   if (this.$refs.audio) {
    //     this.$refs.audio.src = require("../../assets/audio/xx.mp3");
    //     this.$nextTick(() => {
    //       this.$refs.audio.load();
    //     });
    //   }
      // }
    //获取网络播放地址
   getAudio() {
    if (this.$refs.audio && this.src) {
      this.$refs.audio.src = this.src
      this.$nextTick(() => {
        this.$refs.audio.load()
        this.$refs.audio.play()
      })
    }
  }
      
  }
};
</script>
<style lang="less" scoped>
.audio-box {
  padding: 11px 16px;
  background: #f0f1f3;
  display: flex;
  align-items: center;
  margin: 24px 0;
  width: 500px;
  .play {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    background: url("../../assets/imgs/play-icon.svg") no-repeat;
    cursor: pointer;
  }
  .start {
    background-image: url("../../assets/imgs/play-start-icon.svg");
  }
  .time-line {
    display: flex;
    flex: 1;
    align-items: center;
    height: 1px;
    background: #d8d8d8;
    position: relative;
    cursor: pointer;
    .play-line {
      width: 0%;
      position: relative;
      height: 1px;
      background-color: #20499e;
      .line-time {
        font-size: 12px;
        color: #999999;
        position: absolute;
        right: -28px;
        top: 3px;
      }
    }
    .atn {
      width: 9px;
      height: 9px;
      background: #ffffff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .time {
    font-size: 12px;
    color: #999999;
    margin-left: 8px;
  }
}
</style>
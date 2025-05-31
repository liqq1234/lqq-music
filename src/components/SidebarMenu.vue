<template>
  <el-row class="tac">
    <el-col :span="15">
      <h5 class="mb-2">菜单</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#d0e8ff"
      >
        <el-menu-item index="1" @click="$router.push('/home')">
          <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="2" @click="$router.push('/music')">
          <el-icon><Headset /></el-icon>
          <span>音乐</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>


const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>



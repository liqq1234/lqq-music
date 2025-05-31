<template>
  <div class="common-layout">
    <el-container>
    <el-aside width="250px">
     <SidebarMenu />
    </el-aside>      
    <el-main>
    <router-view />
    </el-main>
    <el-aside width="200px">Aside</el-aside>
    </el-container>
  </div>
</template>
<script>
import SidebarMenu from '@/components/SidebarMenu.vue'
export default {
  name: 'AppLayout',
  components: {
    SidebarMenu
  }
}
</script>

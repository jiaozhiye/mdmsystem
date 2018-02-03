<template>
<el-container id="app">
  <el-header height="50px">
    <AppHeader></AppHeader>
  </el-header>
  <el-container>
    <el-aside width="200px" :class="{off: sidebarState}">
      <AppSidebar></AppSidebar>
      <div class="icon sidebar-ctrl-btn" :class="{off: sidebarState}" @click.stop="sidebarHandle"></div>
    </el-aside>
    <el-main :class="{on: sidebarState}">
      <transition name="router">
        <router-view class="view-wrapper"></router-view>
      </transition>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import 'common/css/reset.css'
import 'common/css/style.css'

import AppHeader from 'components/Header.vue'
import AppSidebar from 'components/Sidebar.vue'

export default {
  name: 'app',
  data (){
    return {
      sidebarState: false
    }
  },
  methods: {
    sidebarHandle (){
      this.sidebarState = !this.sidebarState
    }
  },
  components: {
    AppHeader,
    AppSidebar
  }
}
</script>

<style>
#app .el-header {
  line-height: 50px;
  background-color: #2dc3e8;
}
#app .el-container {
  height: calc(100vh - 50px);
  position: relative;
}
#app .el-aside {
  background-color: #273240;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: visible;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}
#app .el-aside.off {
  left: -200px;
}
#app .sidebar-ctrl-btn {
  height: 48px;
  width: 24px;
  position: absolute;
  top: 45%;
  right: -20px;
  background-position: 100% -116px;
  cursor: pointer;
  z-index: 10;
}
#app .sidebar-ctrl-btn:hover {
  background-position: right -164px;
}
#app .sidebar-ctrl-btn.off {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
#app .el-main {
  position: relative;
  background-color: #eee;
  margin-left: 200px;
  padding: 0px;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}
#app .el-main.on {
  margin-left: 0;
}
#app .view-wrapper {
  position: absolute;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  min-height: 500px;
  overflow-y: auto;
}

/**
 * 路由组件切换动画
 */
#app .router-enter {
  opacity: 0;
  -webkit-transform: translate3d(0, 25px, 0);
  transform: translate3d(0, 25px, 0);
}
#app .router-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
#app .router-leave {
  opacity: 1;
}
#app .router-leave-to {
  opacity: 0;
}
#app .router-enter-to,
#app .router-leave {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
#app .router-enter-active,
#app .router-leave-active {
  -webkit-transition: all .5s ease-out;
  transition: all .5s ease-out;
}
</style>
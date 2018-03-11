<template>
  <div id="app" style="height:100%;">
     <view-box ref="viewBox"> 
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <span>{{ this.$store.state.appPath }}</span>
        <x-icon slot="right" type="search" size="31" class="header-icon"></x-icon>
      </x-header>
      <transition name="fade">
        <router-view style="margin: 50px 0;"></router-view>
      </transition>
      <tabbar slot="bottom">
        <tabbar-item link="/home">
          <img slot="icon" src="./assets/ios7-home-outline.png">
          <span slot="label">投票</span>
        </tabbar-item>
        <tabbar-item show-dot link="/profile">          
          <img slot="icon" src="./assets/ios7-person-outline.png">
          <span slot="label">我</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, XHeader, ViewBox } from 'vux'
export default {
  name: 'app',
  components: {
    Tabbar,
    TabbarItem,
    XHeader,
    ViewBox
  },
  computed: {
    appTitle () {
      return this.$store.state.appPath
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
body {
  background-color: #fbf9fe;
}
#id {
  height: 100%;
}
.header-icon {
  fill:#fff;
  position:relative;
  top:-8px;
  left:-3px;
}
.tab-icon {
  fill: #9a9a9a;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
</style>

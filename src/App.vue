<template>
  <van-nav-bar v-if="isBase" :title="titles[active].title" />
  <van-nav-bar v-else :title="titles[active].title" left-text="返回" left-arrow @click-left="onReturn" />
  <router-view :style="{ height: '100%' }" />
  <van-tabbar v-model="active">
    <van-tabbar-item v-for="title in titles" :icon="title.icon" :key="title.title" :to="title.to">{{ title.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { NavBar, Tabbar, TabbarItem } from 'vant';
export default {
  name: 'App',
  components: {
    [NavBar.name]: NavBar,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: 1,
      titles: [
        {
          title: '主页',
          to: '/',
          icon: 'home-o'
        },
        {
          title: '任务',
          to: '/job',
          icon: 'search'
        },
        {
          title: '用户',
          to: '/user',
          icon: 'friends-o'
        },
        {
          title: '设置',
          to: '/settings',
          icon: 'setting-o'
        }
      ]
    }
  },
  methods: {
    onReturn() {
      this.$router.back();
    }
  },
  computed: {
    isBase() {
      let backslash = 0;
      const path = this.$route.path;
      for (let i = 0; i < path.length; i++) {
        if (path[i] == '/') {
          backslash++;
        }
      }
      return backslash <= 1
    }
  }
}
</script>

<style>
html,
body {
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
</style>

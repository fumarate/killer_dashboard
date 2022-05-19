<template>
  <van-nav-bar :title="Killer" />

  <!--van-nav-bar v-else :title="navBarTitle" left-text="返回" left-arrow @click-left="onReturn" /-->
  <router-view :style="{ height: '100%' }" />
  <van-tabbar placeholder route v-model="active">
    <van-tabbar-item v-for="title in titles" replace :icon="title.icon" :key="title.title" :to="title.to" :badge="(title.badge&&(count>0))?count:null">{{ title.title
    }}
    </van-tabbar-item>
  </van-tabbar>

</template>

<script>
import '@/assets/css/global.scss'
import { NavBar, Tabbar, TabbarItem } from 'vant';
import api from '@/api/api'
export default {
  name: 'App',
  components: {
    [NavBar.name]: NavBar,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  mounted() {
fetch(api + "/history")
            .then(resp => resp.json())
            .then(respJson => {
              let count=0;
                for(var i=0;i<respJson.data.length;i++){
                    if(!respJson.data[i].checked){
                        count+=1;
                    }
                }
                this.count=count;
            })

  },
  data() {
    return {
      active: 0,
      count:0,
      titles: [
        {
          title: '主页',
          to: '/',
          icon: 'home-o',
          badge:true
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
    },
    navBarTitle() {
      for (let i = this.titles.length-1; i >=0; i--) {
        if (this.$route.path.startsWith(this.titles[i].to)) {
          return this.titles[i].title;
        }
      }
      return 0;
    }
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

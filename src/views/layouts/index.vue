<template>
  <div class="app-container">
    <div class="layout-content">
      <!-- v-if="isShow" -->
      <keep-alive include="Home">
        <router-view></router-view>
      </keep-alive>
      <!-- <router-view v-else></router-view> -->
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" :defaultActive="defaultActive" :uID="userInfo.uID" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// 搜索框
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  data() {
    return {
      isShow:true,
      defaultActive:0,
      tabbars: [
        {
          title: '首页',
          to: {
            name: 'Home'
          },
          icon: 'home-o'
        },
        {
          title: '我的',
          to: {
            name: 'About'
          },
          icon: 'user-o'
        }
      ],
    }
  },
  components: {
    TabBar
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleChange(v) {
      // console.log('tab value:', v)
    }
  },
  computed:{
    ...mapGetters(['userInfo']),
  }
}
</script>

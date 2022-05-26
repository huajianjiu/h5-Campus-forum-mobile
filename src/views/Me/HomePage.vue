<template>
  <div ref="viewBox">
    <!-- 顶部设置导航栏 -->
    <div
      @click="$router.go(-1)"
      :class="{'navhead':true,'headerbgc1':headerbgc}"
    >
      <span class="leftarrow iconfont">&#xe603;</span>
      <div
        class="avatarsmall"
        v-show="headerbgc"
      >
        <img
          width="30px"
          height="30px"
          :src="userInfo.userAvatarUrl"
        >
      </div>
    </div>
    <div class="bg">
      <img
        src="@/assets/bg1.jpg"
        alt=""
      >
    </div>
    <div class="info">
      <div @click="showBigImg" class="avatar">
        <img
          width="80px"
          height="80px"
          :src="userInfo.userAvatarUrl"
        >
      </div>
      <div class="nickname">

        {{userInfo.userNickname}}&nbsp;
        <span class="iconfont" style="color:#87CEFA" v-if="userInfo.userGender=='男'">&#xe632;</span>
        <span class="iconfont" style="color:#FF69B4" v-else>&#xe631;</span>
        <van-button
          @click="toEditInfo"
          size="small"
          plain
          type="primary"
          style="color:#7558fe;border:1px solid #7558fe;float:right;padding:0 15px;font-size:14px"
        >编辑</van-button>
      </div>
      <p v-if="userInfo.userStatement==''">此人很懒,什么都没有写</p>
      <p v-else>{{userInfo.userStatement}}</p>
    </div>
    <!-- <div class="topiclist"> -->
    <topic-list></topic-list>

    <!-- </div> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { ImagePreview } from 'vant';
export default {
  name: 'HomePage',
  // components: {
  //   [ImagePreview.Component.name]: ImagePreview.Component,
  // },
  data() {
    return {
      active: 0,
      headerbgc: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  computed:{
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 监测屏幕滚动
    handleScroll() {
      if (window.pageYOffset > 115) {
        this.headerbgc = true;
      } else {
        this.headerbgc = false;
      }

    },
    toEditInfo() {
      this.$router.push('/editinfo')
    },
    // 头像查看
    showBigImg(){
          ImagePreview({
          images: [
            this.userInfo.userAvatarUrl
          ],
        startPosition: 0,
      });
    }
},
}
</script>

<style scoped>
.leftarrow {
  display: inline-block;
  float: left;
  font-size: 26px;
  margin-top: 10px;
}
.avatarsmall {
  margin: 8px 0 0 10px;
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
}
.headerbgc1 {
  background-color: #fff;
}
.navhead {
  z-index: 1000;
  position: fixed;
  top: 0;
  width: 375px;
  height: 46px;
  /* line-height: 46px; */
  padding: 0 10px;
}
.bg {
  height: 120px;
  width: 375px;
  overflow: hidden;
}
.bg img {
  width: 100%;
}
.info {
  position: relative;
  width: 345px;
  padding: 0 15px 15px 15px;
  background-color: #fff;
}
/* 头像 */
.avatar {
  position: absolute;
  padding: 0;
  left: 15px;
  top: -40px;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  overflow: hidden;
}
.nickname {
  /* margin: 50px 15px 0 15px; */
  height: 32px;
  line-height: 32px;
  padding-top: 50px;
  font-size: 18px;
}
.topiclist {
  overflow: hidden;
  /* margin-top:10px; */
  height: 30px;
  background-color: #fff;
}
</style>

<!-- home -->
<template>
  <div class="about-container">
    <!-- 顶部设置导航栏 -->
    <!-- 顶部设置导航栏 -->
    <div class="navhead">
      <router-link to="/setting">
          <van-icon size="22" name="setting-o"></van-icon>
      </router-link>
    </div>
    <!-- 内部 -->
    <div class="content">
      <!-- 用户头像昵称 -->
      <router-link to="/homepage" style="color:black">
        <div class="header">
          <div class="upInfo">
            <!-- 头像 -->
            <span class="imgs">
              <van-image
                round
                lazy-load
                width="55px"
                height="55px"
                :src="userInfo.userAvatarUrl"
              />
            </span>
            <!-- 评论人信息 -->
            <span class="nickname">{{userInfo.userNickname}}</span>
              <span class="arrow">
                <van-icon color="#7558fe" size="25" name="arrow" />
              </span>
          </div>
        </div>
      </router-link>
      <!-- 点赞评论数量 -->
      <div class="dianzan">
        <span>
          <div>0</div>
          点赞
        </span>
        <span>
          <div>{{replyCount}}</div>
          评论
        </span>
        <!-- <van-grid :column-num="2">
          <van-grid-item  icon="photo-o" text="文字" />
          <van-grid-item  icon="photo-o" text="文字" />
        </van-grid> -->
      </div>
      <div style="border-radius:10px;overflow:hidden;margin-top:15px">
        <van-grid :border="false" :column-num="2">
            <van-grid-item
            @click="toTabList"
              icon="newspaper-o"
              text="我的帖子"
            />
          <van-grid-item
            icon="underway-o"
            text="敬请期待"
          />
          <!-- <van-grid-item

          />
          <van-grid-item
          /> -->
        </van-grid>
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'About',
  data() {
    return {
      // 评论数量
      replyCount:0
    }
  },
  computed:{
    ...mapGetters(['userInfo'])
  },
  mounted(){
    this.getReplyNum();
  },
  methods:{
    toTabList(){
      this.$router.push('/tablist');
    },
    // 获取点赞和回复
    async getReplyNum(){
      const {uID} = this.userInfo;
       let result = await this.$API.user.reqUserReplyCount({uID});
       if(result.code==200){
         this.replyCount=result.data.replyCount;
       }
    }
  }
}
</script>
<style scoped>
/* 顶部样式 */
  .navhead{
    top:0;
    width: 345px;
    height: 46px;
    line-height: 46px;
    padding: 0 15px;
    text-align: right;

  }
/* vant样式 */
.van-nav-bar__left,
.van-nav-bar__right {
  font-size: 16px;
}
.van-icon {
  color: #4e5969;
  font-size: 20px;
}
/* 自定义样式 */
.index-container {
  width: 100%;
  padding: 0;
  background-color: #f5f5f5;
}
.content {
  overflow: hidden;
  width: 345px;
  padding: 0 15px 15px 15px;
}
.content div {
  width: 100%;
}
.content .header {
  padding-top: 10px;
  overflow: hidden;
}
/* 用户信息 */
.content .header .upInfo {
  width: 100%;
}
.content .header .upInfo span {
  float: left;
  display: inline-block;
}
.content .header .upInfo .upUser {
  width: 200px;
  font-weight: normal;
}
.nickname {
  width: 200px;
  /* padding: 10px 0 0 20px; */
  margin-left: 20px;
  height: 55px;
  line-height: 55px;
  font-size: 20px;
}
.arrow {
  margin-left: 20px;
  height: 55px;
  line-height: 55px;
  float: left;
  font-size: 25px;
}
.dianzan span {
  margin-top: 30px;
  display: inline-block;
  width: 50%;
  text-align: center;
}
.dianzan span div {
  font-size: 18px;
  font-weight: bold;
}
</style>

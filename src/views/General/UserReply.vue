<template>
  <div class="replys">
    <div class="upInfo">
      <!-- 头像 -->
      <div class="imgs">
        <van-image
          round
          lazy-load
          width="35px"
          height="35px"
          :src="reply.user.userAvatarUrl"
        />
      </div>
      <!-- 评论人信息 -->
      <div class="upUser">
        <div>{{reply.user.userNickname}}</div>
        <div>{{time}}</div>
      </div>
      <div style="float:right;color:#cccccc;font-size: 16px;padding-top:5px">
        <van-icon
          @click="toLike"
          style=""
          :class="{'active':isActive} "
          name="good-job"
        >{{this.reply.rLikes}}</van-icon>
      </div>
    </div>
    <!-- 评论 -->
    <div class="bottomInfo">
      <p>{{reply.rContents}}</p>
    </div>
  </div>
</template>

<script>
import {formatTime} from "@/utils"
export default {
  name: 'UserReply',
  data() {
    return {
      isActive:false
    }
  },
  computed:{
    time:function(){
      // console.log(typeof this.topic.tTime)
      return formatTime(this.reply.rTime)
    }
  },
  props:['reply'],
  methods:{
    // 点赞
    async toLike(){
      let like;
      if(this.isActive){
        this.reply.rLikes--;
        like=-1;
      }else {
        this.reply.rLikes++;
        like=1;
      }
      this.isActive = !this.isActive;
      let result =await this.$API.home.reqLikeReply({rID:this.reply.rID,like});
      if(result.code ===200){
        this.$toast.success('感谢点赞')
      }

    },
  }
}
</script>

<style scoped>
.active {
  color: #ff0050;
}
.replys {
  padding-top: 10px;
}
.replys .upInfo {
  width: 100%;
}
.replys .upInfo div {
  margin: 0;
  padding: 0;
  display: inline-block;
}
.replys .upInfo .upUser {
  width: 200px;
  font-weight: normal;
}
.replys .upInfo .upUser div {
  width: 200px;
  margin-left: 10px;
  padding: 0;
}
.replys .upInfo .upUser div:nth-child(1) {
  height: 25px;
  font-size: 14px;
}
.replys .upInfo .upUser div:nth-child(2) {
  height: 15px;
  font-size: 12px;
  vertical-align: top;
}
.replys .bottomInfo {
  padding-left: 45px;
  font-size: 16px;
  border-bottom: 1px solid #f4f5f5;
}
</style>

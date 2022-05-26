<template>
  <van-cell-group @click="toDetail" inset style="margin-bottom:10px">
      <van-cell>
        <template>
          <!-- 发帖人信息 -->
          <div style="overflow: hidden;">
            <span class="info">
              <van-image
                round
                lazy-load
                width="50px"
                height="50px"
                :src="topic.user.userAvatarUrl"
              />
            </span>
            <span class="info">
              <div class="nickname">{{topic.user.userNickname}}</div>
              <div class="time">{{this.time}}</div>
            </span>
          </div>
          <!-- 内容框 -->
          <div>
            <h3 class="title">{{topic.tTitle}}</h3>
            <p class="content">{{topic.tContents}}</p>
            <van-image
              radius="5px"
              lazy-load
              width="100%"
              :src="topic.tCoverURL"
            />
          </div>
          <div class="cellfooter">
            <span><van-icon name="chat-o" size="16" /><em>{{topic.tReplyCount==0?'':topic.tReplyCount}}</em></span>
            <span><van-icon name="good-job-o" size="16" /><em>{{topic.tLike==0?'':topic.tLike}}</em></span>
          </div>
        </template>
      </van-cell>
  </van-cell-group>
</template>

<script>
// import PubSub from 'pubsub-js';
import {formatTime} from "@/utils"
export default {
  name:'TopicCell',
  props:['topic'],
  computed:{
    time:function(){
      // console.log(typeof this.topic.tTime)
      return formatTime(this.topic.tTime)
    }
  },
  methods:{
    toDetail(){
      this.topic.time=this.time;
      this.$router.push({
        name:"TopicDetail",
        params:this.topic
      });
    }
  }
}
</script>

<style scoped>
.info{
  padding: 0;
  display:inline-block;
  float: left;
}
.info:nth-child(2){
  margin-left: 20px;
}
.nickname,.time{
  margin: 0;
}
.nickname{
    width: 200px;
    font-size: 18px;
    height: 28px;
    padding-top: 4px;
    /* 超出省略 */
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
  }
.time{
  height: 18px;
  font-size: 12px;
  color: #969799;
}
.title{
  margin: 0;
}
.content{
  margin: 5px 0;
  font-size: 15px;
  /* 超出省略 */
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
}
.cellfooter span{
  display: inline-block;
  width: 50%;
  text-align: center;
  font-size: 15px;
}
.cellfooter span em{
  font-style: normal;
}
</style>

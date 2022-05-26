<template>
  <div>
    <van-nav-bar
      fixed
      title="系统公告"
      placeholder
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <!-- 内容部分 -->
    <div class="content">
      <h1 style="margin:0;padding:20px 0">{{item.aTitle}}</h1>
            <span style="">发布时间：{{item.aTime}}</span>
            <hr>
            <div class="innerstyle">
                <p>{{item.aContents}}</p>
                <span class="count">阅读量：{{item.aClickCount}}</span>
            </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'Announcement',
  mounted(){
    // 获取主页面传递的数据
    this.item = this.$route.params.announcement;
  },
  data() {
    return {
      item:''
    }
  },
  methods:{
     // 顶部左侧导航
    onClickLeft() {
      this.$router.go(-1);
      // Toast('返回');
    },
  }
}
</script>

<style scoped>
.content{
  text-align: center;
  padding:0 10px 100px 10px;
  width: 355px;
  background-color: #fff;
}
.contents{
  white-space: pre-line;
  font-style: 20px;
}
span {
    font-size: 12px;
  }
  .count{
    display:block;
    float:right;
    padding:40px 0 0 0;
  }
  .innerstyle{
    text-align:left;
    width:90%;
    margin:0 auto;
  }
  .innerstyle p{
    white-space: pre-wrap;
    font-size: 16px;
    color: black;
  }
</style>

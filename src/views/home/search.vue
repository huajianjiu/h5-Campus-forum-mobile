<template>
  <div class="page">
    <!-- 粘性布局 -->
    <van-sticky>
      <van-search
        autofocus
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </van-sticky>
    <div  style="width: 90%;margin: 0 auto;">
      <div style="margin-top:20px">
        <span style="font-size: 18px;font-weight: bold;font-family: '黑体';">搜索历史</span>
        <van-icon style="margin-left:230px" size="18px" name="delete" @click="deleteHistory" />
      </div>
      <div style="margin:10px 0">
        <div class="tag">今日新闻</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name:'Search',
  methods:{
    onCancel(){
      // 回到首页
      this.$router.replace("/home")
    },
    onSearch(){
      this.$toast('该功能还在开发中哦')
    },
    //
    deleteHistory() {
      this.$dialog.confirm({
        confirmButtonColor:"#7558fe",
        message: '确定删除全部历史记录吗？',
      })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
    }
  }
}
</script>

<style scoped>
.tag{
  position: relative;
  position: absolute;
  display: inline-block;
  margin: 0 10px 0 0;
  background-color: #eae8e8;
  border: none;
  padding: 2px 10px;
  border-radius: 14px;
  max-width:96px;
  font-size:14px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>

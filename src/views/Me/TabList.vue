<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      title="我的帖子"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 列表 -->
    <topic-list/>
  </div>
</template>

<script>
export default {
  name:'TabList',
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>

</style>

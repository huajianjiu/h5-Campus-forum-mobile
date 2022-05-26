<template>
  <div>
    <van-tabs v-model="active" color="#7558fe" style="height:80vh" sticky :offset-top="44">
        <van-tab title="我的帖子">
          <van-list
              style="height:400px;margin-top:10px;"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad(userInfo.uID)"
              error-text="请求失败，点击重新加载"
            >
            <!-- 帖子项 -->
              <TopicCell v-for="item in list" :key="item.tID" :topic="item"></TopicCell>
            </van-list>
        </van-tab>
        <!-- 占位 -->
        <van-tab title="" disabled></van-tab>
        <van-tab title="" disabled></van-tab>
        <van-tab title="" disabled></van-tab>
      </van-tabs>
    <!-- 帖子列表 -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name:'TopicList',
  data() {
    return {
      list: [],
      error: false,//加载失败
      loading: false,//tab加载中
      finished: false,//获取数据已完成
      page:1,
      limit:5,
      total:0,
      active:0,
    }
  },
  mounted(){
    this.onLoad(this.userInfo.uID)
  },
   computed:{
    ...mapGetters(['userInfo']),
  },
  methods:{
    // 获取列表数据方法
    async getList(ID) {
      // this.list=[]
      let res= await this.$API.home.reqTopicList({
         page: this.page,
          limit: this.limit,
          sID:'',//板块id
          uID:ID
      })
      this.refreshing=false;
      if (res.data.length === 0) {  		// 判断获取数据条数若等于0
        this.list = [];				// 清空数组
        this.finished = true;		// 停止加载
      }
      // 若数据条数不等于0
      this.total = res.data.count;		// 给数据条数赋值
      this.list.push(...res.data.rows)	// 将数据放入list中
      this.loading = false;			// 加载状态结束
      // 如果list长度大于等于总数据条数,数据全部加载完成
      if (this.list.length >= res.data.count) {
          this.finished = true;		// 结束加载状态
          // this.loading=false;
      }
    },
	// 被 @load调用的方法
    onLoad(ID) { // 若加载条到了底部
        this.getList(ID);					// 调用上面方法,请求数据
        this.page++;					// 分页数加一
    },
  }
}
</script>

<style scoped>

</style>

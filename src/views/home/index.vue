<!-- home -->
<template>
  <div class="index-container">
    <!-- 粘性布局 -->
    <van-sticky>
      <!-- 搜索框 -->
      <van-search
      style="height:54px"
        show-action
        placeholder="请输入搜索关键词"
        @focus="toSearch"
      >
      <!-- 发帖按钮 -->
      <!-- 点击下拉 -->
        <template #action>
           <van-popover v-model="showPopover" trigger="click" @select="toEditTopic" placement="bottom-end" :actions="actions">
             <template #reference>
                <van-button size="small" style="margin-bottom:3px" icon="edit" round color="#7558fe">发布</van-button>
             </template>
           </van-popover>
        </template>
      </van-search>
    </van-sticky>
    <!-- tab栏 -->
    <van-tabs offset-top="54" @change="changeTab" sticky color="#7558fe" v-model="active" swipeable animated>
        <van-empty v-if="network" image="network" style="margin:0 auto" image-size="375" description="网络连接失败，请检查网络" />
      <van-tab  v-for="(section) in sectionList" :key="section.sID" :name="section.sID" :title="section.sName">
        <!-- 下拉刷新组件min-height:80vh -->
          <van-pull-refresh style="min-height:80vh" v-model="refreshing" @refresh="onRefresh(section.sID)">
            <!-- 公告栏 -->
            <van-notice-bar
              v-if="!announcement==''"
              @click="toAnnouncement"
              left-icon="volume-o"
              :text="announcement.aTitle+'  '+announcement.aContents"
            />
            <!-- 帖子列表 -->
            <van-list
              style="margin-top:10px"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad(section.sID)"
              error-text="请求失败，点击重新加载"
            >
            <!-- 帖子项 -->
              <TopicCell v-for="item in list" :key="item.tID" :topic="item"></TopicCell>
            </van-list>
          </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      sectionList:[],
      // tab默认项
      active:0,
      // 列表相关
      list: [],
      error: false,//加载失败
      loading: false,//tab加载中
      finished: false,//获取数据已完成
      refreshing:false,//是否刷新状态
      page:1,
      limit:5,
      total:0,
      // 发布按钮下拉框
      showPopover: false,
      actions: [
        { text: '发帖', icon: 'add-o' },
      ],
      // 公告信息
      announcement:'',
      network:false
    }
  },
  mounted(){
    // 获取板块列表
    this.getSectionList();
    // 获取公告信息

    this.getAnnouncement();
  },
    computed:{
    ...mapGetters(['userInfo']),
  },
  methods: {
    // 获取板块信息列表
    async getSectionList(){
      try {
        let result = await this.$API.home.reqSectionList();
      if(result.code==200){
        this.sectionList=result.data;
      }
      } catch (error) {
        this.network=true;
      }

    },
    // 获取公告信息
    async getAnnouncement(){
      let result=await this.$API.home.reqAnnouncement();
      if (result.code == 200) {
        this.announcement=result.data;
      }
    },
    // 点击搜索回调
    toSearch(){
      // 跳转到搜索页
      this.$router.push('/search')
    },
    // 获取列表数据方法
    async getList(sID) {
      let res= await this.$API.home.reqTopicList({
          page: this.page,
          limit: this.limit,
          sID,//板块id
          uID:''
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
    onLoad(sID) { // 若加载条到了底部
        this.getList(sID);					// 调用上面方法,请求数据
        this.page++;					// 分页数加一
        // this.finished;
    },
	// 加载失败调用方法
    onRefresh(sID) {
      this.finished = false; 		// 清空列表数据
      this.loading = true; 			// 将 loading 设置为 true，表示处于加载状态
      this.page = 1;				// 分页数赋值为1
      this.list = [];			// 清空数组
      this.onLoad(sID); 				// 重新加载数据
    },
    // 发帖
    toEditTopic(){
      if(this.userInfo.uID){
        // 跳转到编辑页，并将板块信息传过去
        this.$router.push({
          name:'EditTopic',
          params:{sectionList:this.sectionList}
        });
      }else{
        this.$dialog.confirm({
          confirmButtonText:'去登录',
          message: '必须先登录才能访问该部分内容',
        })
        .then(() => {
          this.$router.push('/edittopic');
        })
        .catch(()=>{

        })
      }
    },
    // 切换tab事件
    changeTab(name){
      this.loading=true;
      this.onRefresh(name);
    },
    // 查看公告
    toAnnouncement(){
      this.$router.push({
        name:'Announcement',
        params:{
          announcement:this.announcement
        }
      });
    }
  }
}
</script>
<style  scoped>
.index-container {
  width: 100%;
  padding: 0;
  background-color: #f5f5f5;
}
.index-container .inner{
  width: 100%;
  height: 40px;
  margin: 0 5px;
}
.search .search_a{
  width: 85%;
  position: absolute;
  left: 70px;
}
</style>

<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-popover
          v-show="userInfo.uID==topicInfo.user.uID"
          v-model="showPopover"
          trigger="click"
          @select="toDeleteTopic"
          placement="bottom-end"
          :actions="actions"
        >
          <template #reference>
            <van-button
              style="border:none;color:#000;font-size:25px"
              size="normal"
              class="iconfont"
            >&#xe710;</van-button>
          </template>
        </van-popover>
      </template>
    </van-nav-bar>
    <!-- 内容部分 -->
    <div class="content">
      <!-- 标题 -->
      <h1 style="margin-top:0;padding-top:16px">{{topicInfo.tTitle}}</h1>
      <!-- 个人信息 -->
      <div style="overflow: hidden;">
        <span class="info">
          <van-image
            @click="showBigImg"
            round
            lazy-load
            width="40px"
            height="40px"
            :src="topicInfo.user.userAvatarUrl"
          />
        </span>
        <span class="info">
          <div class="nickname">{{topicInfo.user.userNickname}}</div>
          <div class="time">{{topicInfo.time}}</div>
        </span>
      </div>
      <!-- 内容 -->
      <div>
        <p
          class="contents"
          style="font-size:14px"
        >
          {{topicInfo.tContents}}
        </p>
        <van-image
          style="margin-top:5px"
          v-for="(item, index) in imgList"
          :key="index"
          @click="viewImage(index)"
          radius="5px"
          lazy-load
          width="100%"
          :src="item"
        />
      </div>
    </div>
    <!-- 底部评论 -->
    <div
      class="reply"
    >
      <div class="title">全部回复</div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad()"
      >
        <!-- 用户评论 -->
        <user-reply v-for="reply in list" :key="reply.rID" :reply="reply"></user-reply>
      </van-list>
    </div>
    <!-- 底部评论框 -->
    <div class="footer">
      <div style="display:inline-block;width:60%">
        <van-field
          class="rinput"
          v-model="message"
          type="text"
          maxlength="50"
          placeholder="发条友善的评论"
        >
          <template #left-icon>
            <van-image
              round
              width="25px"
              height="25px"
              :src="userInfo.userAvatarUrl"
            />
          </template>
        </van-field>
      </div>
      <van-icon
        :badge="topicInfo.tLike"
        @click="toLike"
        :class="{'active':isActive,'like':true} "
        name="good-job"
      ></van-icon>
      <van-button
      @click="sendReply"
        round
        color="#7558fe"
        size="small"
        style="float:right;width:60px;margin:1px 20px 0 0"
      >发送</van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ImagePreview, Dialog, Toast } from "vant";
import UserReply from './UserReply.vue';
export default {
  components: { UserReply },
  name: 'TopicDetail',
  mounted(){
    this.topicInfo=this.$route.params;
    this.getImgList();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    $route: {
      deep: true,
      // eslint-disable-next-line no-unused-vars
      handler(newVal, oldVal) {
        this.topicInfo = this.$route.params;
        if (this.topicInfo.tID) {
          this.getImgList();
          this.page=1;
          this.list=[];
          this.onLoad();
        }

      },
      immediate: true
    },
  },
  data() {
    return {
      // 帖子数据
      topicInfo: {
      },
      // 更多按钮下拉框
      showPopover: false,
      actions: [
        { text: '删除帖子', icon: 'cross' },
      ],
      message: '',
      // 点赞
      isActive: false,
      likes: 10,
      imgList: [],
      // 评论区
      list: [],
      loading: false,
      finished: false,
      page:1,
      limit:10,
      total:0
    }
  },
  methods: {
    // 获取图片列表
    async getImgList() {
      let result = await this.$API.home.reqImgList({ tID: this.topicInfo.tID })
      if (result.code == 200) {
        let data = result.data.map(a => a.imgURL);
        this.imgList = data;
      }
    },
    // 删除帖子
    toDeleteTopic() {
      // 确认弹框
      Dialog.confirm({
        message: '确认删除这条帖子吗？',
        confirmButtonColor: "#7558fe"
      })
        .then(async() => {
          // on confirm
          let result = await this.$API.home.reqDeleteTopic({tID:this.topicInfo.tID})
          if (result.code == 200) {
            Toast.success('删除成功');
            this.$router.go(-1);
          }else {
            Toast.fail('删除失败');
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    // 顶部左侧导航
    onClickLeft() {
      this.$router.go(-1);
      // Toast('返回');
    },
    // 点赞
    async toLike() {
      let like;
      if(this.isActive){
        this.topicInfo.tLike--;
        like=-1;
      }else {
        this.topicInfo.tLike++;
        like=1;
      }
      this.isActive = !this.isActive;
      let result =await this.$API.home.reqLikeTopic({tID:this.topicInfo.tID,like});
      if(result.code ===200){
        this.$toast.success('感谢点赞')
      }

    },
    // 图片查看
    viewImage(index) {
      ImagePreview({
        images: this.imgList,
        startPosition: index,
      })
    },
    // 获取评论列表数据方法
    async getList() {
      // this.list=[]
      let res= await this.$API.home.reqReplyList({
         page: this.page,
          limit: this.limit,
          tID:this.topicInfo.tID
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
    onLoad() { // 若加载条到了底部
        this.getList();					// 调用上面方法,请求数据
        this.page++;					// 分页数加一
    },
    // 发送评论
    async sendReply(){
      if(!this.userInfo.uID){
          this.$dialog.confirm({
            confirmButtonText:'去登录',
            message: '必须先登录才能评论',
          })
          .then(() => {
            this.$router.push('/login')
          })
          .catch(()=>{
            this.message='';
          })
        }else{
          if(this.message.trim()!=''){
            let data = {topicPID:this.topicInfo.tID,userUID:this.userInfo.uID,rContents:this.message}
            // console.log(data);
            let result = await this.$API.home.reqSendReply(data)
            if(result.code==200){
              this.message='';
              this.page=1;
              this.list = []
              this.onLoad();
              this.$toast.success('评论成功')
            }else {
              this.$toast.fail('发送失败，请重试')
            }
          }

        }
    },
    // 查看头像大图
    // 头像查看
    showBigImg(){
          ImagePreview({
          images: [
            this.topicInfo.user.userAvatarUrl
          ],
        startPosition: 0,
      });
    }
  },

}
</script>

<style scoped>
.van-info {
  border: none;
  background-color: rgba(0, 0, 0, 0);
  color: #000;
}
.content,
.reply {
  padding: 0 10px 20px 10px;
  width: 355px;
  background-color: #fff;
}
.footer {
  z-index: 1000;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding: 8px 0;
  border-top: 1px solid #f4f5f5;
}
.footer .rinput {
  height: 34px;
  padding: 5px 10px 0 10px;
  width: 100%;
  border-radius: 20px;
  margin-left: 10px;
  background-color: #f4f5f5;
}
.like {
  display: inline-block;
  margin: 4px 15px 0 0;
  float: right;
  color: #cccccc;
  margin-top: 2px;
  font-size: 25px;
}
.active {
  color: #ff0050;
}
/* 发帖人信息 */
.info {
  padding: 0;
  display: inline-block;
  float: left;
}
.info:nth-child(2) {
  margin-left: 20px;
}
.nickname,
.time {
  margin: 0;
}
.nickname {
  width: 200px;
  font-size: 14px;
  height: 20px;
  padding-top: 2px;
  /* 超出省略 */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.time {
  height: 16px;
  font-size: 11px;
  color: #969799;
}
.contents {
  white-space: pre-line;
  font-style: 20px;
}
.reply {
  margin-top: 10px;
  padding-bottom: 50px;
}
.reply .title {
  padding: 10px 0;
  font-weight: bold;
  font-size: 14px;
}
</style>

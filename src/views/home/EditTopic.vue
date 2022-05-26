<template>
<!-- 编辑发布帖子 -->
  <div>
    <van-nav-bar
      fixed
      placeholder
      title="编辑帖子"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <van-cell style="margin:5px 0 0 0;padding-bottom:50px">
      <!-- 使用 title 插槽来自定义标题 -->
      <template >
       <van-form @submit="onSubmit">
          <van-field
          v-model="topicForm.tTitle"
            name="tTitle"
            placeholder="请输入完整帖子标题（5-31个字）"
            :rules="[{ required: true, message: '请输入标题' },{validator,message:'字数必须在5-31'}]"
          />
          <van-field
          v-model="topicForm.tContents"
            name="tContents"
            rows="5"
            autosize
            type="textarea"
            maxlength="500"
            placeholder="来吧，尽情发挥吧..."
            show-word-limit
          />
          <van-field name="uploader" placeholder="最多选择6张">
            <template #input>
              <van-uploader v-model="fileList"
                :max-count="6"
                multiple
                :before-read="beforeRead"
                :after-read="afterRead"
                :before-delete="delUploadImg"
                upload-icon="plus" />
            </template>
          </van-field>
          <van-field
            readonly
            clickable
            label="所属板块"
            colon
            name="picker"
            v-model="section"
            placeholder="点击选择板块"
            @click="showPicker = true"
            :rules="[{ required: true, message: '请选择板块' }]"
          />
          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
          <div style="margin: 20px;">
            <van-button round block type="info" native-type="submit">发布</van-button>
          </div>
        </van-form>
      </template>
    </van-cell>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name:'editTpic',
  data() {
    return {
      // 上传返回图片地址
      fileList:[],
      section:'',
      // columns: ['学习', '游戏', '寻物','日常', '二手物品' ],
      showPicker: false,
      // 板块数据
      sectionList:[],
      topicForm:{
        userUID:'',
        tTitle:'',
        tContents:'',
        tCoverURL:'',
        sectionSID:''
      },
      imgList: []
    }
  },
  mounted() {
    this.sectionList=this.$route.params.sectionList;
    this.topicForm.userUID=this.userInfo.uID;
  },
  computed:{
    ...mapGetters(['userInfo']),
    // 处理板块数据
    columns:function(){
      return this.sectionList.map((v)=>{
        return v.sName
      })
    }
  },
  methods: {
    // 校验数据
    validator(value){
      if(value.length>=5&&value.length<=31){
        return true
      }
      return false
    },
    // 顶部左侧导航
    onClickLeft() {
      this.$router.go(-1);
      // Toast('返回');
    },
    // 发送帖子
     async onSubmit(){
      if(this.imgList.length>0){
        this.topicForm.tCoverURL=this.imgList[0]
      }
      const {topicForm,imgList}=this;
      let result = await this.$API.home.reqPostTopic({topicForm,imgList})
      if(result.code==200){
        this.$toast.success('发送成功')
        this.$router.go(-1);
      }else {
        this.$toast.fail('发送失败，请重启软件')
      }
    },
    // 板块选择器
    onConfirm(value) {
      // 获取板块ID
      this.section=value
      let list=JSON.parse(JSON.stringify(this.sectionList))
      for (var i=0;i<list.length; i++) {

        if (list[i].sName==value) {
          this.topicForm.sectionSID=list[i].sID
          break;
        }
      }
      this.showPicker = false;
    },
    // 返回布尔值
    beforeRead(file) {
      if (file instanceof Array) {
        if(file.length>6){
          this.$toast.fail('最多上传6张图片')
          return false
        }
        //判断是否是数组
        let t =0;
        file.forEach((v) => {
          if(!this.checkFile(v)){
            t++;
          }
        });
        if (t!=0)return false
      } else {
        return this.checkFile(file);
      }
      return true;
    },
    //图片类型检查
    checkFile(file) {
      const format = ["jpg", "png", "jpeg"];
      const index = file.name.lastIndexOf(".");
      const finalName = file.name.substr(index + 1);
      if (!format.includes(finalName.toLowerCase())) {
        this.$toast("请上传" + format.join(",") + "格式图片");
        return false;
      }
      return true
    },
    afterRead(file) {
    // 此时可以自行将文件上传至服务器
      if (file instanceof Array) {
        file.map((v) => {
          v.status = "uploading";
          v.message = "上传中...";
          this.uploadImg(v);
        });
      } else {
        file.status = "uploading";
        file.message = "上传中...";
        this.uploadImg(file);
      }
    },
    //上传
    async uploadImg(file) {
      const formData = new FormData();
      formData.append("pictures", file.file);
      try {
        let result = await this.$API.home.uploadPictures(formData);
        if(result.code === 200){
          if (result.data) {
            // console.log(result.data[0])
            if (file instanceof Array) {
              //判断是否是数组
              file.map((v, i) => {
                v.status = "success";
                v.message = "";
                v.url = result.data[i];
              });
            } else {
              this.imgList.push(result.data[0])
              file.status = "success";
              file.message = "";
              file.url = result.data[0];
            }
          }
        }
      } catch (error) {
        this.$notify({
            type: "warning",
            message: "上传失败",
          });
      }
    },
    //删除
    delUploadImg(item) {
      this.fileList = this.fileList.filter((v) => v.url != item.url);
    }
  },
}
</script>

<style scoped>

</style>

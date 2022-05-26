<template>
  <div class="height100">
    <van-nav-bar
      fixed
      placeholder
      title="编辑资料"
      :left-arrow="showLeft"
      right-text="保存"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="avatarsection">

      <div class="outer">

        <div class="innerbox">

          <van-image
            round
            width="60px"
            height="60px"
            :src="userForm.userAvatarUrl"
          />

        </div>
        <div class="zhezhao">
          <van-uploader
            :max-size="3 * 1024 * 1024"
            :before-read="beforeRead"
            @oversize="onOversize"
          >
            <span

              class="iconfont"
              style="font-size: 20px;display:inline-block;width:60px;height:60px"
            >&#xe663;</span>
          </van-uploader>
        </div>
      </div>

      <div style="text-align:center;font-size:14px;padding-top:10px">点击更换头像</div>
    </div>
    <!-- 表单 -->
    <van-cell-group>
      <van-cell
        @click="showTextarea(1)"
        is-link
        title="昵称"
        v-model="userForm.userNickname"
      />
      <van-cell title="性别">
        <van-radio-group style="float:right" checked-color="#7558fe" v-model="userForm.userGender" direction="horizontal">
          <van-radio name="男">男</van-radio>
          <van-radio name="女">女</van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell is-link title="生日" v-model="userForm.userBirthday" @click="showPopup" />
      <van-popup position="bottom" round v-model="show">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="show=false"
          @confirm="getBirthday"
        />
      </van-popup>
      <van-cell
        @click="showTextarea(2)"
        is-link
        title="简介"
        v-model="userForm.userStatement"
      />
      <!-- <van-cell is-link title="邮箱" value="1667698770@qq.com" /> -->
    </van-cell-group>
    <!-- 编辑弹窗 -->
    <van-field
      id="edit"
        @blur="fieldEvent"
        v-show="isShow"
        style="position:fixed;z-index:1000;bottom:0"
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        :maxlength="maxlength"
        placeholder="请输入要修改的内容"
        show-word-limit
    >
        <template #button>
        <van-button size="small" type="primary">完成</van-button>
      </template>
    </van-field>
    <!-- 剪切图片窗口 -->
    <van-popup
      class="bg-tran"
      v-model="showCropper"
      closeable
      position="top"
      :style="{ height: '100%' }"
    >
      <div class="flex-column-center height100">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :full="option.full"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox"
          :high="option.high"
          :mode="option.mode"
        ></vueCropper>
        <div class="popup_bottom">
          <div class="bottom_item"><span @click="cancelCropper">取消</span></div>
          <div class="bottom_item"><span
              @click="rotateImage"
              class="font18"
            >
              <van-icon name="replay" />
            </span></div>
          <div class="bottom_item"><span @click="getCropBlob">确定</span></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs"
import {mapGetters} from 'vuex'
import { VueCropper } from 'vue-cropper'
// import { changeAvatar } from '@/api/user'
export default {
  name: 'EditInfo',
  async mounted(){
    // 获取用户数据
    this.getUserInfo();
    this.userForm={...this.userInfo};
    if(this.userInfo.userNickname==null){
        this.showLeft=false
      }
  },

  data() {
    return {
      // 存储上级路由
      name:'',
      // 用户信息表单
      userForm:{
        uID:'',
        userAvatarUrl:"",
        userBirthday:"",
        userGender:"",
        userName:"",
        userNickname:"",
        userStatement:null,
      },


      showCropper: false, // 截图弹窗遮罩默认隐藏
      imageAccept: "/jpg,/png,/jpeg",
      imageFileName: '',
      option: {
        img: '',
        outputSize: 0.8,
        info: false, // 裁剪框的大小信息
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: window.innerWidth - 100 + 'px', // 默认生成截图框宽度
        autoCropHeight: window.innerWidth - 100 + 'px', // 默认生成截图框高度
        high: true, // 是否按照设备的dpr 输出等比例图片
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        mode: '100% auto', // 图片默认渲染方式
      },
      //页面数据
      isChecked: true,
      isChecked1: false,
      message: '',
      isShow: false,
      date:'',
      show:false,
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(),
      // currentDate: new Date(),
      // 输入框字数显示
      maxlength:'',
      editting:'',
      // 是否展示左箭头
      showLeft:true,
    }
  },
  components: {
    VueCropper
  },
  computed:{
    ...mapGetters(['userInfo']),
    currentDate:{
      get(){
        return dayjs(this.userInfo.userBirthday).$d
      },
      set(v){
        dayjs(this.userInfo.userBirthday).$d=v;
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // this.name=from.name;
    next((vm)=>{
      vm.name=from.name
    })
  },
  methods: {
    // 点击左箭头
    onClickLeft() {
      this.$router.go(-1);
    },
    // 获取用户信息
    async getUserInfo(){
      await this.$store.dispatch('user/getInfo');
    },
    // 上传文件过大
    onOversize() {
      this.$toast('图片不能大于3M');
    },

    // 获取文件后缀
    getFileSuffix(fileName) {
      return fileName.match(/\/\w+$/)[0].toLowerCase();
    },

    // 选择图片上传前操作，调起剪裁组件
    beforeRead(file) {
      if (!this.imageAccept.includes(this.getFileSuffix(file.type))) {
        return this.$toast('请上传 jpg/png 格式图片');
      }
      this.showCropper = true;
      this.imageFileName = file.name;
      // 本地图片转成base64，用于截图框显示本地图片
      this.imageToBase64(file);
    },
    // 将本地图片转化为Base64，否则vue-cropper组件显示不出要本地需要剪裁的图片
    imageToBase64(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // 截图框中的图片
        this.option.img = reader.result;
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },

    // 确认剪裁并上传图片
    async getCropBlob() {
      this.$toast('上传中', 0);
      let formData = new FormData();
      this.$refs.cropper.getCropBlob((data) => {
        formData.append('avatar', data, this.imageFileName);
        // formData私有类对象，访问不到，可以通过get判断值是否传进去
        // 上传图片至服务器
        this.$API.user.changeAvatar(formData)
          .then(res => {
            if (res.code === 200) {
              this.showCropper=false;
              this.userForm.userAvatarUrl=res.data.url;
              this.$toast('更改头像成功');
            } else {
              this.showCropper=false;
              this.$toast('上传失败');
            }
          })
          .catch(err => console.error(err));
      })
    },

    // 旋转图片
    rotateImage() {
      this.$refs.cropper.rotateRight();
    },

    // 取消截图上传头像
    cancelCropper() {
      this.showCropper = false; // 隐藏切图遮罩
      this.showPopup = true;
    },


    // 点击编辑
    showTextarea(num) {
      setTimeout(() => {
        document.getElementById('edit').focus();
      }, 0)
        this.editting=num
      if(num==1){
        this.message=this.userForm.userNickname;
        this.maxlength=20;
      }else{
        this.message=this.userForm.userStatement
        this.maxlength=100;
      }
      this.isShow = true;
    },
    // 失去焦点
    fieldEvent(){
      if(this.editting==1){
        // if(this.message.trim()==''){
          this.userForm.userNickname=this.message;
        // }
      }else{
        this.userForm.userStatement=this.message;
      }
      this.isShow=false;
    },
    // 选择生日组件
    showPopup() {
      this.show = true;
    },
    // 获取日期选择器时间
    getBirthday(value){
      // 格式化时间
      this.userForm.userBirthday=dayjs(value).locale('zh-cn').format('YYYY-MM-DD');
      this.show = false;
    },
    // 保存
    async onClickRight(){
      if(this.userForm.userAvatarUrl==null||this.userForm.userAvatarUrl==''){
        this.$toast('请上传头像');
        return
      }else if(this.userForm.userNickname==null||this.userForm.userNickname==''){
        this.$toast('昵称不能为空');
        return
      }else if(this.userForm.userGender==null||this.userForm.userGender==''){
        this.$toast('请选择性别');
        return
      }else if(this.userForm.userBirthday==null||this.userForm.userBirthday==''){
        this.$toast('请选择生日');
        return
      }else{
        let result=await this.$API.user.reqEditInfo(this.userForm);
        if(result.code==200){
          this.$toast.success('编辑成功');
          this.getUserInfo();
          // console.log(this.$router)
          if(this.name=="Register"){
            this.$router.replace({ path: this.$route.query.redirect || '/' })
          }else {
            this.$router.go(-1);
          }
        }
      }
    }

  }
}
</script>


<style scoped>
.active {
  background-color: #7558fe;
  color: white;
}
.avatarsection {
  width: 100%;
  /* background-color: pink; */
  padding: 20px 0;
}
.avatarsection .outer {
  position: relative;
}
.avatarsection .outer .innerbox {
  margin: 0 157.5px;
}
.avatarsection .outer .zhezhao {
  position: absolute;
  display: inline-block;
  top: 0;
  width: 62px;
  height: 62px;
  margin: 0 157.5px;
  border-radius: 31px;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  line-height: 60px;
  color: white;
}
</style>
<style lang="scss" scoped>
.height100 {
  height: 100vh;
}

.flex-column-center {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.vue-cropper {
  background: #000;
  .cropper-view-box {
    outline: 1px solid #fff !important;
    outline-color: #fff !important;
  }
}
.popup_bottom {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  .bottom_item {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

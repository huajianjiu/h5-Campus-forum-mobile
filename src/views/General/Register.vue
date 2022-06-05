<template>
  <div style="height:100vh;background-color:#fff">
    <van-nav-bar
      fixed
      placeholder
      title="用户注册"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="middle">
      <div><img width="50px" height="50px" src="@/assets/icon.png" alt=""></div>

          <span class="name">校园论坛注册</span>
    </div>
    <van-cell-group inset :border="false">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="账号"
          placeholder="填写邮箱"
          :rules="[{ required: true, message: '请输入账号' },{ pattern, message: '请输入合法邮箱地址' },{ validator: asyncValidator, message: '账号已注册，请直接登录' }]"
        />

        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="包括数字、字母，8-15位"
          :rules="[{ required: true, message: '请设置密码' },{ pattern:patternPwd,message:'密码必须包括数字、字母两种字符，特殊字符可有可无，长度在8-15位之间'}]"
        />
        <van-field
          v-model="password1"
          type="password"
          name="password1"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[{ validator, message: '两次密码不一致' }]"
        />
        <van-field
            v-model="code"
            center
            clearable
            label="邮箱验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button v-if="notSend" size="small" :disabled="canUse" native-type="button" type="primary" @click="getCode">获取验证码</van-button>
              <van-button v-else size="small" disabled type="primary">重新发送{{count}}S</van-button>
            </template>
          </van-field>
        <div style="margin: 20px;">
          <van-button round block type="info" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name:'Register',
  data() {
    return {
      notSend:true,
      username: '',
      password: '',
      password1:'',
      code:'',
      canUse:true,
      count:60,
      // 校验正则
      // pattern:/^((\+|00)86)?1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/,//手机号
      pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      patternPwd:/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9A-Za-z~!@#$%^&*._?]{8,15}$/,//校验密码
      // 加载
      toastShow:0,
    };
  },
  methods: {
    // 校验两次输入密码
    validator(val){
      if(this.password==val)return true
      else return false
    },
    // 校验账号是否存在
    async asyncValidator(){
      let result = await this.$API.user.reqvalidator({username:this.username});
      if(result.code ==200){this.canUse=false; return true}
      else {this.canUse=true;return false}
    },
    // 获取邮箱验证码
    async getCode(){
      this.$toast.loading({
          message: '获取中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration:this.toastShow
        });
      let result = await this.$API.user.reqGetCode({email:this.username});
      if(result.code==200){
        this.getCode_Interval()
        this.toastShow=1;
        this.$notify({ type: 'success', message: '验证码已发送到您的邮箱' });
        this.notSend=false;
      }else{
        this.toastShow=1;
        this.$notify({ type: 'danger', message: '验证码发送失败，请重试' });
      }
    },
    // 倒计时
    getCode_Interval(second=59){
      const COUNT_TIME=second;
      let timer=null;
      if(!timer){
        this.count=COUNT_TIME;
        timer=setInterval(()=>{
          if(this.count>1&&this.count<=COUNT_TIME){
            this.count--;
          }else{
            clearInterval(timer);
            this.notSend=true;
          }
        },1000)
      }
    },
    // 校验验证码
    async checkCode(){
      let result = await this.$API.user.reqCheckCode({email:this.username,code:this.code})
      if(result.code===200){
        return true;
      }else{
        this.$notify({ type: 'warning', message: result.message });
        return false;
      }
    },
    async onSubmit(values) {
      try{
        this.$toast.loading({
          message: '注册中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration:this.toastShow
        });
        if(this.checkCode()){
          await this.$store.dispatch('user/register',values);
          this.toastShow=1;
          // 去编辑信息
          this.$router.replace('/editinfo');
        }
      }catch(err){
        this.toastShow=1;
        this.$notify({ type: 'danger', message: err.message })
      }
    },
  },
}
</script>

<style scoped>
  .middle{
    width: 375px;
    text-align: center;
    margin: 40px 0 30px 0;

  }
  .name{
    display: inline-block;
    margin:20px 0;
    font-size: 20px;
  }
</style>

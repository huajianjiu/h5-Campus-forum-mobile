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
          label="用户名"
          placeholder="填写手机号"
          :rules="[{ required: true, message: '请输入账号' },{ pattern, message: '请输入正确手机号' },{ validator: asyncValidator, message: '账号已注册，请直接登录' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请设置密码' },{ pattern:patternPwd,message:'以字母开头，长度在6~18之间，只能包含字母、数字和下划线'}]"
        />
        <van-field
          v-model="password1"
          type="password"
          name="password1"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[{ validator, message: '两次密码不一致' }]"
        />
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
      username: '',
      password: '',
      password1:'',
      // 校验正则
      pattern:/^((\+|00)86)?1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/,//手机号
      patternPwd:/^[a-zA-Z]\w{5,17}$/,//校验密码

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
      if(result.code ==200)return true;
      else return false
    },
    async onSubmit(values) {
      try{
        this.$toast.loading({
          message: '注册中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration:this.toastShow
        });
        await this.$store.dispatch('user/register',values);
        this.toastShow=1;
        // 去编辑信息
        this.$router.replace('/editinfo');
      }catch(err){
        this.toastShow=1;
        this.$toast.fail({
          message: err.message,
        });
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

<template>
  <div style="height:100vh;background-color:#fff">
    <van-nav-bar
      fixed
      :border="false"
      placeholder
      title="用户登录"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="middle">
      <div><img width="50px" height="50px" src="@/assets/icon.png" alt=""></div>

          <span class="name">校园论坛登录</span>
    </div>
    <van-cell-group inset :border="false">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="账号"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 20px;">
          <van-button round block type="info" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </van-cell-group>
    <div style="text-align:center;">
      <router-link to="/register">
        没有账号？去注册<span class="iconfont">&#xe68d;</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      username: '',
      password: '',
      // 记载中
      toastShow:0
    };
  },
  methods: {
    async onSubmit(values) {
      try{
        this.$toast.loading({
          message: '登录中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration:this.toastShow
        });
        await this.$store.dispatch('user/login',values);
        this.toastShow=1;
        this.$router.replace({ path: this.$route.query.redirect || '/' })
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

<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      title="修改密码"
      left-arrow
      @click-left="onClickLeft"
    />
      <van-form @submit="onSubmit">
        <van-field
          v-model="oldPassword"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入旧密码"
          :rules="[{ required: true, message: '请输入旧密码' }]"
        />
        <van-field
          v-model="newPassword"
          type="password"
          name="newPassword"
          label="新密码"
          placeholder="包括数字、字母，8-15位"
          :rules="[{ required: true, message: '请设置密码' },{ pattern:patternPwd,message:'密码必须包括数字、字母两种字符，特殊字符可有可无，长度在8-15位之间'}]"
        />
        <van-field
          v-model="newPassword1"
          type="password"
          name="newPassword1"
          label="确认新密码"
          placeholder="再次输入密码"
          :rules="[{ validator, message: '两次密码不一致' }]"
        />
        <div style="margin: 20px;">
          <van-button round block type="info" native-type="submit">确定</van-button>
        </div>
      </van-form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name:'EditPwd',
  data() {
    return {
      oldPassword:'',
      newPassword:'',
      newPassword1:'',
      patternPwd:/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9A-Za-z~!@#$%^&*._?]{8,15}$/,//校验密码

    }
  },
  computed:{
    ...mapGetters(['userInfo']),
  },
  methods:{
    // 点击左箭头
    onClickLeft() {
      this.$router.go(-1);
    },
    // 校验两次输入密码
    validator(val){
      if(this.newPassword==val)return true
      else return false
    },
    // 提交表单
    async onSubmit(){
      let form={
        userName:this.userInfo.userName,
        oldPassword:this.oldPassword,
        userPassword:this.newPassword
      }
      let result = await this.$API.user.reqEditPassword(form);
      if(result.code==200){
        this.$dialog.alert({
          message: '密码修改成功，请重新登录',
        }).then(async() => {
          this.$store.dispatch('user/logout');
          this.$router.push({path:'/',params:{
            isShow:true
      }})
        });
      }else{
        this.$notify({ type: 'danger', message: result.message })

      }
    }
  }
}
</script>

<style scoped>

</style>

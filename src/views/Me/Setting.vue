<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      title="设置"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group style="margin-top:20px">
      <router-link to="/editinfo">
        <van-cell title="编辑资料" is-link />
      </router-link>
    </van-cell-group>
    <van-cell-group style="margin-top:10px">
      <van-cell>
        <template>
          <div style="text-align:center;color:red" @click="show=true">退出登录</div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-action-sheet
    description="您确定退出登录吗？"
    @select="onSelect"
      v-model="show"
      :actions="actions"
      cancel-text="取消"
    />
  </div>
</template>

<script>
export default {
  name:'Setting',
  data() {
    return {
      show: false,
      actions: [{ name: '确认' }],
    };
  },
  methods:{
    // 点击左箭头
    onClickLeft(){
      this.$router.go(-1);
    },
    // 选择退出
    onSelect() {
      this.$store.dispatch('user/logout');
      this.$router.push({path:'/',params:{
        isShow:true
      }})
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false;
    },
  }
}
</script>

<style scoped>

</style>

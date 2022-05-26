<template>
  <div>
    <van-tabbar fixed active-color="#7558fe" v-model="active" @change="handleChange">
      <!--  :to="item.to"-->
      <van-tabbar-item v-for="(item, index) in data"  @click="toPath(item.to)"  :icon="item.icon" :key="index">
        {{ item.title }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'TabBar',
  props: {
    defaultActive: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    uID:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      active: this.defaultActive
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    },
    // 路由跳转
    toPath(path){
      if(path.name=="About"){
        if(this.uID==0){
          this.$dialog.confirm({
            confirmButtonText:'去登录',
            message: '必须先登录才能访问该部分内容',
          })
          .then(() => {
            this.$router.push(path)
          })
          .catch(()=>{
            this.active=0
          })
        }else{
          this.$router.push(path)
        }
        // this.active=0;
      }else{
        this.$router.replace('/home')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

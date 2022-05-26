<template>
  <div id="app">
    <transition name="fade">
      <!-- <transition name="van-slide-left"> -->
    <keep-alive >
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    </transition>
    <transition name="fade">
    <router-view v-if="!$route.meta.keepAlive"/>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'App',

 }
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-leave-to{
  display:none;

}
</style>

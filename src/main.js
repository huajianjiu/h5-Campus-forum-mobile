// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// import PubSub from 'pubsub-js'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn

// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 引入iconfont
import "@/assets/font/iconfont.css";
// 移动端适配
import 'lib-flexible/flexible.js'

// filters
import './filters'

// 全局组件
// 帖子项
import TopicCell from '@/components/TopicCell'
// 帖子列表
import TopicList from '@/components/TopicList'
// 全局api
import API from '@/api'
// 注册全局组件
Vue.component(TopicCell.name,TopicCell);
Vue.component(TopicList.name,TopicList);
Vue.config.productionTip = false;
Vue.prototype.$API=API;
// Vue.prototype.PubSub=PubSub;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

// 绑定物理按键事件
document.addEventListener('plusready', function() {
	var first = null;
	var webview = window.plus.webview.currentWebview();
	window.plus.key.addEventListener('backbutton', function() {
		webview.canBack(function(e) {
			if (e.canBack) {
				webview.back(); //这里不建议修改自己跳转的路径
			} else {
				//首次按键，提示‘再按一次退出应用’
				if (!first) {
					first = new Date().getTime(); //获取第一次点击的时间戳
					// console.log('再按一次退出应用');//用自定义toast提示最好
					// toast('双击返回键退出应用'); //调用自己写的吐丝提示 函数
					window.plus.nativeUI.toast("再按一次退出应用", {
						duration: 'short'
					}); //通过H5+ API 调用Android 上的toast 提示框
					setTimeout(function() {
						first = null;
					}, 1000);
				} else {
					if (new Date().getTime() - first < 1000) { //获取第二次点击的时间戳, 两次之差 小于 1000ms 说明1s点击了两次,
						window.plus.runtime.quit(); //退出应用
					}
				}
			}
		})
	});
	// window.location.href ="http://122.224.121.35:8895";
});




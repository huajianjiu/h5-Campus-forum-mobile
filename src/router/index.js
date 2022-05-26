import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from './router.config.js'
import {getToken} from '@/utils/auth'
import store from '@/store'
import { Notify } from 'vant';
// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    // base: process.env.BASE_URL,
    // scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

router.beforeEach(async(to, from, next) => {


  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      const hasGetUserInfo = store.getters.userInfo.userName
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/logout')
          // Message.error(error || 'Has Error')
          Notify({ type: 'danger', message: error||"请重新登录" });
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token*/

    if (to.path=='/home'||to.path=='/search'||to.path=='/topicdetail'||to.path=='/announcement'||to.path=='/register'||to.path=='/login'||to.path=="/editinfo") {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})


export default router

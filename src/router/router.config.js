/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false,
      index:0
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页',keepAlive:true,index:0}
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/Me'),
        meta: { title: '我的',keepAlive:true ,index:0}
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/home/search'),
    meta: { title: '搜索页',keepAlive:false,index:1 }
  },
  {
    path: '/edittopic',
    name: 'EditTopic',
    component: () => import('@/views/home/EditTopic'),
    meta: { title: '发帖',keepAlive:false,index:1 }
  },
  {
    path:'/topicdetail',
    name:'TopicDetail',
    component: () => import('@/views/General/TopicDetail'),
    meta:{ title:"帖子详情",keepAlive:false,index:1}
  },
  {
    path:'/announcement',
    name:'Announcement',
    component: () => import('@/views/home/Announcement'),
    meta:{ title:"公告详情",keepAlive:true,index:1}
  },
  {
    path:'/homepage',
    name:'HomePage',
    component: () => import('@/views/Me/HomePage'),
    meta:{ title:"个人主页",keepAlive:false,index:1}
  },
  {
    path:'/setting',
    name:'Setting',
    component: () => import('@/views/Me/Setting'),
    meta:{ title:"设置",keepAlive:false,index:1}
  },
  {
    path:'/editinfo',
    name:'EditInfo',
    component: () => import('@/views/Me/EditInfo'),
    meta:{ title:"编辑资料",keepAlive:false,index:2}
  },
  {
    path:'/tablist',
    name:'TabList',
    component: () => import('@/views/Me/TabList'),
    meta:{ title:"帖子列表",keepAlive:false,index:1}
  },
  {
    path:'/login',
    name:'Login',
    component: () => import('@/views/General/Login'),
    meta:{ title:"登录",keepAlive:false,index:1}
  },
  {
    path:'/register',
    name:'Register',
    component: () => import('@/views/General/Register'),
    meta:{ title:"注册",keepAlive:false,index:1}
  },
]

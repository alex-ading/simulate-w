import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

import Timeline from '../views/Timeline.vue'
import Profile from '../views/Profile.vue'
import NewPost from '../views/NewPost.vue'
import Message from '../views/Message.vue'
import OriginalPostDetail from '../views/OriginalPostDetail.vue'
import Login from '../views/Login.vue'
import Followers from '../views/Followers.vue'
import Followings from '../views/Followings.vue'
import Repost from '../views/Repost.vue'
import CommentDetail from '../views/CommentDetail.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Timeline',
    component: Timeline
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  {
    path: "/newpost",
    name: "NewPost",
    component: NewPost
  },
  {
    path: "/message",
    name: "Message",
    component: Message
  },
  {
    path: "/detail",
    name: "OriginalPostDetail",
    component: OriginalPostDetail,
  },
  {
    path: "/followings",
    name: "Followings",
    component: Followings,
  },
  {
    path: "/followers",
    name: "Followers",
    component: Followers,
  },
  {
    path: "/repost",
    name: "Repost",
    component: Repost,
  },
  {
    path: "/commentdetail",
    name: "CommentDetail",
    component: CommentDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   let userid = store.state.userid;
//   if (to.path === "/") {
//     if (userid === null) {
//       next("/login")
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

// router.afterEach((to, from) => {
//   if (to.path === "/" && from.path === "/newpost") {
//     if (store.state.isNewPost) {
//       console.log("刷新")
//       store.commit("updateisNewPost")
//       router.go(0);
//     }
//   }
// })

export default router

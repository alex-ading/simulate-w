import Vue from 'vue'
import VueRouter from 'vue-router'
import Timeline from '../views/Timeline.vue'
import Me from '../views/Me.vue'
import Circle from '../views/Circle.vue'
import Post from '../views/Post.vue'
import Message from '../views/Message.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Timeline',
    component: Timeline
  },
  {
    path: "/me",
    name: "Me",
    component: Me
  },
  {
    path: "/circle",
    name: "Circle",
    component: Circle
  },
  {
    path: "/post",
    name: "Post",
    component: Post
  },
  {
    path: "/message",
    name: "Message",
    component: Message
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

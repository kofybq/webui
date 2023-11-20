/*
 * @Author: your name
 * @Date: 2019-12-23 01:56:50
 * @LastEditTime: 2023-06-20 11:35:20
 * @LastEditors: kofybq 404633218@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \src\router.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import WordDetial from './components/WordDetail.vue'
import Word from './views/Word.vue'
import Home from './views/Home.vue'
import Calc from './views/Calc.vue'
import Stock from './views/Stock.vue'
import Panorama from './views/Panorama.vue'
import Panorama2 from './views/Panorama2.vue'
import Treemap from './views/Treemap.vue'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/calc',
    //   name:'calc',
    //   component: Calc
    // },
    {
      path: '/home',//英语记单词主页
      name:'home',
      component: Home
    },
    {
      path: '/word',
      name: 'Word',
      component: Word,
      props:true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path:'/stock',
      name:'stock',
      component:Stock,
    },
    {
      path:'/panorama',
      name:'panorama',
      component:Panorama,
    },
    {
      path:'/panorama2',
      name:'panorama2',
      component:Panorama2,
    },
    {
      path:'/',
      name:'calc',
      component:Calc,
    },
    {
      path:'/treemap',
      name:'treemap',
      component:Treemap,
    }
  ]
})

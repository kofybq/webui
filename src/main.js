/*
 * @Author: kofybq 404633218@qq.com
 * @Date: 2019-12-23 01:56:50
 * @LastEditors: kofybq 404633218@qq.com
 * @LastEditTime: 2023-06-19 18:44:45
 * @FilePath: \src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui' //element-ui的全部组件


import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import axios from 'axios'



// axios.defaults.baseURL='http://45.32.130.153'
axios.defaults.baseURL = ''
Vue.use(ElementUI) //使用elementUI
// import axios  from 'axios'
axios.get('params.config.json').then((result) => {
  Vue.prototype.params = result.data
  Vue.config.productionTip = false
  Vue.config.productionTip = true
  new Vue({
    router,
    render: h => h(App),
    data: function () {
      return {
        user: 'admin',
        words: null,
        queue: null,
      }
    },
    mounted() {
      window.vue = this

    }
  }).$mount('#app')
})



// axios.get('/dictapi/getword/goes')
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });


// sort array ascending

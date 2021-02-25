// 文件入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式
import './style/index.less'
// 加载注册vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'
// 将单位转化为 rem
import 'amfe-flexible'

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

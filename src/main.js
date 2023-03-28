import Vue from 'vue'
import App from './App.vue'
//引入vuex仓库
import store from '@/store/tree'
//引入elementUI
import {Table,TableColumn,Input} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.levelData=new Map()
  },
  store
}).$mount('#app')

import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import store from './store/index'
import VueRouter from 'vue-router'
import routes from './router/router'
import 'vue-easytable/libs/themes-base/index.css'
import '@/style/vue-datetime.css'
import tableOpa from '@/components/tableOpa'
import {VTable} from 'vue-easytable'
import Pagination from 'vuejs-pagination'
import { Datetime } from 'vue-datetime'
import GeminiScrollbar from 'vue-gemini-scrollbar'
import allFun from './plugin/all-fun/index'

//自定义数据


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(GeminiScrollbar)

//全局注册table组件
Vue.component(VTable.name, VTable)
Vue.component("Pagination", Pagination)
Vue.component('tableOpa',tableOpa)
Vue.component('datetime', Datetime);
//注册全局公用方法
Vue.prototype.$fun = allFun

const router = new VueRouter({
	routes
})

new Vue({
	router,
	store
}).$mount('#app')

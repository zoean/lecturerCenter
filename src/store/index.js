import Vue from 'vue'
import Vuex from 'vuex'
import layer from './modules/layer'
import dateTime from './modules/dateTime'
import tableOpa from './modules/tableOpa'
import video from './modules/video'
import navNum from './modules/navNum'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	modules: {
    	layer,
    	dateTime,
    	tableOpa,
    	video,
    	navNum
  	},
  	strict: debug,
})
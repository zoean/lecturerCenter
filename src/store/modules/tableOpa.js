export default{
	namespaced: true,
	state:{
		opaList:[
			// {content:'下架',style:{'color':'#4d9dfc'},type:'discharge'},
			// {content:'上架',style:{'color':'#4d9dfc'},type:'upcharge'},
			// {content:'查看详情',style:{'color':'#cc0000'},type:'detailed'},
			// {content:'发布',style:{'color':'#cc0000'},type:'shipment'},
			// {content:'编辑后提交',style:{'color':'#4d9dfc'},type:'edit'},
			// {content:'删除',style:{'color':'#4d9dfc'},type:'delete'}
		],
		opaListTwo:[]
	},
	mutations: {
		updateOpaList(state,msg){
			state.opaList = msg;
		},
		updateOpaListTwo(state,msg){
			state.opaListTwo = msg;
		}
	},
	actions: {
		updateOpaList({commit, state, dispatch},msg){
			commit('updateOpaList',msg);
		},
		updateOpaListTwo({commit, state, dispatch},msg){
			commit('updateOpaListTwo',msg);
		}
	}
}
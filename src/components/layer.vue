<template>
	<div class="mark-window" v-if="tipShow" @click="cancelCallback">
		<div class="tip" @click.stop="">
			<p class="tip-title" v-if="tipData.showbox == 'pattern-2'">
				提示
			</p>
			<span class="tip-close" @click="cancelCallback" v-if="tipData.showbox == 'pattern-1' || tipData.showbox == 'pattern-3'|| tipData.showbox == 'pattern-4' || tipData.showbox == 'pattern-5'">
			</span>
			<div class="tip-content">
				<div v-if="tipData.showbox == 'pattern-1'">
			        <div class="tip-content-msg-one">
			          <p v-html="tipData.con"></p>
			        </div>
			        <ul class="content-btn-list">
			          <li>
			            <span class="cancel" @click="cancelCallback">取消</span>
			          </li>
			          <li>
			            <span class="determine" @click="callback">确定</span>
			          </li>
			        </ul>
				</div>
				<div v-if="tipData.showbox == 'pattern-2'">
			        <div class="tip-content-msg-two">
			          <p v-for="item in tipData.con" :style="item.color">
			          	{{item.msg}}
			          </p>
			        </div>
			        <ul class="content-btn-list">
			          <li>
			            <span class="cancel" @click="cancelCallback">我知道了</span>
			          </li>
			        </ul>
				</div>
				<div v-if="tipData.showbox == 'pattern-3'">
			        <div class="tip-content-msg-three">
			          <p v-for="item in tipData.con" class="show-msg-content">
			          	<span class="span-msg span-msg-title">{{item.title}}</span>
			          	<span class="span-msg" style="word-break: break-all; width:400px;" v-html="item.msg"></span>
			          </p>
			        </div>
				</div>
				<div v-if="tipData.showbox == 'pattern-4'">
			        <div class="tip-content-msg-four">
			          <p v-for="item in tipData.con" class="show-msg-content">
			          	<span class="span-msg span-msg-title">{{item.title}}</span>
			          	<span class="span-msg" style="word-break: break-all;" v-html="item.msg"></span>
			          </p>
			        </div>
				</div>
				<div class="bottom-content" v-if="tipData.showbox == 'pattern-5'">
		        	<p class="findings-of-audit">
		        		<audio :src="tipData.url" controls="controls"></audio>
		        	</p>
		        </div>
			</div>
		</div>
	</div>
</template>
<script>

//该组件的回调函数是callback 

import {mapActions,mapState} from 'vuex'

	export default {
		computed:{
			...mapState('layer',{
				tipData: state => state.tipData,
				tipShow: state => state.isShow
			})
		},
		watch:{
			tipData(val){
			}
		},
		methods:{
			...mapActions('layer',{
				showTip: 'show',
				closeTip: 'close'
			}),
			callback(){
				this.closeTip();
				// let albumId = document.getElementById('albumId')
				// console.log(albumId)
				// if(albumId){
				// 	this.$emit('albumChange',albumId.value)
				// }
				this.$store.dispatch('layer/exeSuccessCall','msg')
			},
			cancelCallback(){
				this.closeTip();
				this.$store.dispatch('layer/exeCancelCall','msg')
			}
		}
	}
</script>
<style lang="scss" scoped type="text/css">
	.mark-window{
		position: fixed;
		top:0;
		left:0;
		z-index: 10000;
		@include basebox(100%,100%,rgba(0,0,0,.3));
	}
	.tip{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		min-width: 400px;
		border-radius: 5px;
		overflow: hidden;
		background: #fff;
		z-index: 10;
	}
	.tip-title{
		@include basebox(100%, 50px, #4d9dfc);
		@include basefont(18px, 50px, #fff, center);
	}
	.tip-close{
		@include basebox(25px, 25px, url('../images/closelayer_03.png') no-repeat);
		position: absolute;
		top: 12px;
		right: 12px;
		cursor: pointer;
	}
	.tip-content-msg-one{
	    @include basefont(16px, 20px, #333333,center);
	    margin-top: 80px;
	    margin-bottom: 65px;
	  }
	.tip-content-msg-two{
	    @include basefont(16px, 20px, #333333,center);
	    margin-top: 26px;
	    margin-bottom: 30px;
	    .red{
	      color:red;
	    }
	 }
	.tip-content-msg-three,.tip-content-msg-four{
	    padding-top: 40px;
	    margin-bottom: 27px;
	    padding-left: 35px;
	    padding-right: 35px;
	    .show-msg-content{
	    	display: flex;
	    	.span-msg{
	    		@include basefont(16px, 36px, #333333,left);
	    		&.span-msg-title{
	    			white-space: nowrap;
		      	}
	    	}
	    }
	}
	.bottom-content{
    	width: 100%;
    	height: 150px;
    	padding-top:50px;
    	background:#000;
    	display: flex;
	 	justify-content:center;
    	.findings-of-audit{
    		padding: 0 20px;
    		span{
    			@include basefont(16px, 50px, #fff,left);
    			&.reason{
    				margin-left: 47px;
    			}
    		}
    	}
    }
	.content-btn-list{
	  display: flex;
	  align-item: center;
	  margin-bottom: 18px;

	  li{
	    flex: 1;
	    text-align: center;

	    span{
	      display: inline-block;
	      @include basebox(120px, 46px, #fff, 1px solid #4d9dfc,5px);
	      @include basefont(16px, 44px, #4d9dfc,center);
	      
	      cursor: pointer;
	      &.determine{
	        background: #4d9dfc;
	        color: #fff;
	      }
	    }
	  }
	}
</style>
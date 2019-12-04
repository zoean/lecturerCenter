<template>
    <div class="preview">
    	<a class="imgbtn">选择文件</a>
        <input type="file" :accept="imgdata.type" id="file" value="" @change="upImage($event)" />
        <p>{{msg}}</p>
    </div>
</template>

<script>
import api from '@/api/index'
import axios from 'axios'
import qs from 'qs'
export default {
	props:{
		imgdata:{
			type:Object,
			default:{
					type:'image/*',
					size:3072,
					height:'',
					width:'',
					imgname:'上传图片',
					url:''
				}
		}
	},
	data(){
		return {
			imgUrl:'',
			msg:''	
		}
	},
	methods:{
		// data2blob(data, mime) {//将base64转换为Blob文件
		//       data = data.split(',')[1];
		//       data = window.atob(data);
		//       var ia = new Uint8Array(data.length);
		//       for (var i = 0; i < data.length; i++) {
		//         ia[i] = data.charCodeAt(i);
		//       };
		//       // canvas.toDataURL 返回的默认格式就是 image/png
		//       return new Blob([ia], {
		//         type: mime
		//       });
	 //  	},
		upImage(event){    
			//let that = this
			let file = event.target.files[0]
			if(this.imgdata.type.indexOf(file.type) == -1){
				this.msg = '请上传正确的图片格式'
				return
			}
			if(file.size>this.imgdata.size*1024){//拦截图片大小  3145728   1522524
				this.msg = '图片过大，请重新上传'
				return
			}
			let fd = new FormData()
			fd.append('username', 'root')
			fd.append('fafafa', file);
			axios.post(this.imgdata.url,fd).then((res)=>{
				if(res.data.state == 0){
					this.$emit('imgUrlCallback',res.data.content)
					this.msg = "上传成功"
				}else{
					this.msg = "请上传正确的图片"
				}
			})
		    // var reader = new FileReader();
      //       reader.readAsDataURL(file);
      //       var timestamp = Date.parse(new Date());//创建文件名称,createImgUrl
      //       var createImgUrl = ''
      //       reader.onload = function(e){
      //       	let newUrl = reader.result
            	
      //       	//let newUrl = file.toDataURL('image/png')
      //       	createImgUrl = that.data2blob(newUrl,'image/jpeg')
      //       	let img = new Image()
      //       	img.src = newUrl
      //       	img.onload = function(e){
      //       		if(img.width<400){
						// that.msg = '图片尺寸需大于400像素'
						// return
      //       		}
      //       	}
      //       	var fmData = new FormData();
		    //     console.log(createImgUrl)
		    //     fmData.append(timestamp,createImgUrl,timestamp+'.png')
		    //     $.ajax({
	     //            url:that.imgdata.url,//上传文件路径
	     //            type:'POST',
	     //            data:fmData ,
	     //            processData:false,  //tell jQuery not to process the data
	     //            contentType: false,  //tell jQuery not to set contentType
	     //            //这儿的三个参数其实就是XMLHttpRequest里面带的信息。
	     //            success:function (response) {
	     //              //上传成功回调
	     //              console.log(11111111111)
	     //            }
	     //          });
      //       }
		}
	}
}
</script>
<style lang="scss" scoped type="text/css">
.preview{
	float:left;
	position:relative;
	width:100px;
	margin-right: 25px;
	input{
		opacity: 0;
		position: absolute;
		left:0;
		width:100px; 
		height:34px;
		cursor: pointer;
	}
	p{margin-top:35px; margin-bottom:5px; color:red; font-size:12px;}
}
.imgbtn{
	width:100px; 
	height:34px;
	border-radius: 5px;
    font-size: 16px;
    line-height: 34px;
    text-align: center;
    cursor: pointer;
    color: #5ca5fc;
    display: block;
    border: 1px solid #5ca5fc;
    position: absolute;
	left:0;
}
</style>
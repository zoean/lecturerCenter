<template>
  <div>
    <p class="go-back-btn" @click="$router.go(-1);">专辑详情</p>
    <div class="zjxq_main">
      <dl id="xq_main">
        <dt><img :src="$fun.getUrlVerify(titleDate.pic)" alt="专辑封面"></dt>
        <dd>
          <p class="title_gp">{{titleDate.title}}
            <span v-for="(item,index) in titleDate.labelVos" :key="index">{{item.name}}</span>
          </p>
          <p><em>分类：</em><var>{{titleDate.typeVoOne.name}}-{{titleDate.typeVoTwo.name}}</var></p>
          <p><em>简介：</em><var>{{titleDate.referral}}</var></p>
          <a href="javascript:;" class="scyp_btn" @click="$router.push({name:'uploadaudio'})">上传音频</a>
        </dd>
      </dl>
      <div v-if="type == 2">
          <div class="jianjie"><span>课程简介：</span><p>{{titleDate.courseInfo}}</p></div>
          <div class="jianjie"><span>老师简介：</span><p>{{titleDate.lecturerInfo}}</p></div>
          <div class="jianjie"><span>图片简介：</span>
            <a target='_blank' :href='$fun.getUrlVerify(titleDate.coursePic)' v-if="titleDate.coursePic!=''"><img :src="$fun.getUrlVerify(titleDate.coursePic)" /></a>
          </div>
      </div>
      <div class="jianjie"><span>专辑默认显示顺序：</span>
          <label><input name="sort" type="radio" :checked="checkedOne" value="0" @click="audioSort(0)" />正序显示</label>
          <label style="margin-left:10px;"><input name="sort" type="radio" :checked="checkedTwo" value="1" @click="audioSort(1)"/>倒序显示</label>
      </div>
    </div>
    <div class="main-table-warp" style="width:920px;">
      <v-table
        is-horizontal-resize="true"
        style="width:100%;"
        :column-cell-class-name="columnCellClass"
        :columns="columns"
        :table-data="tableData"
        :row-height="80"
        :title-row-height="50"
        :select-change="selectRow"
        :select-all="selectAll"
        :row-click="rowClick"
        @on-custom-comp="customCompFunc"> 
      </v-table>
      <p v-if="type == 1" class="move transforAlbum" @click="transferAlbum"><span>转移至其他专辑</span></p>
      <pagination
        class="center-pagination"
        :page-num="pageNum"
        :current-page="activePage"
        @change="pagechange"v-if="pageNum>0">  
      </pagination>
    </div>
    <layer :tip-data="tipData"></layer>
    <div class="mark-window" v-if="transferFlag && albumNum==2">
      <div class="tip">
        <div class="tip-content">
          <div class="tip-content-msg-one">
            <div class="boxText">已选择{{checkoutList.length}}个音频</div>
            <div class="boxText">请选择将所选视频移至哪个专辑内？</div>
            <select v-model="albumIdTwo" class="tip-content-msg-one-select">
              <option value>请选择专辑</option>
              <option v-for="(item,index) in albumList" :value="item.id" :key="index">{{item.title}}</option>
            </select>
          </div>
          <ul class="content-btn-list">
            <li>
              <span class="cancel" @click="transFerFalse">取消</span>
            </li>
            <li>
              <span class="determine" @click="transFerTrue">确定</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mark-window" v-if="transferFlag && albumNum==1">
            <div class="tip">
                <div class="tip-content">
                    <div class="tip-content-msg-one">
                        <div class="boxText">没有其它专辑，请创建后再进行操作</div>
                    </div>
                    <ul class="content-btn-list">
                      <li>
                        <span class="determine" @click="transFerFalse">确定</span>
                      </li>
                    </ul>
                </div>
            </div>
    </div>
    <div class="mark-window" v-if="transferFlag2">
            <div class="tip">
                <div class="tip-content">
                    <div class="tip-content-msg">
                      <p class="tip-content-msg-title">{{titleDate.title}}:{{curAudioTitle}}</p>
                        <div class="boxText" style="font-size:14px; mar-left45px; text-indent:24px;">{{curSortModTxt}}</div>
                        <div class="boxText"><span>排序：</span><input type="number" placeholder="请输入大于0的整数" name="" v-model="szpx" @propertychange="zhihui()" @input="zhihui()" class="szpx"  onkeyup="value=parseInt(value.replace(/^[0][\*]*/g,''))"></div>
                    </div>
                    <ul class="content-btn-list">
                      <li>
                        <span class="cancel" @click="transFerFalsePx">取消</span>
                      </li>
                      <li>
                        <span class="determine zhihui" @click="transFerTruePx">确定</span>
                      </li>
                    </ul>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import api from "@/api/index"; //接口路径
import layer from "@/components/layer"; //提示弹框组件
import qs from "qs"; //qs插件    （序列化字符串，处理发送请求的参数使用工具qs来处理参数）
import {
  AIDEO_PLAY,
  AUDIT_RRESULT,
  UPLOAD_MODIFY_FILE
} from "@/utils/constant"; //类型
import { ALBUM } from "@/utils/constant"; //视频便捷页面？
import dateTime from "@/components/dateTimeSelect"; //日期组件
export default {
  components: {
    dateTime,
    layer
  },
  data() {
    return {
      pageNum: 0,
      activePage: 1,
      tableData: [],
      selectedRank: "", //排序
      selectedOne: "", //一级分类
      labelList: [], //一级分类列表
      selectedTwo: "", //二级分类
      labelList2: [], //二级分类列表
      titleDate: {
        labelVos: [],
        typeVoOne: {},
        typeVoTwo: {}
      },
      checkoutList: [],
      columns: [
        {
          field: "num",
          title: "序号",
          width: 90,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "title",
          title: "音频标题",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "playNum",
          title: "播放量",
          width: 72,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "updateTime",
          title: "上架时间",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "status",
          title: "状态",
          width: 80,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var status = rowData.status;
            var html = "";
            if (status == 2) {
              html += "<span data='" + status + "'>已上架</span>";
            } else {
              html += "<span data='" + status + "'>已下架</span>";
            }
            return html;
          }
        },
        {
          field: "sort",
          title: "内容排序",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var sort = rowData.sort;
            var html = "";
            if(sort == undefined) {
              html += "<a href='javascript:;' style='color:#4d9dfc'>设置排序</a>";
            }else{
              html += "<a href='javascript:;' style='color:#4d9dfc'>"+sort+"</a>";
            }
            return html;
          }
        },
        {
          field: "custome-adv",
          title: "操作",
          width: 120,
          titleAlign: "center",
          columnAlign: "center",
          componentName: "tableOpa",
          isResize: true
        }
      ],
      tipData: null,
      downVideoId: "",
      albumId: "",
      albumIdTwo: "",
      albumList: [],
      type:1,
      albumNum:1,
      downDateIndex: 0,
      transferFlag:false,
      transferFlag2:false,
      szpx:'',
      albumslotId:'',
      sortNum:'',
      checkedOne:'checked',
      checkedTwo:'',
      curSortModTxt: ''//当前排序提示语
    };
  },
  methods: {
    zhihui(){
       if(this.szpx == '' || this.szpx == '请输入大于0的整数' ||this.szpx == 0){
          $(".determine").addClass("zhihui");
          //console.log(this.szpx);
          return;
        }else{
          $(".determine").removeClass("zhihui");
          //console.log(this.szpx)
        }
    },
    rowClick(rowIndex,rowData,column){
     //console.log(column);
     if(column.field=="sort"){
        this.albumslotId = rowData.id
        this.transferFlag2 = true
        this.curAudioTitle = rowData.title
        this.szpx= rowData.sort
        if(this.checkedOne){
          this.curSortModTxt = '提示：数字越小排序越靠前'
        }else{
          this.curSortModTxt = '提示：数字越大排序越靠前'
        }
      }
    },
    //取消排序
    transFerFalsePx(){
        this.albumslotId = ''
        this.transferFlag2 = false
    },
    //确认排序
    transFerTruePx(){
      if(this.szpx == '' || this.szpx == 0){
        return;
      }else{
        api.audioSzpxFn({audioId:this.albumslotId,sort:this.szpx})
          .then(response => {
              if(response.status == 200){
                  this.albumslotId = ''
                  this.getDate()
                  this.transferFlag2 = false
              }else{
                  this.$store.commit('layer/updateTipData',{
                      showbox:'pattern-2',
                      con:[{msg:data.message}]
                  })
                  this.$store.dispatch('layer/show'); 
              }
          })
          .catch(err => {
              console.log("请求失败");
          })
      }    
    },
    //设置专辑排序
    audioSort(sort){
        api.audioSortFn({
            sort:sort,//传参
            albumId:this.titleDate.id
        })
        .then(response=>{
            if(response.status == 200){
                var data = response.data;
                if(data.state == 0){
                    console.log("排序成功");
                    this.getDate();//重新加载数据
                }
            }else{
                console.log("请求失败");
            }
        })
    },
    //取消转移
    transFerFalse() {
      this.transferFlag = false;
      this.albumIdTwo = "";
    },
    //确认转移
    transFerTrue() {
      if (this.albumIdTwo != "") {
        //二次弹框
        this.transferFlag = false;
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "是否确定转移该视频？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audioshiftFn({
                audioIds: this.checkoutList.join(","),
                albumId: this.albumIdTwo
              }) //转移接口
              .then(response => {
                if (response.status == 200) {
                  this.checkoutList = [];
                  this.albumIdTwo = "";
                  this.getDate();
                } else {
                  this.$store.commit("layer/updateTipData", {
                    showbox: "pattern-2",
                    con: [{ msg: data.message }]
                  });
                  this.$store.dispatch("layer/show");
                }
              })
              .catch(err => {
                console.log("请求失败");
              });
          }.bind(this)
        );
        this.$store.dispatch("layer/show");
      }
    },
    //转移
    transferAlbum() {
      //无选择返回
      if (this.checkoutList.length <= 0) {
        return;
      }
      this.transferFlag = true;
    },
    //选择
    selectRow(selection, rowData) {
      this.checkoutList = [];
      selection.map(item => {
        this.checkoutList.push(item.id);
      });
    },
    //全选
    selectAll(selection) {
      this.checkoutList = [];
      selection.map(item => {
        this.checkoutList.push(item.id);
      });
    },
    
    //点击操作内容触发事件
    customCompFunc(params) {
      if (params.type[0] === "edit") {
        //编辑后上传
        let param = {
          name: params.rowData.name,
          id: params.rowData.id,
          title: params.rowData.title,
          aliId: params.rowData.aliId,
          albumId: this.$route.query.albumId,
          albumTitle:this.titleDate.title,
          audioModel:params.rowData.audioModel,
          sort:params.rowData.sort
        };
        param = JSON.stringify(param);
        this.$router.push({
          name: "uploadaudio",
          query: { param }
        });
      } else if (params.type[0] === "discharge") {
        //下架
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "下架后用户再看不到了，确定下架视频吗？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audiodownFn({ audioId: this.downVideoId })
              .then(response => {
                if (response.status == 200) {
                  var data = response.data;
                  if (data.state == 0) {
                    this.getDate();
                  } else {
                    this.$store.commit("layer/updateTipData", {
                      showbox: "pattern-2",
                      con: [{ msg: data.message }]
                    });
                    this.$store.dispatch("layer/show");
                  }
                } else {
                  console.log("请求失败");
                }
              })
              .catch(err => {
                console.log("请求失败");
              });
          }.bind(this)
        );
        this.downVideoId = params.rowData["id"];
        this.$store.dispatch("layer/show");
      }else if (params.type[0] === "qxcourse") {//取消试听课
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "确定取消该试听课吗？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audioCourseFn(qs.stringify({audioId:this.downVideoId,model:2,albumId:this.albumId})) //取消试听课
              .then(response => {
                if (response.status == 200) {
                  var data = response.data;
                  if (data.state == 0) {
                     this.getDate();
                  } else {
                    this.$store.commit("layer/updateTipData", {
                      showbox: "pattern-2",
                      con: [{ msg: data.message }]
                    });
                    this.$store.dispatch("layer/show");
                  }
                } else {
                  console.log("请求失败");
                }
              })
              .catch(err => {
                console.log("请求失败");
              });
          }.bind(this)
        );
        this.downVideoId = params.rowData["id"];
        this.albumId=params.rowData["albumId"];
        this.$store.dispatch("layer/show");
        this.downDateIndex = params.index;
     }else if (params.type[0] === "szcourse") {//设置试听课
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "确定设置该试听课吗？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audioCourseFn(qs.stringify({audioId:this.downVideoId,model:3,albumId:this.albumId})) //设置试听课
              .then(response => {
                if (response.status == 200) {
                  var data = response.data;
                  if (data.state == 0) {
                     this.getDate();
                  } else {
                    this.$store.commit("layer/updateTipData", {
                      showbox: "pattern-2",
                      con: [{ msg: data.message }]
                    });
                    this.$store.dispatch("layer/show");
                  }
                } else {
                  console.log("请求失败");
                }
              })
              .catch(err => {
                console.log("请求失败");
              });
          }.bind(this)
        );
        this.downVideoId = params.rowData["id"];
        this.albumId=params.rowData["albumId"];
        this.$store.dispatch("layer/show");
        this.downDateIndex = params.index;
      }
    },
    pagechange(arg) {
      this.activePage = arg;
      this.getDate();
    },
    columnCellClass(rowIndex, columnName, rowData) {
      if (columnName == "hobby") {
        return "title-cell-class-name";
      }
    },
    getDate() {
       //console.log(this.$route.query+"22222222");
      api
        .audioalbumseeFn({
          //音频专辑详情接口
          size: 20,
          page: this.activePage,
          albumId: this.$route.query.albumId
        })
        .then(response => {
          if (response.status == 200) {
            var data = response.data;
            if (data.state == 0) {
              this.sortNum = data.content.album.sort;
              if(this.sortNum == 1){
                  this.checkedTwo='checked'
                  this.checkedOne=''
              }else{
                  this.checkedTwo=''
                  this.checkedOne='checked'
              }
              this.tableData = data.content.audios.list;
              for (let i in this.tableData) {
                this.tableData[i].num = this.tableData.length - i;
              }
              if (this.activePage == 1) {
                this.titleDate = data.content.album;
              }
              this.pageNum = data.content.audios.pages;
            } else {
              this.$store.commit("layer/updateTipData", {
                showbox: "pattern-2",
                con: [{ msg: data.message }]
              });
              this.$store.dispatch("layer/show");
            }
          } else {
            console.log("请求失败");
          }
        })
        .catch(err => {});
    }
  },
  created() {
    let param = this.$route.query
    this.type  = param.type
    if(this.type == 1){//免费头部添加复选框列
        this.columns.unshift({field: 'checkoutall', title:'全选', width: 90,type: 'selection', titleAlign: 'center',columnAlign:'center',isResize:true},)
    }
    this.$store.dispatch("tableOpa/updateOpaList", [
        {content:'下架',style:{'color':'#4d9dfc'},type:['discharge',this.type],permissFlag:'audioalbumsee'},
        {content:'编辑',style:{'color':'#4d9dfc'},type:['edit',this.type],permissFlag:'audioalbumsee'},  
        {content:'取消试听课',style:{'color':'#4d9dfc'},type:['qxcourse',this.type],permissFlag:'audioalbumsee'},
        {content:'设置试听课',style:{'color':'#4d9dfc'},type:['szcourse',this.type],permissFlag:'audioalbumsee'} 
    ]);
    //获取专辑列表（免费的）
    api
      .audioalbumallFn({model:1})
      .then(response => {
        if (response.status == 200) {
          var data = response.data;
          if (data.state == 0) {
            this.albumList = data.content;
            if(data.content.length==1){
              this.albumNum=1;
            }else{
               this.albumNum=2;
            }
            //去除当前专辑
            this.albumList = this.albumList.filter(item => {
              if (item.id != this.$route.query.albumId) 
                return item;
            });
          } else {
            this.$store.commit("layer/updateTipData", {
              showbox: "pattern-2",
              con: [{ msg: data.message }]
            });
            this.$store.dispatch("layer/show");
          }
        } else {
          console.log("请求失败");
        }
      })
      .catch(err => {});
    this.getDate();
  }
};
</script>
<style lang="scss" type="text/css">
.jianjie{ clear:both; font-size:14px; margin-bottom:15px; overflow:hidden;}
.jianjie span{display:block; float:left;}
.jianjie p{float:left;}
.jianjie img{display:block; float:left; width:86px; height:86px;}
.mark-window {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  @include basebox(100%, 100%, rgba(0, 0, 0, 0.3));
}
.tip {
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
.tip-content-msg {
  @include basefont(16px, 20px, #333333, center);
  margin-top: 20px;
  margin-bottom: 0;
  text-align: left;
  margin-left: 0;
  .tip-content-msg-title{
    text-align: center;
  }
  .boxText {
    margin: 20px 0;
    margin-left: 80px;
  }
}
.tip-content-msg-one-select {
  border: 1px solid black;
}
.content-btn-list {
  display: flex;
  align-item: center;
  margin-bottom: 18px;

  li {
    flex: 1;
    text-align: center;

    span {
      display: inline-block;
      @include basebox(120px, 46px, #fff, 1px solid #4d9dfc, 5px);
      @include basefont(16px, 44px, #4d9dfc, center);

      cursor: pointer;
      &.determine {
        background: #4d9dfc;
        color: #fff;
      }
    }
  }
}
.move {
  overflow: hidden;
  margin-top: 10px;
  height: 60px;
}
.transforAlbum {
  display: inline-block;
}
.move span {
  padding: 8px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  color: #333333;
  font-size: 14px;
  display: block;
  width: 120px;
  cursor: pointer;
}
.zjxq_main {
  width: 905px;
  overflow: hidden;
  margin: 0 auto;
  padding-top: 20px;
}
.zjxq_main dl {
  overflow: hidden;
  margin-bottom: 20px;
}
.zjxq_main dl dt {
  width: 120px;
  height: 120px;
  float: left;
}
.zjxq_main dl dt img {
  width: 120px;
  height: 120px;
  display: block;
}
.zjxq_main dl dd {
  float: left;
  margin-left: 17px;
  width: 758px;
  position: relative;
}
.zjxq_main dl dd p {
  color: #333333;
  font-size: 14px;
  clear: both;
}
.zjxq_main dl dd p em {
  display: block;
  float: left;
}
.zjxq_main dl dd p var {
  display: block;
  float: left;
  font-style: normal;
  width: 405px;
  padding-bottom: 15px;
}
.zjxq_main dl dd p.title_gp,
.zjxq_main dl dd p em {
  color: #333333;
  font-size: 18px;
  padding-bottom: 15px;
  font-weight: bold;
  font-style: normal;
}
.title_gp span {
  width: 68px;
  height: 24px;
  display: inline-block;
  border: 1px solid #cc0000;
  color: #cc0000;
  border-radius: 5px;
  vertical-align: middle;
  margin-left: 10px;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
}
.scyp_btn {
  width: 100px;
  height: 34px;
  display: block;
  border: none;
  background: #4d9dfc;
  border-radius: 5px;
  font-size: 16px;
  line-height: 34px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 50px;
}
.go-back-btn {
  @include basebox(100%, 62px);
  @include basefont(18px, 62px, #333);
  border-bottom: 1px solid #d2d2d2;
  text-indent: 35px;
  background: url("../../images/icon_03.png") no-repeat 17px center;
  background-size: 10px 16px;
  cursor: pointer;
}
.v-table-header-row {
  background-color: #f2f2f2;
  div {
    span {
      color: #4d9dfc;
    }
  }
}
.record-warp {
  display: flex;
  padding: 35px 150px 40px;
  border-bottom: 1px solid #d2d2d2;
  .record-item {
    flex: 1;
    p {
      @include basefont(18px, 20px, #333, center);
      span {
        @include basefont(24px, 26px, #cc0000);
      }
    }
  }
}
.up-video-box {
  margin-top: 92px;
  .msg-tip {
    @include basefont(20px, 24px, #333, center);
    margin-bottom: 45px;
  }
  .b-up-btn {
    @extend .btn;
    width: 200px;
    display: block;
    margin: 0 auto;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
  }
}
.condition-video-online-warp2 {
  @extend .clear;
  margin-bottom: 23px;
  margin-top: 22px;
}
.room-id {
  float: left;
  font-size: 0;
  margin-left: 22px;
  span {
    @include basefont(16px, 28px, #333);
  }
  input {
    box-sizing: border-box;
    @include basebox(180px, 28px, #fff, 1px solid #d6d6d6);
    @include basefont(16px, 28px, #333);
    padding: 0 12px;
    &.bt-void-input {
      width: 180px;
    }
  }
}
.select-warp2 {
  float: left;
  margin-left: 20px;
  @extend .clear;
  &.mar-left {
    margin-left: 42px;
    select {
      width: 140px;
    }
  }
  .select-tip {
    float: left;
    @include basefont(16px, 28px, #333);
  }
  select {
    @include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
    box-sizing: border-box;
  }
}
.ok-btn {
  float: left;
  margin-left: 20px;
  margin-top: -4px;
  @extend .btn;
}
.time-show-float {
  float: left;
  margin-left: 20px;
}
.cleaars {
  clear: both;
  width: 100%;
  margin-top: 15px;
}
</style>

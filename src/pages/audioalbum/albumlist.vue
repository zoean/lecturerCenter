<template>
  <div>
    <div class="main-table-warp" style="width:920px;">
      <div class="condition-video-online-warp2">
        <div class="select-warp2">
          <span class="slect-tip">筛选：</span>
          <select v-model="selectedOne" @change="dataTwoFn" style="width:120px;">
            <option value>请选择一级分类</option>
            <option v-for="(item,index) in labelList" :value="item.id" :key="index">{{item.name}}</option>
          </select>
          <select v-model="selectedTwo" style="width:120px;">
            <option value>请选择二级分类</option>
            <option v-for="(item,index) in labelList2" :value="item.id" :key="index">{{item.name}}</option>
          </select>
        </div>
        <div class="select-warp2">
          <span class="slect-tip">排序：</span>
          <select v-model="selectedRank">
            <option value>默认</option>
            <option value="1">按播放量从低到高</option>
            <option value="2">按播放量从高到低</option>
          </select>
        </div>
        <div class="select-warp2">
          <span class="slect-tip">专辑类型：</span>
          <select v-model="albumType">
            <option value>全部</option>
            <option value="1">免费专辑</option>
            <option value="2">付费专辑</option>
          </select>
        </div>
        <div class="twoBox">
          <dateTime class="time-show-float" ref="dateTime"></dateTime>
          <span class="ok-btn" @click="getDate">确定</span>
        </div>
      </div>
      <v-table
        is-horizontal-resize
        style="width:100%;"
        :column-cell-class-name="columnCellClass"
        :columns="columns"
        :table-data="tableData"
        :row-height="80"
        :title-row-height="50"
        @on-custom-comp="customCompFunc"
      ></v-table>
      <pagination
        class="center-pagination"
        :page-num="pageNum"
        :current-page="activePage"
        @change="pagechange"
        v-if="pageNum>1"
      ></pagination>
      <layer :tip-data="tipData"></layer>
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
      albumType:"",//专辑类型
      selectedOne: "", //一级分类
      labelList: [], //一级分类列表
      selectedTwo: "", //二级分类
      labelList2: [], //二级分类列表
      columns: [
        {
            field: "albumId",
            title: "序号",
            width: 60,
            titleAlign: "center",
            columnAlign: "center",
            isResize: true,
            formatter: (rowData, rowIndex, pagingIndex, field) => {
              return "<span>" + (rowIndex + 1) + "</span>";
            }
        },
        {
          field: "title",
          title: "专辑标题",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "pic",
          title: "专辑封面",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            return (
              "<a target='_blank' href='" +rowData.pic +"' ><img style='width:80px;height:80px' src='" +rowData.pic +"'></a>"
            );
          }
        },
        {
          field: "referral",
          title: "专辑简介",
          width: 182,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "typeVoOne",
          title: "分类",
          width: 194,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            return (
              "<span>" +
              rowData.typeVoOne.name +
              "</span>--<span>" +
              rowData.typeVoTwo.name +
              "</span>"
            );
          }
        },
        {
          field: "labels",
          title: "标签",
          width: 180,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            //标签
            var list = rowData.labels;
            var html = "";
            for (var i = 0; i < list.length; i++) {
              html += "<span>" + list[i] + "&nbsp;</span>";
            }
            return html;
          }
        },
        {
          field: "playNum",
          title: "播放数量",
          width: 72,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "audioNum",
          title: "音频数量",
          width: 72,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "id",
          title: "专辑ID",
          width: 88,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "createTime",
          title: "创建时间",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "status",
          title: "状态",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var status = rowData.status;
            var html = "";
            if (status == 1) {
              html += "<span data='" + status + "'>已上架</span>";
            } else {
              html += "<span data='" + status + "'>已下架</span>";
            }
            return html;
          }
        },
        {
          field: "albumType",
          title: "专辑类型",
          width: 120,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var albumType = rowData.albumType;
            var html = "";
            if (albumType == 1) {
              html += "<span data='" + type + "'>免费</span>";
            } else if (albumType == 2){
              html += "<span data='" + type + "'>付费</span>";
            }
            return html;
          }
        },
        {
          field: "originalPrice",
          title: "专辑价格",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var originalPrice = rowData.originalPrice;
            var html = "";
            if (originalPrice !=undefined) {
              html += "<span data='" + originalPrice + "'>"+originalPrice/100+"</span>";
            } else {
              html += "<span data='" + originalPrice + "'>-</span>";
            }
            return html;
          }
        },{
          field: "realPrice",
          title: "优惠价",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var realPrice = rowData.realPrice;
            var html = "";
            if (realPrice !=undefined) {
              html += "<span data='" + realPrice + "'>"+realPrice/100+"</span>";
            } else {
              html += "<span data='" + realPrice + "'>-</span>";
            }
            return html;
          }
        },{
          field: "saleStatus",
          title: "专辑状态",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true,
          formatter: (rowData, rowIndex, pagingIndex, field) => {
            var saleStatus = rowData.saleStatus;
            var html = "";
            if (saleStatus == 9) {
              html += "<span data='9'>停售</span>";
            } else if (saleStatus == 1) {
              html += "<span data='1'>在售</span>";
            }else{
               html += "<span data='免费'>-</span>";
            }
            return html;
          }
        },
        {
          field: "orderNum",
          title: "订阅人数",
          width: 167,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "custome-adv",
          title: "操作",
          width: 230,
          titleAlign: "center",
          columnAlign: "center",
          componentName: "tableOpa",
          isResize: true
        }
      ],
      tipData: null,
      downVideoId: "",
      downDateIndex: 0
    };
  },
  methods: {
    //点击操作内容触发事件
    customCompFunc(params) {
      if (params.type === "edit") {
        //编辑后上传
        this.$router.push({
          path: "/audioaddalbum",
          query: {
            uploadType: 2,
            typeOneName: params.rowData.typeVoOne.name,
            typeTwoName: params.rowData.typeVoTwo.name,
            typeOneId: params.rowData.typeVoOne.id,
            typeTwoId: params.rowData.typeVoTwo.id,
            albumId: params.rowData.id,
            albumPic: params.rowData.pic,
            albumName: params.rowData.title,
            albumDesc: params.rowData.referral,
            mian_fu:params.rowData.albumType,
            courseInfo:params.rowData.courseInfo,
            lecturerInfo:params.rowData.lecturerInfo,
            coursePic:params.rowData.coursePic
            // labelList: JSON.stringify(params.rowData.labelList)
            // labelList: []
          }
        });
      } else if (params.type === "discharge") {
        //下架
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "是否确定下架该专辑？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audioalbumdownFn({ albumId: this.downVideoId }) //下架接口
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
      } else if (params.type === "upcharge") {
        //上架
        //请求上架接口
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "是否确定上架该专辑？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audioalbumupFn({ albumId: this.downVideoId }) //上架接口
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
      } else if (params.type === "delete") {
        //删除专辑
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "是否确定删除该专辑？"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .audioalbumdeleteFn({ albumId: this.downVideoId }) //删除接口
              .then(response => {
                if (response.status == 200) {
                  var data = response.data;
                  if (data.state == 0) {
                    this.$delete(this.tableData, this.downDateIndex);
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
        this.downDateIndex = params.index;
      }else if (params.type === "stop") {
        //停售
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "确定停售该专辑吗？<br>停售后用户不可进行购买"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .saleStatuFn(qs.stringify({albumId:this.downVideoId,saleStatus:9})) //停售
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
        this.downDateIndex = params.index;
      }else if (params.type === "recovery") {
        //恢复销售
        this.$store.commit("layer/updateTipData", {
          showbox: "pattern-1",
          con: "确定恢复销售该专辑吗？<br>恢复销售后该专辑用户可以进行购买"
        });
        this.$store.commit(
          "layer/setSuccessCall",
          function() {
            api
              .saleStatuFn(qs.stringify({albumId:this.downVideoId,saleStatus:1})) //恢复销售
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
        this.downDateIndex = params.index;
      } else {
        let param = {
          albumId: params.rowData.id,
          type:params.rowData.albumType
        };
        this.$router.push({ name: "audioalbumsee", query: param });
      }

    },
     /**
     * 根据一级分类id获取二级分类
     */
    dataTwoFn() {
      //@change="dataTwoFn"  一级分类change时触发
      this.selectedTwo = "";
      this.labelList2 = [];
      if (this.selectedOne == "") {
        return false;
      }
      this.labelList.map(item => {
        if (this.selectedOne == item.id) {
          this.labelList2 = item.sonTypeVos;
        }
      });
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
      api
        .audioAlbumListFn({
          //音频专辑列表接口
          size: 20,
          page: this.activePage,
          typeOne: this.selectedOne, //一级分类
          typeTwo: this.selectedTwo, //二级分类
          sort: this.selectedRank, //排序
          albumType:this.albumType,//专辑类型
          startDate:
              this.$store.state.dateTime.start !== "Invalid DateTime"
                ? this.$store.state.dateTime.start
                : "", //开始时间
          endTime:
              this.$store.state.dateTime.end !== "Invalid DateTime"
                ? this.$store.state.dateTime.end
                : "" //结束时间
        })
        .then(response => {
          if (response.status == 200) {
            var data = response.data;
            if (data.state == 0) {
              this.tableData = data.content.list;
              this.tableData.map(item=>{
                  item.pic = this.$fun.getUrlVerify(item.pic)
              })
              this.pageNum = data.content.pages;
              this.activePage = data.content.pageNum;
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
    this.$store.dispatch("tableOpa/updateOpaList", [
      {
        content: "查看",
        style: { color: "#4d9dfc" },
        type: "see",
        permissFlag: "audioalbum"
      },
      {
        content: "下架",
        style: { color: "#4d9dfc" },
        type: "discharge",
        permissFlag: "audioalbum"
      },
      {
        content: "上架",
        style: { color: "#4d9dfc" },
        type: "upcharge",
        permissFlag: "audioalbum"
      },
      {
        content: "编辑",
        style: { color: "#4d9dfc" },
        type: "edit",
        permissFlag: "audioalbum"
      },
      {
        content: "删除",
        style: { color: "#cc0000" },
        type: "delete",
        permissFlag: "audioalbum"
      },
      {
        content: "停售",
        style: { color: "#4d9dfc" },
        type: "stop",
        permissFlag: "audioalbum"
      },
      {
        content: "恢复销售",
        style: { color: "#4d9dfc" },
        type: "recovery",
        permissFlag: "audioalbum"
      }
    ]);
    /**
     * 获取一级分类
     */
    api
      .audioClassificationFn() //获取一级分类接口
      .then(response => {
        if (response.status == 200) {
          var data = response.data;
          if (data.state == 0) {
            this.labelList = data.content;
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
.szpx{width:160px; height:30px; line-height:30px; border:1px solid #d2d2d2;}
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
.tip-content-msg-one{
    @include basefont(16px, 20px, #333333,center);
    margin-top: 80px;
    margin-bottom: 65px;
    text-align: left;
    margin-left: 80px;
    .boxText{
        margin-bottom:20px;
    }
}
.tip-content-msg-one-select{
    border:1px solid black;
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
.twoBox {
  float: left;
  margin-top: 15px;
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
    @include basebox(120px, 28px, #fff, 1px solid #d6d6d6);
    box-sizing: border-box;
  }
}
.ok-btn {
  float: left;
  margin-left: 20px;
  @extend .btn;
}
.time-show-float {
  float: left;
  margin-left: 20px;
  margin-top: -3px;
}
.cleaars {
  clear: both;
  width: 100%;
  margin-top: 15px;
}
</style>

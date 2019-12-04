<template>
  <div>
    <p class="go-back-btn" @click="$router.go(-1);">{{dataObj.uploadType == 2?'编辑专辑':'新建专辑'}}</p>
    <div class="fill-content">
      <div class="video-classify-show-box" v-if="dataObj.uploadType != 2">
        <p class="m-img-text-title" style="margin-top: 12px;">
          <span>*</span>一级分类：
        </p>
        <div class="select-warp2">
          <select v-model="typeOneId" @change="dataOneFn">
            <option value>请选择一级分类</option>
            <option v-for="item in labelList" :value="item.id">{{item.name}}</option>
          </select>
        </div>
      </div>
      <div class="video-classify-show-box" v-if="dataObj.uploadType != 2">
        <p class="m-img-text-title" style="margin-top: 12px;">
          <span>*</span>二级分类：
        </p>
        <div class="select-warp2">
          <select v-model="typeTwoId" @change="dataTwoFn">
            <option value>请选择二级分类</option>
            <option v-for="item in labelList2" :value="item.id">{{item.name}}</option>
          </select>
        </div>
      </div>
      <div class="video-title-box" v-if="dataObj.uploadType == 2" style="margin-top:15px;">
        <p class="m-img-text-title" style="margin-top: 12px; float:left; text-align:left;">
          <span>*</span>选择分类：
        </p>
        <div class="m-text-box" style="border:none; float:left; margin-left:15px;">
          <p style="float:left; line-height:40px;">
            一级分类：
            <span>{{dataObj.typeOneName}}</span>
          </p>
          <p style="float:left; margin-left:15px; line-height:40px;">
            二级分类：
            <span>{{dataObj.typeTwoName}}</span>
          </p>
        </div>
      </div>
      <div style="clear:both;"></div>
      <select-img :dataObj="dataObj" ref="seleceimg"></select-img>
    </div>
    <layer></layer>
  </div>
</template>

<script>
import api from "@/api/index";
import qs from "qs";
import layer from "@/components/layer";
import selectImg from "@/components/upImage3";
import util from "@/utils/util";
import { UPLOAD_MODIFY_FILE } from "@/utils/constant";
export default {
  data() {
    return {
      albumList: [],
      labelList: [],
      labelList2: [],
      isSave: true,
      typeOneId: "",
      typeTwoId: "",
      albumId: "",
      dataObj: {}
    };
  },
  methods: {
    /**
     * 根据一级分类id获取二级分类
     */
    dataOneFn() {
      //@change="dataTwoFn"  一级分类change时触发
      this.typeTwoId = ''
      this.labelList2 = []
      this.labelList.map(item=>{
          if(item.id == this.typeOneId){
              this.labelList2 = item.sonTypeVos
          }
      })
      this.$refs.seleceimg.reloadChild(this.typeOneId);
    },
    dataTwoFn() {
      this.dataObj.typeTwoId = this.typeTwoId;
      this.$refs.seleceimg.changeTyepTwo(this.typeTwoId);
    },
    //保存
    saveData() {
      if (this.isSave) {
        var storage = window.localStorage;
        var uploadMsg = qs.stringify(storage.getItem("uploadMsg"));
        if (uploadMsg == "") uploadMsg = {};
        var obj = {
          albumId: this.albumId,
          imgRegion: this.$store.state.video.imgRegion,
          videoTitle: this.videoTitle,
          videoRemark: this.videoRemark,
          videoPic: this.videoPic,
          videoId: this.videoId == "" ? "" : this.videoId,
          videoName: this.videoId == "" ? "" : this.videoName
        };
        uploadMsg[this.$route.query.vid] = obj;
        storage.setItem("uploadMsg", qs.stringify(uploadMsg));
      }
      this.$store.commit("video/initVideoState");
      if (util.checkIE()) {
        window.removeEventListener("hashchange", this.saveData, false);
      } else {
        window.removeEventListener("popstate", this.saveData, false);
      }
    }
  },
  components: {
    layer,
    selectImg
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  created() {
    //区分编辑新建
    if (this.$route.query.uploadType == 2) {
      this.dataObj = this.$route.query;
    //   this.dataObj.labelList = JSON.parse(this.$route.query.labelList);
      this.dataObj.labelList = [];
    } else {
      this.dataObj = {
        uploadType: 1,
        labelList: []
      };
      api.audioClassificationFn() //获取一级分类接口
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
    }
  }
};
</script>

<style lang="scss" scoped type="text/css">
.fill-content {
  padding-left: 20px;
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
.video-name-show-box {
  display: flex;
  margin-top: 30px;
  .video-name-show {
    margin-left: 20px;
    @include basefont(16px, 26px, #cc0000);
    background: url("../../images/icon_07.png") no-repeat left center;
    background-size: 32px 26px;
    text-indent: 40px;
    text-decoration: underline;
  }
}
.video-room-show-box {
  display: flex;
  margin-top: 17px;
  .video-room-show {
    margin-left: 20px;
    @include basefont(16px, 26px, #333);
  }
}
.video-classify-show-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 18px;
  .classify-list {
    display: flex;
    margin-left: 20px;
    .classify-item {
      @include basebox(100px, 40px, #fff, 1px solid #999999, 5px);
      @include basefont(16px, 38px, #333);
      text-align: center;
      line-height: 40px;
      margin-right: 40px;
      margin-bottom: 10px;
      user-select: none;
      cursor: pointer;
      &.active {
        border: 1px solid #6ea6f6;
        background: #d7e7ff;
      }
    }
  }
}
.m-img-text-title {
  white-space: nowrap;
  @include basefont(16px, 18px, #333, center);
  text-indent: 10px;
  position: relative;
  margin-top: 6px;
  span {
    color: #cc0000;
    position: absolute;
    top: 2px;
    left: -10px;
  }
}
.btn-list {
  display: flex;
  margin-left: 46px;
  padding: 37px 218px;
  p {
    @include basebox(120px, 46px, #fff, 1px solid #4d9dfc, 5px);
    box-sizing: border-box;
    @include basefont(16px, 44px, #4d9dfc, center);
    margin-right: 70px;
  }
  .up-cancel {
    cursor: pointer;
  }
  .up-submit {
    background: #999999;
    border-color: #999999;
    color: #fff;
    &.yes {
      background: #4d9dfc;
      border-color: #4d9dfc;
      cursor: pointer;
    }
  }
}
.emphasize-content-box {
  padding-top: 23px;
  padding-left: 30px;
  padding-bottom: 20px;
  .title {
    @include basefont(16px, 28px, #cc0000, left);
  }
  .content {
    @include basefont(14px, 28px, #333, left);
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
</style>

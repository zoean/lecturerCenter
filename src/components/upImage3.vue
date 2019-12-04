<template>
  <div class="img-text-wrap">
    <div class="img-select-big-box" style="margin-top:20px;">
      <p class="m-img-text-title">
        <span>*</span>专辑封面：
      </p>
      <div class="select-img-warp" style="margin-left:19px;">
        <div class="up-img-box">
          <div class="user-select-img-box">
            <a class="select-img-btn" @click="toggleShow()">选择文件</a>
            <my-upload
              field="img"
              @crop-success="cropSuccess"
              @crop-upload-success="cropUploadSuccess"
              @crop-upload-fail="cropUploadFail"
              v-model="show"
              :width="400"
              :langExt="mLangExt"
              :noCircle="isNoCircle"
              :height="400"
              url="/audio/interface/file/upload.audio"
              :params="params"
              :maxSize="1024"
              :headers="headers"
              img-format="png"
            ></my-upload>
          </div>
        </div>
        <!-- 上传后回显图片 -->
        <img :src="imgDataUrl" class="user-up-img-show" v-if="imgDataUrl!=''">
        <p class="up-img-tip">
          请上传正方形图片，否则显示会有变形。支持上传JPG、JPEG、PNG文件,图片尺寸需大于400像素，
          <br>文件大小在500kb以内，最大支持1MB以内
        </p>
      </div>
    </div>
    <div class="video-title-box">
      <p class="m-img-text-title" style="margin-top: 12px;">
        <span>*</span>专辑标题：
      </p>
      <div class="m-text-box">
        <input type="text" class="title-input" v-model="videoTitle">
        <p class="charact-limit">
          <span class="current">{{currentTitleLen}}</span>
          <span class="maximal">/{{inputLimit}}</span>
        </p>
      </div>
    </div>
    <div class="video-synopsis-box">
      <p class="m-img-text-title">
        <span></span>
        <span>*</span>专辑简介：
      </p>
      <div class="m-textarea-box">
        <textarea
          class="synopsis-textarea"
          v-model="videoRemark"
          placeholder="专辑简介，能帮助用户快速了解内容，增加用户观看概率！字数限制100字"
        ></textarea>
        <p class="charact-limit">
          <span class="current">{{currentSynopsisLen}}</span>
          <span class="maximal">/{{textareaLimit}}</span>
        </p>
      </div>
    </div>
    <div class="img-select-big-box">
      <p class="m-img-text-title">
        <span>*</span> 选择标签：
      </p>
      <GeminiScrollbar class="default-img-warp" style="margin-top:0;">
        <ul class="video-screenshot" style="padding: 0px 18px 0 18px;">
          <li
            class="selectLi"
            v-for="(item,key) in defaultImgs"
            :class="{active:defaultImgsSelect.indexOf(item.id) != -1}"
            @click="selectImg(3,key,item)"
            :key="key"
          >
            <button type="button" class="selectBtn">{{item.name}}</button>
            <span class="select-icon"></span>
          </li>
        </ul>
      </GeminiScrollbar>
    </div>
    <div class="tableText">最多选择2个标签</div>
    <div class="btn-list">
      <p class="up-cancel" @click="cancelFn">取消</p>
      <p
        class="up-submit"
        :class="{yes: isYes}"
        @click="saveData"
      >{{dataObj.uploadType == 2?'保存':'创建'}}</p>
    </div>
    <layer></layer>
  </div>
</template>

<script>
import defaultImg from "../images/defaultImg.png";
import myUpload from "@/plugin/vue-image-crop-upload/upload-2";
import api from "@/api/index";
import qs from "qs";
import layer from "@/components/layer";
export default {
  props: {
    dataObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
        typeTwoId:'',
              defaultImgs: [],
      defaultImgsSelect: [],
      show: false,
      params: {
        token: "123456798",
        name: "avatar"
      },
      headers: {
        smail: "*_~"
      },
      isNoCircle: true,
      mLangExt: {
        preview: "封面预览"
      },
      imgDataUrl: "",
      videoTitle: "",
      videoRemark: "",
      inputLimit: 30,
      textareaLimit: 100
    };
  },
  components: {
    "my-upload": myUpload,
    layer
  },
  computed: {
    isYes() {
      if (this.dataObj.uploadType == 2) {
        if (
          this.imgDataUrl != "" &&
          this.videoTitle != "" &&
          this.videoRemark != "" &&
          this.defaultImgsSelect.length > 0 &&
          this.videoRemark != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          this.imgDataUrl != "" &&
          this.videoTitle != "" &&
          this.videoRemark != "" &&
          this.defaultImgsSelect.length > 0 &&
          this.dataObj.typeOneId &&
          this.typeTwoId &&
          this.videoRemark != ""
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    /**
     * 计算文字限制
     */
    currentTitleLen() {
      var len = this.videoTitle.length;
      if (len > this.inputLimit) {
        // this.$store.dispatch('video/updateVideoTitle',this.$store.state.video.videoTitle.substring(0, this.inputLimit));
        this.videoTitle = this.videoTitle.substring(0, this.inputLimit);
        return this.inputLimit;
      } else {
        return len;
      }
    },
    /**
     * 计算文字限制
     */
    currentSynopsisLen() {
      var len = this.videoRemark.length;
      if (len > this.textareaLimit) {
        // this.$store.dispatch('video/updateVideoRemark',this.$store.state.video.videoRemark.substring(0, this.textareaLimit));
        this.videoRemark = this.videoRemark.substring(0, this.textareaLimit);
        return this.textareaLimit;
      } else {
        return len;
      }
    }
  },
  methods: {
    //请求标签集合
    reloadLbel() {
      api
        .audioalbumlabelFn({ typeId: this.dataObj.typeOneId })
        .then(response => {
          if (response.status == 200) {
            var data = response.data;
            if (data.state == 0) {
              this.defaultImgs = data.content;
            }
          } else {
            this.$store.commit("layer/updateTipData", {
              showbox: "pattern-2",
              con: [{ msg: data.message }]
            });
            this.$store.dispatch("layer/show");
          }
        })
        .catch(err => {});
    },
    //重置标签集合
    reloadChild(typeOneId) {
      this.dataObj.typeOneId = typeOneId;
      this.dataObj.typeTwoId = '';
      this.defaultImgsSelect = [];
      this.reloadLbel();
    },
    changeTyepTwo(id){
        this.dataObj.typeTwoId = id;
        this.typeTwoId = id;//动态控制创建按钮显示
    },
    //返回
    cancelFn() {
      this.$router.go(-1);
    },
    //保存
    saveData() {
      if (!this.isYes) {
        return;
      }
      this.$store.commit("layer/updateTipData", {
        showbox: "pattern-1",
        con: "是否确认保存？"
      });
      this.$store.dispatch("layer/show");
      this.$store.commit("layer/setSuccessCall", this.getSelectImgData);
    },
    //保存
    getSelectImgData() {
      let params = {
        typeOne: this.dataObj.typeOneId,
        typeTwo: this.dataObj.typeTwoId,
        title: this.videoTitle,
        pic: this.imgDataUrl,
        referral: this.videoRemark,
        labelIds: this.defaultImgsSelect.join(",")
      };
      if (this.dataObj.uploadType == 2) {
        params.id = this.dataObj.albumId;
      }
      api
        .audioalbumeditsaveFn(qs.stringify(params))
        .then(response => {
          if (response.status == 200) {
            this.$store.commit("layer/updateTipData", {
              showbox: "pattern-2",
              con: [{ msg: "专辑保存成功" }]
            });
            this.$store.dispatch("layer/show");
            this.$router.go(-1);
          } else {
            this.$store.commit("layer/updateTipData", {
              showbox: "pattern-2",
              con: [{ msg: data.message }]
            });
            this.$store.dispatch("layer/show");
          }
        })
        .catch(err => {});
    },
    toggleShow() {
      this.show = !this.show;
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      //   console.log(imgDataUrl)
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      this.imgDataUrl = jsonData;
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    },
    /**
     * 选择封面图
     * @DateTime 2018-08-01
     * @param    {[type]}   boxNumber 区域
     * @param    {[type]}   index     在该区域位置
     * @param    {[type]}   imgUrl    地址
     */
    selectImg(boxNumber, index, item) {
      if (this.defaultImgsSelect.indexOf(item.id) == -1) {
        if (this.defaultImgsSelect.length >= 2) {
          return;
        } else {
          this.defaultImgsSelect.push(item.id);
          this.dataObj.labelList.push(item);
        }
      } else {
        this.defaultImgsSelect.splice(
          this.defaultImgsSelect.indexOf(item.id),
          1
        );
        this.dataObj.labelList.splice(index, 1);
      }
    }
  },
  mounted() {
    if (this.dataObj.uploadType == 2) {
      this.imgDataUrl = this.dataObj.albumPic;
      this.videoTitle = this.dataObj.albumName;
      this.videoRemark = this.dataObj.albumDesc;
      this.defaultImgsSelect = this.dataObj.labelList.map(item => {
        return item.id;
      });
      this.reloadLbel()
    }
  }
};
</script>

<style lang="scss" scoped type="text/css">
.tableText {
  font-size: 12px;
  color: red;
  margin-left: 120px;
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
.vicp-step3 {
  margin-top: 20px;
}
.img-select-big-box
  .vue-image-crop-upload
  .vicp-wrap
  .vicp-step1
  .vicp-drop-area {
  margin-top: 20px;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4 {
  width: 25px;
  height: 25px;
  background: url("../images/closelayer_03.png") no-repeat;
  transition: none;
  &:after {
    content: "";
    width: 0px;
    height: 0px;
  }
  &:before {
    content: "";
    width: 0px;
    height: 0px;
  }
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-close {
  right: 10px;
  top: 15px;
}
.img-select-big-box
  .vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item {
  margin-right: 42px;
}
.img-select-big-box
  .vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range {
  margin: 20px 0 10px 0;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap {
  padding: 35px 30px 20px;
}
.img-select-big-box
  .vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item {
  width: 150px;
}

.vue-image-crop-upload .vicp-wrap .vicp-operate a:hover {
  background: #4d9dfc !important;
  color: #fff !important;
}
.vue-image-crop-upload .vicp-wrap .vicp-operate a {
  background: #4d9dfc !important;
  color: #fff !important;
}
.user-up-img-show {
  width: 140px;
  height: 140px;
  margin-top: 18px;
}
.gm-scrollbar.-vertical {
  top: 13px;
  background: #eeeeee;
}
.gm-scrollbar {
  position: absolute;
  right: 10px;
  bottom: 13px;
  z-index: 1;
  border-radius: 3px;
}
.gm-scrollbar.-vertical .thumb {
  background: #4d9dfc;
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
.charact-limit {
  position: absolute;
  right: 9px;
  bottom: 0px;
  span {
    @include basefont(16px, 38px, #999999, left);
  }
  .current {
  }
  .maximal {
  }
}
.m-textarea-box {
  margin-left: 20px;
  position: relative;
  @include basebox(540px, 212px, #fff, 1px solid #999999, 5px);
  padding: 0 4px;
  overflow: hidden;
  box-sizing: border-box;
  .synopsis-textarea {
    width: 532px;
    height: 100%;
    @include basefont(16px, 38px, #333, left);
    resize: none;
    overflow: auto;
  }
}
.m-text-box {
  margin-left: 20px;
  position: relative;
  @include basebox(540px, 40px, #fff, 1px solid #999999, 5px);
  overflow: hidden;
  box-sizing: border-box;
  .title-input {
    @include basebox(530px, 38px, #fff);
    padding: 0 4px;
    @include basefont(16px, 38px, #333, left);
  }
}
::-ms-clear,
::-ms-reveal {
  display: none;
}
.video-title-box,
.video-synopsis-box {
  display: flex;
  margin-bottom: 25px;
}
.img-select-big-box {
  display: flex;
  .select-img-warp {
    .up-img-box {
      display: flex;
      align-items: center;
      @extend .clear;
      .select-img-btn {
        @extend .btn;
        background: none;
        color: #5ca5fc;
        margin-right: 25px;
        display: block;
        border: 1px solid #5ca5fc;
      }
    }
    .up-img-tip {
      margin: 15px 0 20px 0px;
      @include basefont(14px, 16px, #a0a0a0, left);
    }
    .zdy-select-img-box {
      margin-top: 16px;
      margin-bottom: 16px;
      padding-left: 15px;
    }
  }
  .subcontent-title {
    display: flex;
    @include basefont(14px, 16px, #333, left);
    text-indent: 6px;
    text-align: right;
    &.active {
      span {
        border: 1px solid #5ca5fc;
        &:after {
          background: #5ca5fc;
        }
      }
    }
    span {
      position: relative;
      width: 14px;
      height: 14px;
      border: 1px solid #9c9c9c;
      border-radius: 50%;
      &:after {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        content: " ";
      }
    }
  }
  .video-screenshot {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 98px;
      height: 38px;
      box-sizing: border-box;
      position: relative;
      margin-right: 20px;
      margin-bottom: 14px;
      border-radius: 3px;
      border: 1px solid #999999;
      .selectBtn {
        width: 98px;
        height: 33px;
        background: none;
        text-align: center;
        line-height: 38px;
        border-radius: 3px;
        border: none;
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .select-icon {
        display: none;
      }
      &.active {
        border: 1px solid #6ea6f6;
        background: #d7e7ff;
      }
    }
  }
  .default-img-warp {
    @include basebox(822px, 216px, #fff, 1px solid #fff, 5px);
    box-sizing: border-box;
  }
}
</style>

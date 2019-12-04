<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>

    <form action="">
      <input type="file" name="file" id="files" multiple @change="addFile"/>
    </form>
    <input type="button" value="开始上传" @click="star">
  </div>
</template>

<script>
// import '../../static/lib/aliyun-oss-sdk4.13.2.min.js'
// import '../../static/aliyun-upload-sdk1.3.1.min.js'
// import '../../static/lib/es6-promise.min.js'
// require('static/lib/aliyun-oss-sdk4.13.2.min.js')
// require('static/aliyun-upload-sdk1.3.1.min.js')
// require('static/lib/es6-promise.min.js')
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      uploader: null
    }
  },
  methods:{
      addFile(event){
        // console.log(event.target.files);
        this.uploader.addFile(event.target.files[0], null, null, null, '{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}');
      },
      star(){
        this.uploader.startUpload();
      }
  },
    created(){
      var that = this;
      const videoId = "e72d651490d94ca5a4b57226449d8f3d",
            uploadAddress ="eyJFbmRwb2ludCI6Imh0dHBzOi8vb3NzLWNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbSIsIkJ1Y2tldCI6Im91dGluLWIzZDM0OTZmNmEyNjExZThiYTgzMDAxNjNlMWM3NDI2IiwiRmlsZU5hbWUiOiJjdXN0b21lclRyYW5zLzEyNTlmYjRhNTYyNjUzNGMwMTk0MThkM2JhOTcwNGE3LzJkYzNkMTgwLTE2NGM1Y2VlMjlkLTAwMDQtYTdiYy01NTktMGUxNjMubW92In0=",
            uploadAuth = "eyJTZWN1cml0eVRva2VuIjoiQ0FJUzJ3UjFxNkZ0NUIyeWZTaklyNG56TyttTW5wVjE1L0hZYkhQQmlWY1lmK0ZkanJiU3J6ejJJSGhKZVhOdkJPMGV0ZjQrbVdCWTdQY1lsclVxRU1ZZEhoYWJONUFndHNVT3FGditKcGZadjh1ODRZQURpNUNqUWJaWjlNWmZtSjI4V2Y3d2FmK0FVQXJHQ1RtZDVNZ1lvOWJUY1RHbFFDWnVXLy90b0pWN2I5TVJjeENsWkQ1ZGZybC9MUmRqcjhsbzF4R3pVUEcyS1V6U24zYjNCa2hsc1JZZTcyUms4dmFIeGRhQXpSRGNnVmJtcUpjU3ZKK2pDNEM4WXM5Z0c1MTlYdHlwdm9weGJiR1Q4Q05aNXo5QTlxcDlrTTQ5L2l6YzdQNlFIMzViNFJpTkw4L1o3dFFOWHdoaWZmb2JIYTlZcmZIZ21OaGx2dkRTajQzdDF5dFZPZVpjWDBha1E1dTdrdTdaSFArb0x0OGphWXZqUDNQRTNyTHBNWUx1NFQ0OFpYVVNPRHREWWNaRFVIaHJFazRSVWpYZEk2T2Y4VXJXU1FDN1dzcjIxN290ZzdGeXlrM3M4TWFIQWtXTFg3U0IyRHdFQjRjNGFFb2tWVzRSeG5lelc2VUJhUkJwYmxkN0JxNmNWNWxPZEJSWm9LK0t6UXJKVFg5RXoycExtdUQ2ZS9MT3M3b0RWSjM3V1p0S3l1aDRZNDlkNFU4clZFalBRcWl5a1QwY0ZncGZUSzFSemJQbU5MS205YmFCMjUvelcrUGREZTBkc1Znb1hWTDdwaUdXRzNSTE5uK3p0Sjl4YmtlRStzS1V4dmZBcU04eFRnVnc3NG9CVkZpSUlkeGsvd2MrdS9Mc3RCbksrN0MvQ0M3dDlYY2o1dDdkOHBOejgwSmlaYkRtb1pmTDRtR0U0eVROTy9aandaZVBDRHd4ZTNudEpTd2xtc0wxcjJrY3VoVU1uMXV6UHhzaThGbUwzUTZ5QnBaRGo2SFJtUzRaV3Z3SnlMbUlHMjN4cEg4Y0lOYUk4cXNOWitSdVIrbEhTYzJneGp0dXd2RDNaNVExQjB0RUYzMGFnQUVaekdEVXpVaGs4WHZJbEJpanllVmNVSmkxaXVLWjM2NmpONDcyYUJCQVlEaUIycEF0ZUpYbUViTGp5WVBDZjJPUVhMYjBDZ2FaVU9Zb3RjdThsYkYvMExXSG9iYmZ4Vlg5ZGtwOFNuRmFuZVFnSEJ4Q0U2OVRPcnpDb1pKYlVyY1FPalRIN3prTkNOOU5nTGFINVhiMUpoVzBkb3YyOHlWSmJSeFdjeUc3UUE9PSIsIkFjY2Vzc0tleUlkIjoiU1RTLk5KRnBTOHNKVFAzM25VcG1XTXNucWFzeU0iLCJBY2Nlc3NLZXlTZWNyZXQiOiI1RkVkcnlmZmdiTkszdVdpUTNnNXdTQUo1YncxYTFBYnlhazZpdkFyTmJobSIsIkV4cGlyYXRpb24iOiIzNjAwIn0=";
      this.uploader = new AliyunUpload.Vod({
           //分片大小默认1M，不能小于100K
           partSize: 1048576,
           //并行上传分片个数，默认5
           parallel: 5,
           //网络原因失败时，重新上传次数，默认为3
           retryCount: 3,
           //网络原因失败时，重新上传间隔时间，默认为2秒
           retryDuration: 2,
          // 开始上传
          'onUploadstarted': function (uploadInfo) {
            console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
              if(!uploadInfo.videoId)//这个文件没有上传异常
              {
                //实际环境中调用调用点播的获取上传凭证接口
                that.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
              }
              else//如果videoId有值，根据videoId刷新上传凭证
              {
                //实际环境中调用点播的刷新上传凭证接口，获取凭证
                that.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
              }
          },
          // 文件上传成功
          'onUploadSucceed': function (uploadInfo) {
            console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
          },
          // 文件上传失败
          'onUploadFailed': function (uploadInfo, code, message) {
            console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
          },
          // 文件上传进度，单位：字节
          'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
              console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
          },
          // 上传凭证超时
          'onUploadTokenExpired': function (uploadInfo) {
              console.log("onUploadTokenExpired");
              that.uploader.resumeUploadWithAuth(uploadAuth);
              //上传方式1  实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
              // uploader.resumeUploadWithAuth(uploadAuth);
              // 上传方式2 实现时，从新获取STS临时账号用于恢复上传
              // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
          },
          //全部文件上传结束
          'onUploadEnd':function(uploadInfo){
                    console.log("onUploadEnd: uploaded all the files");
           }
      });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

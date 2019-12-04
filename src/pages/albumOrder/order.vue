<template>
    <div>
        <div class="main-table-warp" style="width: 915px;">
            <div class="condition-video-online-warp">
                <div class="room-id" style="margin-top:20px;">
                    <span>订单号：</span>
                    <input type="text" class="bt-void-input" v-model="orderNum">
                </div>
                 <div class="room-id" style="margin-top:20px; margin-left:20px;">
                    <span>用户昵称：</span>
                    <input type="text" class="bt-void-input" v-model="userName">
                </div>
                <div class="room-id" style="margin-top:20px; margin-left:20px;">
                    <span>专辑名称：</span>
                    <input type="text" class="bt-void-input" v-model="albumName">
                </div>
                <div style="clear:both;"></div>
                <div class="room-id" style="margin-top:20px; margin-right:20px;">
                    <span>直播间ID：</span>
                    <input type="text" class="bt-void-input" style="width:100px;" v-model="roomId">
                </div>
                <div class="datecn">
                    <span style="float:left;">购买日期：</span>
                    <dateTime class="time-show-float" ref="dateTime" style="margin-top:1px;"></dateTime><!--购买时间-->
                </div>
               
                <div class="select-warp" style="margin-top:20px;">
                    <span class="slect-tip">平台：</span>
                    <select v-model="selectedPt">
                        <option value="">全部</option>
                        <option value="27">IOS</option>
                        <option value="28">安卓</option>
                    </select>
                </div>
                <div style="clear:both;"></div>
                <div class="select-warp mar-left" style="margin-left:10px;">
                    <span class="slect-tip">排序：</span>
                    <select v-model="selectedRank">
                        <option value="">默认</option>
                        <option value="1">按价格从高到低</option>
                        <option value="0">按价格从低到高</option>
                    </select>
                </div>
                <div class="select-warp">
                    <span class="slect-tip">支付方式：</span>
                    <select v-model="payType">
                        <option value="">全部</option>
                        <option value="1">元宝支付</option>
                        <option value="27">支付宝支付</option>
                        <option value="124">银联快捷支付</option>
                    </select>
                </div>
                <span class="ok-btn" @click="getDate" style="margin-top:-2px;">
                    确定
                </span>
                <span class="ok-btn" @click="downOrder" style="width:140px;margin-top:-2px;">
                    下载订单表格
                </span>   
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
        </div>
        <layer></layer>
    </div>
</template>
<script>
    import api from '@/api/index';
    import layer from "@/components/layer"; //提示弹框组件
     import qs from 'qs';
    import dateTime from "@/components/dataTimes"; //日期组件
    export default{
        components:{
            dateTime,
            layer
        },
        data() {
            return {
               pageNum: 0,
               activePage: 1,
               tableData: [],
                orderNum:'',//订单号
                userName:'',//用户昵称
                albumName:'',//专辑名称
                roomId:'',//直播间id
                selectedPt:'',//平台
                selectedRank:'',//排序
                payType:'',//支付方式
                columns: [
                {
                field: "orderCode",
                title: "序号",
                width: 60,
                titleAlign: "center",
                columnAlign: "center",
                isResize: true,
                formatter: (rowData, rowIndex, pagingIndex, field) => {
                  return "<span>" + (rowIndex + 1) + "</span>";
                }
            },
                    {field: 'orderCode', title:'订单号', width: 150, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'createTime', title: '购买时间', width: 170, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'buyerName', title: '用户昵称', width: 163, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'buyerUid', title: '用户id', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'albumName', title: '专辑标题', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: "albumPic",
                      title: "专辑封面",
                      width: 100,
                      titleAlign: "center",
                      columnAlign: "center",
                      isResize: true,
                      formatter: (rowData, rowIndex, pagingIndex, field) => {
                        return (
                          "<a target='_blank' href='" +
                          rowData.albumPic +
                          "' ><img style='width:80px;height:80px' src='" +
                          rowData.albumPic +
                          "'></a>"
                        );
                      }
                    },
                    {field: 'originalPrice', title: '专辑原价(元)', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true,
                      formatter: (rowData, rowIndex, pagingIndex, field) => {
                        var originalPrice = rowData.originalPrice/100; 
                        return "¥"+originalPrice;
                    }},
                    {field: 'price', title: '实付金额（元）', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true,
                      formatter: (rowData, rowIndex, pagingIndex, field) => {
                        var price = rowData.price;
                        if(rowData.payType!=1){
                            price="¥"+rowData.price/100;
                        }else{
                            price="-";
                        }
                        return price;
                    }},
                    {field: 'price', title: '实付元宝', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true,
                      formatter: (rowData, rowIndex, pagingIndex, field) => {
                        var price = rowData.price;
                        if(rowData.payType==1){//元宝支付不用除以100
                            price=rowData.price;
                        }else{
                            price="-";
                        }
                        return price;
                    }},
                    {field: 'roomId', title: '直播间ID', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'oemid', 
                    title: '平台', 
                    width: 160, 
                    titleAlign: 'center',
                    columnAlign:'center',
                    isResize:true,
                    formatter: (rowData, rowIndex, pagingIndex, field) => {
                        var oemid = rowData.oemid;
                        var html = "";
                        if (oemid == 27) {
                          html += "<span data='" + oemid + "'>IOS</span>";
                        }else {
                          html += "<span data='" + oemid + "'>安卓</span>";
                        }
                        return html;
                      }
                    },
                    {field: 'payType',
                     title: '支付方式', 
                     width: 160, 
                     titleAlign:'center',
                     columnAlign:'center',
                    isResize:true,
                    formatter: (rowData, rowIndex, pagingIndex, field) => {
                        var payType = rowData.payType;
                        var html = "";
                        if (payType == 1) {
                          html += "<span data='" + payType + "'>元宝支付</span>";
                        }else  if (payType == 27){
                          html += "<span data='" + payType + "'>支付宝支付</span>";
                        }else  if (payType == 124){
                          html += "<span data='" + payType + "'>银联快捷支付</span>";
                        }
                        return html;
                      }
                    },
                    {field: 'payStatus', 
                        title: '支付状态', 
                        width: 160, 
                        titleAlign: 'center',
                        columnAlign:'center',
                        isResize:true,
                        formatter: (rowData, rowIndex, pagingIndex, field) => {
                            var payStatus = rowData.payStatus;
                            var html = "";
                            if (payStatus == 0) {
                              html += "<span data='" + payStatus + "'>待支付</span>";
                            }else if (payStatus == 1) {
                              html += "<span data='" + payStatus + "'>未支付</span>";
                            }else  if (payStatus == 2){
                              html += "<span data='" + payStatus + "'>已支付</span>";
                            }else  if (payStatus == 3){
                              html += "<span data='" + payStatus + "'>支付失败</span>";
                            }else  if (payStatus == 4){
                              html += "<span data='" + payStatus + "'>已退款</span>";
                            }
                            return html;
                          }
                    }    
                ],
                downDateIndex:0,
            }
        },
        methods:{
            //行点击回调
            rowClickBack(rowIndex, rowData, column){
                if(column.field == 'albumId'){
                    let param = {
                        albumId:rowData.albumId
                    }
                    this.$router.push({name:'details',query:param})
                }
            },
            pagechange(arg){
                this.activePage = arg;
                this.getDate();
            },
            columnCellClass(rowIndex,columnName,rowData){
                if(columnName == "hobby"){
                    return 'title-cell-class-name';
                }
            },
            customCompFunc(){

            },
            downOrder(){
                var html="";
                var d1=this.$store.state.dateTime.start !== "Invalid DateTime"? this.$store.state.dateTime.start:"";
                var d2=this.$store.state.dateTime.end !== "Invalid DateTime"? this.$store.state.dateTime.end:""
                html+="orderCode="+ this.orderNum+"&";
                html+="buyerName="+this.userName+"&";
                html+="albumName="+this.albumName+"&";
                html+="roomId="+this.roomId+"&";
                html+="b3="+this.selectedRank+"&";
                html+="oemid="+this.selectedPt+"&";
                html+="payType="+this.payType+"&";
                html+="d1="+d1+"&";
                html+="d2="+d2;
                if(this.tableData.length==0){
                    this.$store.commit("layer/updateTipData", {
                        showbox: "pattern-2",
                         con: [{ msg:'暂无订单可下载'}]
                      });
                      this.$store.dispatch("layer/show");
                }else{
                    
                    window.location.href=this.$fun.getUrlVerify("http://user.ggcj.com/video/order/export.video?")+html;
                }
                     
            },
            getDate() {
              api
                .albumOrderFn(
                  qs.stringify({
                    //视频专辑列表接口
                    pageSize: 20,
                    pageNum: this.activePage,
                    orderCode: this.orderNum, //订单编号
                    buyerName: this.userName, //用户昵称
                    albumName: this.albumName, //专辑标题
                    roomId:this.roomId,//直播间id
                    i1:this.selectedRank, //排序
                    oemid:this.selectedPt,//平台
                    payType:this.payType,//支付方式
                    d1:
                        this.$store.state.dateTime.start !== "Invalid DateTime"
                        ? this.$store.state.dateTime.start
                        : "", //开始时间
                    d2:
                        this.$store.state.dateTime.end !== "Invalid DateTime"
                        ? this.$store.state.dateTime.end
                        : "" //结束时间
                  })
                )
                .then(response => {
                  if (response.status == 200) {
                    var data = response.data;
                    if (data.state == 0) {
                      this.tableData = data.content.list;
                      this.tableData.map(item=>{
                            item.albumPic = this.$fun.getUrlVerify(item.albumPic)
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
        created(){
            this.getDate();
        }
    };
</script>
<style lang="scss" type="text/css">
    .datecn{
        float:left; 
        margin-top:20px; 
        margin-right:20px;
   
    }
    .v-table-header-row{
        background-color: #f2f2f2;
        div{
            span{
                color:#4d9dfc;
            }
        }
    }
    .video-record-warp{
        display: flex;
        padding: 35px 40px 40px;
        border-bottom: 1px solid #d2d2d2;
        .record-item{
            flex:1;
            p{
                @include basefont(18px, 20px, #333,center);
                span{
                    @include basefont(24px, 26px, #cc0000);
                }
            }
        }
    }
    .condition-video-online-warp{
        @extend .clear;
        margin-bottom: 23px;
        margin-top: 22px;
        .time-show-float{
            float: left;

        }
        .room-id{
            float: left;
            font-size: 0;
            margin-left: 22px;
            span{
                @include basefont(16px, 28px, #333);
            }
            input{
                box-sizing: border-box;
                @include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
                @include basefont(16px, 28px, #333);
                padding:0 12px;
                &.bt-void-input{
                    width: 296px;
                }
            }
        }
        .select-warp{
            float: left;
            margin-top: 22px;
            margin-left:-412px;
            @extend .clear;
            &.mar-left{
                margin-left: -200px;
                select{
                    width: 140px;
                }
            }
            .select-tip{
                float: left;
                @include basefont(16px, 28px, #333);
            }
            select{
                @include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
                box-sizing: border-box;
            }
        }
        .ok-btn{
            float: right;
            margin-top: -2px;
            @extend .btn;
        }
    }
</style>

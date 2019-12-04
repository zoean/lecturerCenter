<template>
    <div class="container">
        <datetime
                type="datetime"
                v-model="start"
                :max-datetime="end"
                format="yyyy-MM-dd HH:mm:ss"
                :phrases="{ok: '确认', cancel: '取消'}"
        ></datetime>
        <span class="date-tip-text date-tip-text-jj"> 至 </span>
        <datetime
                type="datetime"
                v-model="end"
                :min-datetime="start"
                format="yyyy-MM-dd HH:mm:ss"
                :phrases="{ok: '确认', cancel: '取消'}"
        ></datetime>
    </div>
</template>

  <script>
  import {mapActions,mapState} from 'vuex'
  export default {
    data () {
      return {
        start: "",
        end: ""
      }
    },
    watch:{
      start(newValue, oldValue){
        this.setStartTime(newValue);
      },
      end(newValue, oldValue){
        this.setEndTime(newValue);
      }
    },
    methods:{
      ...mapActions('dateTime',[
        'clear',
        'setStartTime',
        'setEndTime'
        ])
    },
    beforeMount(){
      this.clear();
    },
    mounted(){
      //清空
      var that = this
      $(document).ready(()=>{
        var startdiv = $("<div class='delbtn'>+</div>")
        $('.vdatetime').append(startdiv)
        $('.vdatetime:first .delbtn').click(function(event){
          that.start = ''
        })
        $('.vdatetime:last .delbtn').click(function(event){
          that.end = ''
        })
      })
    }
  }
</script>
<style lang="scss" type="text/css">
    .delbtn{
      position: relative;
      left: 148px;
      bottom: 27px;
      transform: rotate(45deg);
      font-size: 20px;
      display: inline-block;
      cursor:pointer;
    }
     .vdatetime-calendar__month__day--selected > span > span, .vdatetime-calendar__month__day--selected:hover > span > span{
        background: #4d9dfc !important;
     }
     .vdatetime-popup__actions__button{
      color:#4d9dfc !important;
     }
     .vdatetime-time-picker__item--selected{
      color:#4d9dfc !important;
     }
</style>
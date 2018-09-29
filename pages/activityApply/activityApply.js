let app= getApp();
let form,orderParams //存入改变的值
Page({
    data: {
        isPX:app.isPX,
        price:0,
        current:0,
        index:0,
        maxlen:5,
        array: [],
        form:{
           ticketTitle:'请选择票种',
           timeTitle:'请选择时间',
           intervalTitle:'可选时段',
        },
        orderParams:{},
        activityTimeList:[]
    },
    onLoad: function(options) {
      let detail = wx.getStorageSync("applyDetail");
      console.log(detail)
      orderParams = this.data.orderParams
      orderParams.activityId = detail.id
      orderParams.num=1;
      orderParams.activityTicketList = detail.activityTicketList
      this.setData({
        detail: detail,
        orderParams: orderParams
      })
      app.pageTitle("选择票价");
      let arr = [], timeList=[];
      for (let i = 0; i < this.data.maxlen;i++){
        arr.push(i+1)
      } 
      let start = detail.activityTimeList[0].startDate.split(" ")[0],
          end = detail.activityTimeList[0].endDate.split(" ")[0]
      
      for (let i = start; i < end; i++) {
          timeList.push(i)
      }
      console.log(timeList)
      this.setData({
          array:arr,
          activityTimeList: timeList
      })
    },
    checkTicket(e){
       this.data.orderParams.ticketType = e.currentTarget.dataset.index
       this.data.orderParams.ticketName = e.target.dataset.name
       this.data.orderParams.id = e.currentTarget.dataset.id
       this.data.orderParams.price = e.currentTarget.dataset.price
       this.data.orderParams.inid=e.currentTarget.dataset.inid
       this.data.form.ticketTitle = "已选："
       orderParams= this.data.orderParams
       let form = this.data.form
       this.setData({
         orderParams: orderParams,
         form:form,
         current: e.currentTarget.dataset.index
       })
    },
    checkedDate(e){
       let timeType = e.currentTarget.dataset.type
       let time = e.currentTarget.dataset.time
       let form  = this.data.form
       orderParams=this.data.orderParams
       if(timeType=="0"){
         this.data.orderParams.time = e.currentTarget.dataset.time
         this.data.form.timeTitle = "已选："
       }else{
         this.data.orderParams.interval = e.currentTarget.dataset.time
         this.data.form.intervalTitle = "已选："
       }
       this.setData({
          form:form,
          orderParams:orderParams
       })
       console.log(time)
    },
    bindPickerChange(e){
      this.data.orderParams.num = parseInt(e.detail.value) + 1
      orderParams = this.data.orderParams
      this.setData({
        index: e.detail.value,
        orderParams:orderParams
      })
    },
    toApplyPerson(e) {
      wx.setStorageSync("orderParams", this.data.orderParams);
       wx.navigateTo({
         url: '/pages/applyPerson/applyPerson',
       })
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})
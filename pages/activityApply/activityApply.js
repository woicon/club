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
        orderParams:{}
    },
    onLoad: function(options) {
      let detail = wx.getStorageSync("applyDetail");
      orderParams = this.data.orderParams
      orderParams.activityId = detail.id
      orderParams.num=1;
      this.setData({
        detail: detail,
        orderParams: orderParams
      })
      app.pageTitle("选择票价");
      let arr = [];
      for (let i = 0; i < this.data.maxlen;i++){
        arr.push(i+1)
      }
      this.setData({
          array:arr
      })
    },
    checkTicket(e){
       this.data.orderParams.ticketType = e.currentTarget.dataset.index;
       this.data.orderParams.ticketName = e.target.dataset.name;
       this.data.form.ticketTitle = "已选：";
       orderParams= this.data.orderParams;
       let form = this.data.form;
       this.setData({
         orderParams: orderParams,
         form:form
       })
    },
    checkedDate(e){
       let timeType = e.currentTarget.dataset.type;
       let form  = this.data.form;
       orderParams=this.data.orderParams;
       if(timeType=="0"){
         this.data.orderParams.time = e.currentTarget.dataset.time;
         this.data.form.timeTitle = "已选：";
       }else{
         this.data.orderParams.interval = e.currentTarget.dataset.time;
         this.data.form.intervalTitle = "已选：";
       }
      this.setData({
         form:form,
         orderParams:orderParams
      })
    },
    bindPickerChange(e){
      this.data.orderParams.num = parseInt(e.detail.value) + 1;
      orderParams = this.data.orderParams;
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
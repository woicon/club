// pages/applySuccess/applySuccess.js
let app = getApp()
Page({
  data: {
    ticketName: '免费票',
    ticketPrice: 0,
    ticketNum: 1,
    userName: '',
    userPhone: '',
    id:'',
    activityId:'',
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ]
  },
  onLoad: function (option) {
    let form =wx.getStorageSync("form");
    this.setData({
       ticketName: form.ticketName,
       ticketPrice:form.orderPrice,
       ticketNum: form.ticketCount,
       userName:form.contactsName,
       userPhone:form.contactsPhone,
       id:option.id,
       activityId: form.activityId
    })
  },
  lookOrder(){
    if(this.data.id!=undefined){
      wx.navigateTo({
        url: `/pages/memberOrderDetail/memberOrderDetail?orderId=${this.data.id}&activityId=${this.data.activityId}`,
      })
    }
  },
  continues(){
    console.log("a")
    wx.switchTab({
       url:`/pages/index/index`
    })
  },
  callBuiness(){
    if(this.data.id!=undefined){
      app.api.myOrderDetail({ orderId: this.data.id}).then((res) => {
          if(res.status==200 && res.msg=="OK"){
              wx.makePhoneCall({
                phoneNumber: res.data.contactsPhone
              })
          }
      })
    }
  },
})
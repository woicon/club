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
    phone:'',
    ishide:true,
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ]
  },
  onLoad: function (option) {
    let form =wx.getStorageSync("form"),phone,ishide
    if (option.id != undefined) {
      app.api.myOrderDetail({ orderId: option.id }).then((res) => {
        if (res.status == 200 && res.msg == "OK") {
           phone = res.data.merchantPhone
        }
      })
    }
    if (phone == null) { ishide = false }
    this.setData({
      ticketName: form.ticketName,
      ticketPrice: form.orderPrice,
      ticketNum: form.ticketCount,
      userName: form.contactsName,
      userPhone: form.contactsPhone,
      id: option.id,
      activityId: form.activityId,
      phone: phone,
      ishide:ishide
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
    wx.switchTab({
       //url: `/pages/activityDetails/activityDetails?id=${this.data.activityId}`,
       url:`/pages/index/index`
    })
  },
  callBuiness(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  }
})
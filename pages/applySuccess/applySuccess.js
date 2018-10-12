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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let form =wx.getStorageSync("form");
    console.log(form)
    console.log(option)
    this.setData({
       ticketName: form.ticketName,
       ticketPrice:form.orderPrice,
       ticketNum: form.ticketCount,
       userName:form.contactsName,
       userPhone:form.contactsPhone,
       id:option.id,
       acticityId:form.acticityId
    })
    console.log(this.data.id)
  },
  detail(){
     wx.navigateTo({
       url:`/pages/memberOrderDetail/memberOrderDetail?orderId=${this.data.id}&activityId=${this.data.acticityId}`,
     })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
var api = require('../../newApi/newApi.js')
let app = getApp()
console.log(app)
Page({
    data: {

    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '报名列表',
        })
        let parmas = {
            page:1,
            size:40,
            activityId: options.activityId,
          //  nameOrPhone:null
        }
        app.api.getActivityOrderEnrollList(parmas,"POST")
        .then(res=>{
            console.log(res)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
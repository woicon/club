let app= getApp()
Page({

    data: {
        isPX:app.isPX,
        price:0,
    },

    onLoad: function(options) {
        this.setData({
            detail: wx.getStorageSync("applyDetail")
        })
        app.pageTitle("选择票价")
    },
    toApplyPerson(){
        wx.navigateTo({
            url: '/pages/applyPerson/applyPerson',
        })
    },
    checkTicket(e){
        console.log(e)
    },
    checkDate(e){

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
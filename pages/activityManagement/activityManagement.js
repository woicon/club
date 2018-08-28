Page({
    data: {

    },
    onLoad: function(options) {
        this.setData({
            detail: wx.getStorageSync("actManagement")
        })
        wx.setNavigationBarTitle({
            title: this.data.detail.activityName,
        })
    },
    toUrl(e, url) {
        wx.navigateTo({
            url: `${url}?activityId=${e.currentTarget.dataset.id}&merchantId=${e.currentTarget.dataset.mid}`
        })
    },
    toShare(e) {
        console.log(e)
        this.toUrl(e, "/pages/activityShare/activityShare")
    },
    enrollList(e) {
        this.toUrl(e, "/pages/activityOrderEnrollList/activityOrderEnrollList")
    },
    orderList(e){
        this.toUrl(e, "/pages/activityOrderList/activityOrderList")
    },
    toDetail(e){
        this.toUrl(e, "/pages/detail/detail")
    },
    onReady: function() {

    },
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
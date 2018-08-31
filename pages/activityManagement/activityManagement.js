let app = getApp()
Page({
    data: {
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        }
    },
    onLoad: function(options) {
        let detail = wx.getStorageSync("actManagement")
        this.setData({
            detail: detail
        })
        wx.setNavigationBarTitle({
            title: this.data.detail.activityName,
        })
        app.api.activityDetail({
            id: detail.id
        }).then((res)=>{
            console.log(res)
            this.setData({
                detail:res.data
            })
        })
    },
    actDetail(){
        
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
        this.toUrl(e, "/pages/activityDetail/activityDetail")
    },
    toEdit(e){
        this.toUrl(e, "/pages/creatActivity/creatActivity")
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
let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            detail:options
        })
        let url = (options.activityId) ? `${app.ext.host}m/${options.merchantId}_1/detail.htm?id=${options.activityId}` : wx.getStorageSync("detailPageUrl")
        console.log("detailHtmlPageUrl===>",url)
        this.setData({
            url: url
        })
    },
    onShareAppMessage(res) {
        return {
            title: this.data.detail.activityName,
            path: `/pages/activityDetail/activityDetail?merchantId=${this.data.detail.merchantId}&activityId=${this.data.detail.activityId}`
        }
    },

})
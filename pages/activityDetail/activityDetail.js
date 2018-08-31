let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        let url = (options.id) ? `${app.ext.host}/m/${options.mid}_1/detail.htm?id=${options.id}` : wx.getStorageSync("detailPageUrl")
        this.setData({
            url: url
        })
    },
    onShareAppMessage(res) {
        // if (res.from === 'button') {
        //     this.setData({
        //         isPublic: null
        //     })
        //     console.log(res.target)
        // }
        // return {
        //     title: this.data.detail.activityName,
        //     path: `/pages/activityDetail/activityDetail?mid=${this.data.detail.merchantId}&id=${this.data.detail.id}`
        // }
    },

})
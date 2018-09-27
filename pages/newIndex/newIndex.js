let app = getApp()
Page({
    data: {
        types:[],
        postType:{},
        pageLoading: true
    },
    onLoad(options) {
        this.setData({
            types: app.types.category,
            postType: app.types.postType
        })
        app.api.posterTemplate({})
            .then(res => {
                console.log(res)
                let post = res.data
                let postIndex = []
                for (let i in post) {
                    postIndex.push(i)
                }
                let selIndex = postIndex[0]
                this.setData({
                    post: post,
                    pageLoading: false
                })
            })
    },
    pay() {
        wx.requestPayment({
            "timeStamp": "1536145844164", "nonceStr": "F1DsdZyj1HiwywS8", "signType": "MD5", "paySign": "84EE3715B754FD2C5F9CB26456515DC2", "package": "prepay_id=wx051910441254896f4f0fcbec3027875733",
            success: (res) => {
                console.log(res)
            },
            fail: (error) => {
                console.log(error)
            }
        })
    },
    creatAct(e) {
        console.log(e)
        let post = this.data.post
        let img = post[e.currentTarget.id][0]
        wx.removeStorageSync("activityDetails")
        wx.removeStorageSync("editActivity")
        wx.removeStorageSync("applyInfo")
        wx.navigateTo({
            url: `/pages/creatActivity/creatActivity?img=${img}&label=${e.currentTarget.dataset.label}`,
        })
    },
    onShareAppMessage: function() {

    },
})
let app = getApp()
Page({
    data: {
        types: [],
        postType: {},
        pageLoading: true,
        btnLoading: false,
    },
    onLoad(options) {
        app.updateManager()
        app.pageTitle("发布活动")
        this.setData({
            types: app.types.category,
            postType: app.types.postType
        })
        app.api.findAllActivityCategory({}).then(res => {
            let post = res.data
            let catico = this.data.types
            for (let i in catico) {
                post[i].ico = catico[i].ico
            }
            app.api.posterTemplate({})
                .then(poster => {
                    let postimg = poster.data
                    let postIndex = []
                    for (let i in postimg) {
                        postIndex.push(postimg[i])
                    }
                    console.log(postIndex)
                    let selIndex = postIndex[0]
                    this.setData({
                        postimg: postIndex,
                        post: post,
                        pageLoading: false
                    })
                })
        })
    },
    onShow() {
        let member = wx.getStorageSync("login") ? true : false
        this.setData({
            member: member,
            btnLoading: false
        })
    },
    register(e) {
        console.log(e)
        let detail = e.detail
        if (detail) {
            wx.setStorage({
                key: 'login',
                data: e.detail,
            })
            this.setData({
                member: detail
            })
        }
    },
    creatAct(e) {
        let postimg = this.data.postimg
        let img = postimg[e.currentTarget.dataset.id][0]
        wx.removeStorageSync("activityDetails")
        wx.removeStorageSync("editActivity")
        wx.removeStorageSync("applyInfo")
        wx.navigateTo({
            url: `/pages/creatActivity/creatActivity?img=${img}&label=${e.currentTarget.dataset.label}`,
        })
    },
    onShareAppMessage() {
        app.shareApp()
    },
})
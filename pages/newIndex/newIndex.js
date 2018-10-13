let app = getApp()
Page({
    data: {
        types: [],
        postType: {},
        pageLoading: true
    },
    onLoad(options) {
        this.setData({
            types: app.types.category,
            postType: app.types.postType
        })
        app.api.findAllActivityCategory({}).then(res => {
            let post = res.data
            let catico = this.data.types
            for (let i in catico){
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
    creatAct(e) {
        console.log(e)
        let postimg = this.data.postimg
        let img = postimg[e.currentTarget.dataset.id][0]
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
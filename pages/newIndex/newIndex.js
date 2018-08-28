let app = getApp()
Page({
    data: {
        types: [{
                img: '../../images/yundong@3x.png',
                name: "运动健身",
                id: "exercise"
            },
            {
                img: '../../images/wutai@3x.png',
                name: "聚会娱乐",
                id: "recreation"
            },
            {
                img: '../../images/yundong@3x.png',
                name: "商务会议",
                id: "meeting"
            },
            {
                img: '../../images/qinzi@3x.png',
                name: "亲子幼教",
                id: "offspring"
            },
            {
                img: '../../images/yanchu@3x.png',
                name: "赛事演出",
                id: "show"
            },
            {
                img: '../../images/yishu@3x.png',
                name: "文化艺术",
                id: "art"
            },
            {
                img: '../../images/huwai@3x.png',
                name: "户外旅游",
                id: "travel"
            },
            {
                img: '../../images/peixun@3x.png',
                name: "职业培训",
                id: "train"
            },
        ],
        postType: {
            art: "文化艺术",
            exercise: "运动健身",
            meeting: "商务会议",
            offspring: "亲子幼教",
            recreation: "聚会娱乐",
            show: "赛事演出",
            train: "职业培训",
            travel: "旅游户外",
        },
        pageLoading: true
    },
    onLoad: function(options) {
        app.checkLogin()
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
    creatAct: function(e) {
        console.log(e)
        let post = this.data.post
        let img = post[e.currentTarget.id][0]
        wx.navigateTo({
            url: `/pages/creatActivity/creatActivity?img=${img}`,
        })
    },
    getUserInfo(e) {
        console.log(e)
        let detail = e.detail
        let parmas = {
            code: "31835", // wx.getStorageSync("code"),
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            superiormerchantid: " 10114186",
        }
        app.api.wechatRegister(parmas)
            .then(res => {
                console.log(res)
                wx.setStorageSync("login", res.data)
                let url = wx.getStorageSync("backUrl")
                this.setData({
                    isLogin: true
                })
                wx.reLaunch({
                    url: '/pages/newIndex/newIndex',
                })
            })
    },
    onReady: function() {

    },


    onShareAppMessage: function() {

    }
})
let app = getApp()
Page({
    data: {
        currentTab: 0,
        pageLoading: true,
        isBottom: false,
        isScrollTop:false,
        pageLoad: true,
        list: []
    },
    onLoad(options) {
        app.pageTitle(app.ext.appName)
        app.api.findAllActivityCategory({}).then(res => {
            console.log(res)
            let category = res.data
            category.unshift({
                categoryName: '全部分类',
                categoryId: 0,
            })
            this.setData({
                category: res.data
            })
            this.getList({})
        })
    },
    toggleCateyory(e) {
        console.log(e)
        let id = e.currentTarget.dataset.id
        this.getList({
            id: id
        })
        this.setData({
            isBottom: false,
            pageLoad: true,
            isScrollTop:false,
            currentTab: e.currentTarget.dataset.index
        })
    },
    listParams(args) {
        let arg = args || {}
        let params = {
            page: 1,
            size: 8
        }
        if (args.id) {
            params.activityCategory = args.id
        }
        if (args.isRefresh && this.data.currentTab>0){
            params.activityCategory = this.data.currentTab
        } 
        if (arg.isMore) {
            params.page = this.data.page + 1
        } else {
            this.setData({
                scrollLoading: true
            })
        }
        return params
    },
    dateFormat(list) {
        let newList = []
        for (let i in list) {
            newList[i].push(list[i])
        }
        return newList
    },
    listMore(e) {
        console.log(e)
        this.setData({
            isBottom: true
        })
        if (this.data.hasMore) {
            this.getList({
                isMore: true
            })
        }
    },
    listRefresh(e){
        this.setData({
            isScrollTop:true
        })
        this.getList({
            isRefresh: true
        })
    },
    getList(args) {
        let arg = args || {}
        let parmas = this.listParams(arg)
        if (arg.isRefresh){
            this.setData({
                refresh:true
            })
        }
        app.api.findActivityList(parmas)
            .then(res => {
                let datas = res.data
                if (res.data.length > 0){
                    app.coverDateList(datas,"startDate")
                }
                if (arg.isMore) {
                    if (res.data.length > 0) {
                        let list = this.data.list
                        list = list.concat(res.data)
                        this.setData({
                            list: list,
                            page: this.data.page + 1
                        })
                    } else {
                        this.setData({
                            hasMore: false,
                        })
                    }
                } else {
                    let hasMore = res.data.length < 8 ? false : true
                    this.setData({
                        list: res.data,
                        scrollLoading: false,
                        pageLoading: false,
                        pageLoad: false,
                        refresh:false,
                        page: 1,
                        hasMore: hasMore
                    })
                }
                if(arg.isRefresh){
                    this.setData({
                        resOk:40
                    })
                }
            })
    },
    toDetail(e) {
        wx.navigateTo({
            url: `/pages/activityDetails/activityDetails?id=${e.currentTarget.dataset.id}`,
        })
    },
    onShareAppMessage(e) {
        console.log(e)
    }
})
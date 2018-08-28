const app = getApp()
var api = require('../../api/api.js')
Page({
    data: {
        pageLoad: true,
        currentTab: 0,
        toBottom: false,
        hasMore: true,
        gridLayout: false,
    },
    onLoad: function() {
        this.checkLogin()
    },
    inputFocus: function(e) {
        console.log(e)
    },
    setTabWidth: function() {
        try {
            var query = wx.createSelectorQuery()
            query.select('#tab0').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(res => {
                console.log(res)
                res[0].top // #the-id节点的上边界坐标
                res[1].scrollTop // 显示区域的竖直滚动位置
                this.setData({
                    itemWidth: res[0].width
                })
            })
        } catch (error) {
            console.log(error)
        }
    },
    checkLogin: function() {
        try {
            let loginData = wx.getStorageSync("isLogin")
            let isLogin
            if (loginData) {
                isLogin = true
                this.getList({
                    status: 0,
                    page: 1,
                    count: 20,
                })
            } else {
                isLogin = false
                wx.hideTabBar()
            }
            this.setData({
                isLogin: isLogin
            })
            this.setTabWidth()
        } catch (error) {
            console.log(error)
        }
    },
    toggleActivity: function(e) {
        console.log(e)
        let currentIndex = e.currentTarget.dataset.index
        this.getList({
            status: 0,
            page: 1,
            count: 20,
            status: currentIndex
        })
        this.setData({
            currentTab: currentIndex,
            leftOffset: currentIndex == 0 ? (33.333333 - 12.5) / 2 : (currentIndex * 33.33333333) + (33.333333 - 12.5) / 2
        })
    },
    searchFocus: function(e) {
        this.setData({
            SearchDel: true,
            searchMask: true
        })
    },
    searchDel: function(e) {
        this.setData({
            searchMask: false,
            searchText: '',
            SearchDel: false,
            searchText: null
        })
        this.getList({
            page: 1,
            count: 20,
            status: this.data.currentTab,
        })

    },
    searchList: function() {
        this.setData({
            searchMask: false
        })
        this.getList({
            count: 20,
            page: 0,
            status: this.data.currentTab
        })
    },
    searchInput: function(e) {
        if (e.detail.value != 0) {
            this.setData({
                searchText: e.detail.value,
                searchClear: true
            })
        } else {
            this.setData({
                searchClear: false
            })
        }
    },
    scrollMore: function(e) {
        this.setData({
            toBottom: true
        })
        let page = this.data.list.currentPage + 1
        if (this.data.hasMore) {
            this.getList({
                page: page,
                count: 20,
                status: this.data.currentTab
            }, true)
        }
    },
    getList: function(parmas, loadMore) {
        if (!loadMore) {
            this.setData({
                listLoad: true
            })
        }
        if (this.data.searchText) {
            parmas.keyWord = this.data.searchText
        }
        api.activityList(parmas)
            .then(res => {
                let result = res.result
                if (loadMore) {
                    let list = this.data.list
                    console.log(list)
                    if (result.activityList.length != 0) {
                        list.currentPage = result.currentPage
                        list.activityList.concat(result.activityList)
                        list.activityList = list.activityList.concat(result.activityList)
                        let data = {
                            list: list,
                            toBottom: false,
                            listLoad: false
                        }

                        this.setData(data)
                    } else {
                        this.setData({
                            hasMore: false
                        })
                    }
                } else {

                    this.setData({
                        list: result,
                        listLoad: false
                    })
                }
            })
    },
    loginClub: function(e) {

        api.login(e.detail.value, true)
            .then(res => {
                console.log(res)
                switch (res.code) {
                    case 0:
                        wx.setStorageSync("isLogin", res.result)
                        // wx.showToast({
                        //     title: res.message,
                        //     icon: "none"
                        // })
                        this.setData({
                            isLogin: true
                        })
                        this.getList({
                            status: 0,
                            page: 1,
                            count: 20,
                        })
                        wx.showTabBar()
                        break
                    case -1: //登录失败
                        wx.showToast({
                            title: res.message,
                            icon: "none"
                        })
                        break
                }
            })
    },
    toDetail: function(e) {
        //console.log(e)
        wx.setStorageSync("detailId", e.currentTarget.id)
        wx.navigateTo({
            url: `/pages/sing/sing?id=${e.currentTarget.id}&title=${e.currentTarget.dataset.title}`,
        })
    },
    toggleLayout: function() {
        this.setData({
            gridLayout: !this.data.gridLayout
        })
    },
    onShow: function() {
        this.checkLogin()


    },
    getUserInfo:function(res){
        console.log(res)
    }
})
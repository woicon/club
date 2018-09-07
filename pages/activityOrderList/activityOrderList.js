let app = getApp()
Page({
    data: {
        orderStatus: {
            1: '未使用',
            2: '已使用'
        },
        isBottom: false,
        currentTab: 1,
        pageLoading: true,
        hasMore: true
        // 4取消 5过期 6待审核 7审核失败 8删除 9失败}
        //0待支付 1待核销 2核销中 3完成 4取消 5过期 6待审核 7审核失败 8删除 9失败
        // 0待支付、1未使用、2已使用、3已取消、5已过期、6申请退款中、7已退款
    },

    onLoad: function(options) {
        console.log(options)
        this.setData({
            activityId: options.activityId,
            merchantId: options.merchantId,
        })
        app.pageTitle("订单管理")
        this.orderList()
    },
    toggleTab(e) {
        this.setData({
            currentTab: e.currentTarget.dataset.id
        })
        this.orderList({
            status: e.currentTarget.dataset.id
        })
    },
    toOrderDetail(e){
        console.log(e)
        let dataset = e.target.dataset
        wx.navigateTo({
            url: `/pages/activityOrderDetail/activityOrderDetail?orderId=${dataset.orderid}&activityId=${dataset.activityid}`,
        })
    },
    orderParams(args) {
        let arg = args || {}
        let params = {
            page: arg.page || 1,
            size: 20,
            status: arg.status || this.data.currentTab,
            activityId: this.data.activityId,
        }
        console.log(params)
        return params
    },
    listMore() {
        this.setData({
            isBottom: true
        })
        if (this.data.hasMore) {
            this.orderList({
                page: this.data.page +1,
                isMore: true
            })
        }
    },
    orderList(args) {
        let arg = args || {}
        this.setData({
            pageLoading: true
        })
        let params = this.orderParams({
            page:arg.page || 1,
            status: arg.status || this.data.currentTab,
        })
        app.api.activityOrderList(params)
            .then(res => {
                console.log(res)
                if (res.status == '200') {
                    if (arg.isMore) {
                        let _list = this.data.list
                        if(res.data.length >0){
                            this.setData({
                                pageLoading: false,
                                list: _list.concat(res.data),
                                page: params.page,
                                isBottom:false
                            })
                        }else{
                            this.setData({
                                pageLoading: false,
                                hasMore:false
                            })
                        }
                    } else {
                        this.setData({
                            pageLoading: false,
                            list: res.data,
                            page: params.page
                        })
                    }
                }
            })
    }
})
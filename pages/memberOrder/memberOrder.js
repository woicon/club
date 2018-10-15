let app = getApp()
Page({
    data: {
        orderStatus: [
            {name: '全部'},
            {id: 1,name: '待参与'},
            {id: 2,name: '已完成'},
            {id: 3,name: '已失效'},
        ],
        isBottom: false,
        currentTab: 1,
        pageLoading: true,
        hasMore: true,
        currentTab: 0,
        //订单状态, 0待支付 1待核销 2核销中 3完成 4取消 5过期 6待审核 7审核失败 8删除 9失败(由于库存不足等原因，进行退款)
    },
    onLoad: function(options) {
        this.setData({
            activityId: options.activityId,
            merchantId: options.merchantId,
            activityStatus: app.types.activityStatus
        })
        app.pageTitle("我的订单")
    },
    onShow(){
        this.orderList()
    },
    toggleTab(e) {
        let dataset = e.currentTarget.dataset
        this.setData({
            currentTab: dataset.index,
            status: dataset.id || null,
            hasMore:true,
        })
        this.orderList({
            status: dataset.id || ""
        })
    },
    toOrderDetail(e) {
        console.log(e)
        let dataset = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/memberOrderDetail/memberOrderDetail?orderId=${dataset.orderid}&activityId=${dataset.activityid}`,
        })
    },
    orderParams(args) {
        let arg = args || {}
        let params = {
            page: arg.page || 1,
            size: 20,
            memberId: app.common('memberId')
        }
        if (arg.status) {
            params.status = args.status
        }
        return params
    },
    listMore() {
        this.setData({
            isBottom: true
        })
        if (this.data.hasMore) {
            this.orderList({
                page: this.data.page + 1,
                isMore: true,
                status: this.data.status || null
            })
        }
    },
    orderList(args) {
        let arg = args || {}
        this.setData({
            pageLoading: true
        })
        let params = this.orderParams(args)
        app.api.myOrderList(params)
            .then(res => {
                console.log(res)
                if (res.status == '200') {
                    let data = res.data
                    if (data.length > 0) {
                        for (let i in data) {
                            data[i].activityStartTime = app.converDate(data[i].activityStartTime)
                        }
                    }
                    console.log(data)
                    if (arg.isMore) {
                        let _list = this.data.list
                        if (data.length > 0) {
                            this.setData({
                                pageLoading: false,
                                list: _list.concat(res.data),
                                page: params.page,
                                isBottom: false
                            })
                        } else {
                            this.setData({
                                pageLoading: false,
                                hasMore: false
                            })
                        }
                    } else {
                        this.setData({
                            pageLoading: false,
                            list: data,
                            page: params.page
                        })
                    }
                }
            })
    }
})
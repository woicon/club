// pages/actMap/actMap.js
var QQMapWX = require('../../libs/qqmap/qqmap-wx-jssdk.min.js')
Page({
    data: {

    },
    onLoad: function(options) {},
    onReady: function(e) {
        this.mapCtx = wx.createMapContext('myMap')
    },
    inputLoaction: function(e) {
        console.log(e)
        let searchKeyword = e.detail.value
        var qqmapsdk = new QQMapWX({
            key: '626BZ-FSQCP-V3JD3-VWPRC-4VJ4O-UIFUD'
        })
        if (searchKeyword != '' && searchKeyword.length > 3) {
            console.log(this.qqmap)
            qqmapsdk.getSuggestion({
                keyword: e.detail.value,
                success: (res)=> {
                    console.log(res);
                    this.setData({
                        localtionList: res.data
                    })
                },
                fail: function(res) {
                    console.log(res);
                },
                complete: function(res) {
                    console.log(res);
                }
            })
        }
    },
    getCenterLocation: function() {
        this.mapCtx.getCenterLocation({
            success: function(res) {
                console.log(res.longitude)
                console.log(res.latitude)
            }
        })
    },
    moveToLocation: function() {
        this.mapCtx.moveToLocation()
    },
    translateMarker: function() {
        this.mapCtx.translateMarker({
            markerId: 0,
            autoRotate: true,
            duration: 1000,
            destination: {
                latitude: 23.10229,
                longitude: 113.3345211,
            },
            animationEnd() {
                console.log('animation end')
            }
        })
    },
    includePoints: function() {
        this.mapCtx.includePoints({
            padding: [10],
            points: [{
                latitude: 23.10229,
                longitude: 113.3345211,
            }, {
                latitude: 23.00229,
                longitude: 113.3345211,
            }]
        })
    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
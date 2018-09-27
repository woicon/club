// pages/applyPerson/applyPerson.js
let app = getApp()
Page({
    data: {
        items: [{
                name: 'USA',
                value: '美国'
            },
            {
                name: 'CHN',
                value: '中国',
                checked: 'true'
            },
            {
                name: 'BRA',
                value: '巴西'
            },
            {
                name: 'JPN',
                value: '日本'
            },
            {
                name: 'ENG',
                value: '英国'
            },
            {
                name: 'TUR',
                value: '法国'
            },
        ]
    },

    onLoad: function(options) {
        app.pageTitle("填写报名人信息")
    },

    onReady: function() {

    },

    onShow: function() {

    },

    onHide: function() {

    },

    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})
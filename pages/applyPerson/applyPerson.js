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
        ],
        ResponseList:[]
    },
    onLoad: function(options) {
        app.pageTitle("填写报名人信息");
        //console.log(wx.getStorageSync("orderParams"));
       this.setData({
          ResponseList: wx.getStorageSync("applyDetail").activityEnrollInfoResponseList
       }) 
       console.log(this.data.ResponseList)
      // app.api.findActivityList({}).then((res)=>{
           // console.log(res)

        //})
    },
    submit(e){
      //console.log(wx.getStorageSync("orderParams"));
      //console.log(wx.getStorageSync("applyDetail"));   
    }
})
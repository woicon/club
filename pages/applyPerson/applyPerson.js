// pages/applyPerson/applyPerson.js
let app = getApp(),
    form=""
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
        curentIndex:0,
        responseList:[],
        form:{},
        msg:''
    },
    onLoad: function(options) {
       app.pageTitle("填写报名人信息");
       let orderParams = wx.getStorageSync("orderParams");
       let applyDetail = wx.getStorageSync("applyDetail");
       let responseList = applyDetail.activityEnrollInfoResponseList;
       for (var i = 0; i < responseList.length;i++){
         let arr = [];
         if (responseList[i].fieldOption!=null){
           arr.push(responseList[i].fieldOption.split("$"));
             responseList[i].fieldOption = arr; 
         }
       }
       console.log(orderParams)
       console.log(applyDetail)
       form = this.data.form;
       this.data.responseList = responseList
       form.activityId = applyDetail.id
       form.orderType = orderParams.ticketType
       form.ticketCount= orderParams.num
       form.memberId =app.common("id")
       form.merchantId = applyDetail.merchantId
      // form.memberId = 
       this.setData({
         responseList: responseList
       }) 
       form = this.data.form;
    },
    radioChange(e){
        form = this.data.form;
        form.radio = e.detail.value;
         this.setData({
            form : form 
         })
    },
    checkChange(e){
        form = this.data.form;
        form.checkTxt = e.detail.value;
        this.setData({
            form : form 
        })
    },
    formSubmit(e){
         let txt = [];
         form = this.data.form;
         txt.push(e.detail.value);
         form.txt = txt;
         this.setData({
              form:form
         })
         console.log(this.data.form);
    }
})
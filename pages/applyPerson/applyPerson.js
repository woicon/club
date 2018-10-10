// pages/applyPerson/applyPerson.js
let app = getApp(),form = ""
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
    curentIndex: 0,
    responseList: [],
    form: {},
    msg: '',
    radioTxt: '',
    checkTxt: '',
    radioArr:[],
    checkArr:[],
    selNum: 0,
    isActive:0,
    personNum:1  //活动报名人数
  },
  onLoad: function (options) {
    app.pageTitle("填写报名人信息");
    let orderParams = wx.getStorageSync("orderParams"),
        applyDetail = wx.getStorageSync("applyDetail"),
        _this = this,
        responseList = applyDetail.activityEnrollInfoResponseList
        responseList.forEach(function (item, x) {
           let arr = new Array()
           if (item.fieldOption != null) {
               arr.push(item.fieldOption.split("$") )
               item.fieldOption = arr
            }
            if (item.fieldType == 2) {
              for (let i = 0; i < orderParams.num; i++) {
                _this.data.radioArr.push(arr[0][0])
              }
            }
            if (item.fieldType == 3) {
              for(let i=0;i< orderParams.num;i++){
                  _this.data.checkArr.push(arr[0][0])
              }
            }
        })
    this.data.responseList = responseList
    form = {
      activityId: applyDetail.id,
      orderPrice: orderParams.price,
      payPrice: orderParams.price,
      //orderType : 0,
      ticketCount: orderParams.num,
      memberId: 65837,  //app.common("id"),//会员id
      merchantId: applyDetail.merchantId,
      channelId: applyDetail.activityChannel.id,//渠道id
      inventoryId: orderParams.inid,  //库存id
      ticketId: orderParams.id //票Id
    }
    this.setData({
      responseList: responseList,
      form: form,
      personNum:orderParams.num
    })
  },
  radioChange(e) {
    if(this.data.radioArr.length >=2){
        this.data.radioArr = []
    }
    let radio = new Array(this.data.personNum),
        index = e.target.dataset.index
        radio[index] = e.detail.value
    this.setData({
      radioTxt : e.detail.value,
    })
    this.data.radioArr.push(radio[index])
  },
  checkChange(e) {
    let index = e.target.dataset.index
        if (e.detail.value.length>0){
          this.data.checkArr[index] = e.detail.value.join("$")
        }
    this.setData({
      checkTxt : e.detail.value.join("$")
    })
    if(this.data.checkArr.length>2){
      this.data.checkArr.push(this.data.checkArr[index])
    }
  },
  bindPickerChange(e) {
    this.setData({
      selNum: parseInt(e.detail.value)
    })
  },
  formSubmit(e) {
    let arrTxt = [], arr = [], _this = this,arrXml=[],statusArr=[];
    form = this.data.form
    arrTxt.push(e.detail.value)
    let flag = false
    for(let i=0;i<this.data.personNum;i++){
        this.data.responseList.forEach(function (item, x) {
          if (item.fieldType == 0 || item.fieldType == 1) {
            item.fieldOption = `${arrTxt[0]["name" + i + x]}`
          } else if (item.fieldType == 2) {
            item.fieldOption = _this.data.radioArr[i]
          } else if (item.fieldType == 3) {
            item.fieldOption = _this.data.checkArr[i]
          } else if (item.fieldType == 4) {
            item.fieldOption = parseInt(_this.data.selNum) + 1
          }
          if (item.status == 0 && item.fieldOption==""){
            statusArr.push({"name":item.name,"status":item.status})
            //app.tip(`请输入${item.name}`) 
            //flag = true 
          }
          arr.push(`<field><name>${item.name}</name><value>${item.fieldOption}</value><type>${item.type}</type><sequence>${item.infoSequence}</sequence><fieldtype>${item.fieldType}</fieldtype></field>`)
        })
      arrXml.push(`{"enrollXml":'<enrollInfo>${arr.join("")}</enrollInfo>'}`)
    }
    form.enrollInfos = `[${arrXml.join(",")}]`
    for(let x = 0;x<statusArr.length;x++){
        app.tip(`请输入${statusArr[x].name}`) 
        flag = true
    }
    if(flag==false){
      form.contactsName = arrTxt[0]["name00"]
      form.contactsPhone = arrTxt[0]["name01"]
      this.setData({
        form: form
      })
      console.log(this.data.form)
     // app.api.createAppletOrder(this.data.form).then((res) => {
         //wx.navigateTo({
           //url:'/pages/activityDetails/activityDetails?data='+res.data,
         //})
       // console.log(res.data)
      //})
    }
  }
})
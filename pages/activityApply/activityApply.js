let app= getApp();
let form,orderParams //存入改变的值
Page({
    data: {
        isPX:app.isPX,
        price:0,
        current:0,
        datecurrent:0,
        intcurrent:0,
        maxlen:1,
        num:1,
        array: [],
        form:{
           ticketTitle:'请选择票种',
           timeTitle:'请选择时间',
           intervalTitle:'可选时段',
        },
        orderParams:{},
        activityTimeList:[],
        price:"0.00" //共计
    },
    setDate(startDate,endDate){
      let timeList = []
      let start = startDate.split(" ")[0], //活动开始日期
        syear = start.split("-")[0], smonth = start.split("-")[1], sday = start.split("-")[2],
        end = endDate.split(" ")[0], //活动结束日期
        eyear = end.split("-")[0], emonth = end.split("-")[1], eday = end.split("-")[2],
        sTime = new Date()
      sTime.setFullYear(syear, smonth - 1, sday)
      let startT = sTime.getTime()
      let eTime = new Date()
      eTime.setFullYear(eyear, emonth - 1, eday)
      let sDay = sTime.getDate(),
        endT = eTime.getTime(),
        diffTime = Math.floor((endT - startT) / (24 * 3600 * 1000)),
        begin, last
      if (diffTime < 0) {
        begin = sDay + diffTime
        last = sDay;
      } else {
        begin = sDay
        last = sDay + diffTime
      }
      for (let i = begin; i <= last; i++) {
        let mydate = new Date(startT)
        mydate.setDate(i);
        let date = `${mydate.getFullYear()}-${mydate.getMonth() + 1}-${mydate.getDate()}`
        timeList.push(`${app.converDate(date, true)}`)
      }
      return timeList;
    },
    onLoad: function(options) {
      let detail = wx.getStorageSync("applyDetail")
      console.log(detail)
      orderParams = this.data.orderParams
      orderParams.activityId = detail.id
      orderParams.num=1
      orderParams.activityTicketList = detail.activityTicketList
      orderParams.id = detail.activityTicketList[this.data.current].id//设置票id默认选项
      orderParams.ticketName = detail.activityTicketList[this.data.current].ticketName//设置票默认选项
      orderParams.price = detail.activityTicketList[this.data.current].price//设置票价格默认选项
      orderParams.payPrice = detail.activityTicketList[this.data.current].price//设置票价格默认选项
      orderParams.ticketType = detail.activityTicketList[this.data.current].ticketType //
      orderParams.inid = detail.activityTicketList[this.data.current].activityTicketInventory[0].id //库存id
      app.pageTitle("选择票价")
      let timeList = this.setDate(detail.activityTimeList[0].startDate, detail.activityTimeList[0].endDate),
          sInterval = detail.startDate.split(" ")[1],
          eInterval = detail.endDate.split(" ")[1]
      orderParams.time = timeList[0] //设置默认已选时间段
      orderParams.interval = `${sInterval}~${eInterval}`
      this.setData({
          detail: detail,
          orderParams: orderParams,
          form: {
            ticketTitle : '已选：',
            timeTitle : '已选：',
            intervalTitle :'已选：'
          },
          activityTimeList: timeList,
          maxlen: orderParams.activityTicketList[0].maxBuy
      })
    },
    checkTicket(e){
       let orderParams ={
          ticketType : e.currentTarget.dataset.index,
          ticketName : e.target.dataset.name,
          id : e.currentTarget.dataset.id,
          price : e.currentTarget.dataset.price,
          inid : e.currentTarget.dataset.inid
       } 
       this.data.form.ticketTitle = "已选："
       orderParams= this.data.orderParams
       let form = this.data.form
       this.setData({
         orderParams : orderParams,
         form :form,
         current : e.currentTarget.dataset.index,
         maxlen : e.currentTarget.dataset.count
       })
    },
    checkedDate(e){
       let timeType = e.currentTarget.dataset.type,
           time = e.currentTarget.dataset.time,
           form  = this.data.form
       orderParams=this.data.orderParams
       if(timeType=="0"){
         this.data.orderParams.time = e.currentTarget.dataset.time
         this.data.form.timeTitle = "已选："
         this.setData({
           datecurrent : e.currentTarget.dataset.index
        })
       }else{
         let sTime = e.currentTarget.dataset.stime,
             eTime = e.currentTarget.dataset.etime
         this.data.orderParams.interval = `${sTime}~${eTime}`
         this.data.form.intervalTitle = "已选："
         this.setData({
           intcurrent : e.currentTarget.dataset.index
         })
       }
       this.setData({
          form:form,
          orderParams:orderParams
       })
    },
     bindChange(e){
      let num  = this.data.num 
      if (e.currentTarget.dataset.type =="plus"){
        if (num >= this.data.maxlen){
          app.tip(`最多选择${this.data.maxlen}张`)
        }else{
          num = num + 1
        }
      }else{
         if(num <= 1){
           app.tip(`最少选择1张`)
         }else{
           num = num - 1
         }
      }
      this.data.orderParams.num = num
      orderParams = this.data.orderParams
       let price = orderParams.price,
           prix = (price * num).toFixed(2)
       this.setData({
         num : num,
         orderParams: orderParams,
         price: prix
      })
    },
    toApplyPerson(e) {
       wx.setStorageSync("orderParams", this.data.orderParams);
       wx.navigateTo({
         url: '/pages/applyPerson/applyPerson',
       })
    }
})
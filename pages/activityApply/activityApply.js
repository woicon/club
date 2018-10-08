let app= getApp();
let form,orderParams //存入改变的值
Page({
    data: {
        isPX:app.isPX,
        price:0,
        current:0,
        datecurrent:0,
        intcurrent:0,
        index:0,
        maxlen:5,
        array: [],
        form:{
           ticketTitle:'请选择票种',
           timeTitle:'请选择时间',
           intervalTitle:'可选时段',
        },
        orderParams:{},
        activityTimeList:[]
    },
    onLoad: function(options) {
      let detail = wx.getStorageSync("applyDetail");
      console.log(detail)
      orderParams = this.data.orderParams
      orderParams.activityId = detail.id
      orderParams.num=1;
      orderParams.activityTicketList = detail.activityTicketList
      orderParams.id = detail.activityTicketList[this.data.current].id//设置票id默认选项
      orderParams.ticketName = detail.activityTicketList[this.data.current].ticketName//设置票默认选项
      orderParams.price = detail.activityTicketList[this.data.current].price//设置票价格默认选项
      orderParams.payPrice = detail.activityTicketList[this.data.current].price//设置票价格默认选项
      orderParams.ticketType = detail.activityTicketList[this.data.current].ticketType //
      orderParams.inid = detail.activityTicketList[this.data.current].activityTicketInventory[0].id //库存id
      app.pageTitle("选择票价");
      let arr = [], timeList=[];
      for (let i = 0; i < this.data.maxlen;i++){
        arr.push(i+1)
      } 
      let start = detail.activityTimeList[0].startDate.split(" ")[0], //活动开始日期
          syear= start.split("-")[0],smonth= start.split("-")[1],sday=start.split("-")[2],
          end = detail.activityTimeList[0].endDate.split(" ")[0], //活动结束日期
          eyear=end.split("-")[0],emonth=end.split("-")[1],eday=end.split("-")[2],
          sTime = new Date()
          sTime.setFullYear(syear, smonth-1, sday)
      let startT = sTime.getTime()
      let eTime= new Date()
      eTime.setFullYear(eyear,emonth-1,eday)
      let sDay = sTime.getDate()
      let endT = eTime.getTime()
      let diffTime = Math.floor((endT - startT) / (24 * 3600 * 1000))
      let begin,last 
      if(diffTime < 0){
        begin = sDay + diffTime
        last = sDay;
      }else{
        begin=sDay
        last = sDay+diffTime
      }
      for (let i = begin; i <= last; i++) {
          let mydate = new Date(startT)
          mydate.setDate(i);
          timeList.push(`${mydate.getFullYear()}-${mydate.getMonth()+1}-${mydate.getDate()}`)
      }
      let sInterval = detail.startDate.split(" ")[1],
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
          array:arr,
          activityTimeList:timeList
      })
    },
    checkTicket(e){
       this.data.orderParams.ticketType = e.currentTarget.dataset.index
       this.data.orderParams.ticketName = e.target.dataset.name
       this.data.orderParams.id = e.currentTarget.dataset.id
       this.data.orderParams.price = e.currentTarget.dataset.price
       this.data.orderParams.inid=e.currentTarget.dataset.inid
       this.data.form.ticketTitle = "已选："
       orderParams= this.data.orderParams
       let form = this.data.form
       this.setData({
         orderParams : orderParams,
         form :form,
         current : e.currentTarget.dataset.index
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
    bindPickerChange(e){
      this.data.orderParams.num = parseInt(e.detail.value) + 1
      orderParams = this.data.orderParams
      this.setData({
        index: e.detail.value,
        orderParams:orderParams
      })
    },
    toApplyPerson(e) {
       wx.setStorageSync("orderParams", this.data.orderParams);
       wx.navigateTo({
         url: '/pages/applyPerson/applyPerson',
       })
    }
})
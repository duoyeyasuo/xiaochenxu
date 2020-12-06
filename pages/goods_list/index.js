// pages/goods_list/index.js
/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:2,
        value:"销量",
        isActive:false
      },
      {
        id:3,
        value:"价格",
        isActive:false
      },
    ],
    //定义空数组接收商品的信息
    goodsList:[],
  },
//接口要的参数
QueryParams:{
query:"",//关键字
cid:"",
pagenum:1,//从第几页开始
pagesize:10//页容量

},
//总页数
totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//console.log(options)//此打印能够看到上一页的数据是否传输过来
this.QueryParams.cid=options.cid;//此处是给上面定义好的cid赋值
this.getGoodsList();

// 注意
  },
  //获取商品列表的数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
  //console.log(res)//打印看是否拿到数据
  //获取总条数
 const total=res.total;
 //计算总页数
 this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
// console.log(this.totalPages);

this.setData({
  //拼接了数组
  goodsList:[...this.data.goodsList,...res.goods]//把拿到的商品信息赋值给定义的数组
})
// 关闭下拉刷新的窗口  如果没有调用下拉刷新的窗口，直接关闭也不会报错的
wx.stopPullDownRefresh();
  },//es7语法，要使用需把上页定义好的函数给引用进来
//标题点击事件，从子组件传递过来
handleTabsItemChange(e){
  //获取被点击的标题索引
  const {index}=e.detail;
  //2.修改原数组。让他产生一个激活选中的效果
  let {tabs}=this.data;
  tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
  //3.赋值到data中
  this.setData({
    tabs
  })
},
//页面上滑滚动条触底事件
onReachBottom(){
  //1.判断还有没有下一页
if(this.QueryParams.pagenum>=this.totalPages){
  //没有下一组数据
  // console.log("没有下一组数据")
  wx:wx.showToast({
    title: '我是有底线的'

  })
}else{
  //还有下一组数据
// console.log("还有下一组数据")
this.QueryParams.pagenum++;
this.getGoodsList();
}
},
//下拉刷新事件
onPullDownRefresh(){
  // console.log("刷新")
  //1.重置数组
  this.setData({
    goodsList:[]
  })
  //2重置页码
  this.QueryParams.pagenum=1;
  //3.重新发送请求
this.getGoodsList();
}
})
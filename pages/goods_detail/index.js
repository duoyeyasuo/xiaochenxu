// pages/goods_detail/index.js
/* 
1.发送请求获取数据
2.点击轮播图预览大图
2.1给轮播图绑定点击事件
2.2调用小程序的api previewImage
3.点击加入购物车
3.1先绑定点击事件
3.2获取缓存中的购物车数据，（数组格式）
3.3先判断当前商品是否已经存在于购物车
3.4如果已经存在，那么要修改商品数据 执行购物车的数量++   重新把购物车数组填充回缓存中
3.5不存在购物车数组中。直接给购物车数组添加一个新元素，但是该元素需要带上购买数量属性。重新把购物车数组填充回缓存中
*/
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
const {goods_id}=options;
this.getGoodsDetail(goods_id);
  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id){
const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
this.GoodsInfo=goodsObj;
this.setData({
  goodsObj:{
    goods_name:goodsObj.goods_name,
    goods_price:goodsObj.goods_price,
    goods_introduce:goodsObj.goods_introduce,
    pics:goodsObj.pics
// iphone部分手机不识别webp格式，最好让后端修改 
//临时自己改 
  }
})
},
//点击轮播图放大预览
handlePrevewImage(e){
  //1.先构造要阅览的图片数组
  const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
  //点击事件触发了要接收传递过来的url
const current=e.currentTarget.dataset.url;
  wx.previewImage({
    urls,
    current,
  })
},
//点击加入购物车
handleCartAdd(){
  //1.先获取缓存中的购物车数组
  let cart=wx.getStorageSync("cart")||[];//把添加的商品转化为数组
  //2.判断商品是否存在于购物车数组中
let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
if(index===-1){
  //3不存在，第一次添加
  this.GoodsInfo.num=1;
  cart.push(this.GoodsInfo);
}else{
  //4已经存在购物车数据执行 num++
  cart[index].num++;
}
//5把购物车重新添加回缓存中
wx.setStorageSync('cart', cart);
//弹窗提示
wx.showToast({
  title: '添加成功',
  icon:"success",
  //true防止用户手抖疯狂点击
  mask:true,
})
}

})
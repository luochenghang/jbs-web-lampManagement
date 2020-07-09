//定义url参数常量
var urlData = {
  dev:"http://127.0.0.1:9002/",
  online:"http://luoch.cn/"
};

var baseUrl = urlData.online;

//api的url
/*********************************************************************************/
var getCodeUrl = baseUrl + "lamp/v1/getCode";  //验证码
var getAllSysLogUrl = baseUrl + "lamp/v1/getAllSysLog"; //系统log

//系统用户
var regUrl = baseUrl + "lamp/v1/reg";  //注册
var loginUrl = baseUrl + "lamp/v1/login";//登录
var logoutUrl = baseUrl + "lamp/v1/logout";//退出
var findSysUserListUrl = baseUrl + "lamp/v1/findSysUserList"; //获取用户列表
var delSysUserUrl = baseUrl + "lamp/v1/delSysUser"; //批量删除用户
var updateSysUserStatusUrl = baseUrl + "lamp/v1/updateSysUserStatus"; //更新用户状态
var getLoginUserInfoUrl = baseUrl + "lamp/v1/getLoginUserInfo"; //获取登陆信息
var updateLoginUserInfoUrl = baseUrl + "lamp/v1/updateLoginUserInfo"; //更新用户
var updPasswordUrl = baseUrl + "lamp/v1/updPassword"; //更新用户

//主界面数据
var getSysHomeOrderProductNumUrl = baseUrl + "lamp/v1/getSysHomeOrderProductNum"; 
var findTopThreeUserUrl = baseUrl + "lamp/v1/findTopThreeUser"; 

//店铺信息
var getShopInfoUrl = baseUrl + "lamp/v1/getShopInfo"; 
var updShopInfoUrl = baseUrl + "lamp/v1/updShopInfo"; 
var addShopInfoUrl = baseUrl + "lamp/v1/addShopInfo"; 

//客户用户信息
var findAllUserByUserTypeUrl =  baseUrl + "lamp/v1/findAllUserByUserType"; //获取所有用户信息
var findAllUserUrl = baseUrl + "lamp/v1/findAllUser";
var getUserUrl = baseUrl + "lamp/v1/getUser";
var updUserUrl = baseUrl + "lamp/v1/updUser"; 
var addUserUrl = baseUrl + "lamp/v1/addUser"; //手动添加用户信息
var delUserUrl = baseUrl + "lamp/v1/delUser"; //

//字典
var dictListUrl = baseUrl + "lamp/v1/dictList";//获取不同类型的数据列表
var dictValueUrl = baseUrl + "lamp/v1/dictValue";//获取不同类型的数据
//上传封面图
var uploadCoverImgUrl = baseUrl + "lamp/v1/uploadCoverImg";  //
var uploadBannerUrl =  baseUrl + "lamp/v1/upload";//上传图片 上传服务器并添加数据
var uploadGoodsDetailUrl =  baseUrl + "lamp/v1/uploadGoodsDetail"; //上传图片 并没有添加数据  返回路径
//获取资源图片
var getAllFileResourceGroupByTypeUrl = baseUrl + "lamp/v1/getAllFileResourceGroupByType";//分类查询对应数量
var getAllFileResourceUrl = baseUrl + "lamp/v1/getAllFileResource"; //查询所有的资源
var updFileStatusUrl = baseUrl + "lamp/v1/updFileStatus";//更新状态
var delFileResourceUrl = baseUrl + "lamp/v1/delFileResource";//批量删除


//商品类型
var getAllGoodsTypeUrl = baseUrl + "lamp/v1/getAllGoodsType";//获取所有的商品类型
var getGoodsTypeByIdUrl = baseUrl + "lamp/v1/getGoodsTypeById";//根据id查询商品类型
var delGoodsTypeUrl = baseUrl + "lamp/v1/batchDelGoodsType";//批量删除商品类型
var updGoodsTypeUrl = baseUrl + "lamp/v1/updGoodsType";//编辑商品类型
var updGoodsTypeStatusUrl = baseUrl + "lamp/v1/updGoodsTypeStatus";//上下架
var addGoodsTypeUrl = baseUrl + "lamp/v1/addGoodsType";//新增商品类型

//商品
var getAllGoodsUrl = baseUrl + "lamp/v1/getAllGoods";//获取所有的商品
var getGoodsByIdUrl = baseUrl + "lamp/v1/getGoodsById";//根据id查询商品
var delGoodsUrl = baseUrl + "lamp/v1/delGoods";//批量删除商品
var updGoodsUrl = baseUrl + "lamp/v1/updGoods";//编辑商品
var updGoodsStatusUrl = baseUrl + "lamp/v1/updGoodsStatus";//上下架
var addGoodsuploadUrl = baseUrl + "lamp/v1/addGoods";//新增商品

//订单
var getAllOrderUrl = baseUrl + "lamp/v1/getAllOrder";//获取所有的购买记录
var getOrderByIdUrl = baseUrl + "lamp/v1/getOrderById";//根据id查询记录
var delOrderUrl = baseUrl + "lamp/v1/delOrder";//删除购买记录
var updOrderUrl = baseUrl + "lamp/v1/updOrder";//编辑支付记录
var updOrderStatusUrl = baseUrl + "lamp/v1/updOrderStatus";//编辑支付记录
var addOrderUrl = baseUrl + "lamp/v1/addOrder";//新增购买记录
var getOrderCountGroupByStatusUrl = baseUrl + "lamp/v1/getOrderCountGroupByStatus";//获取完成订单数  未完成订单数 所有订单数
var getOrderCountGroupByTypeUrl = baseUrl + "lamp/v1/getOrderCountGroupByType"; //根据商品分类查询订单数量
var getAllOrderAmountUrl = baseUrl + "lamp/v1/getAllOrderAmount";//获取订单的今日收入 本月收入
var getAmountCountUrl = baseUrl + "lamp/v1/getAmountCount"; //获取总收入  今日收入
var getEveryOrderCountAndAmountsUrl = baseUrl + "lamp/v1/getEveryOrderCountAndAmounts"; //查询某一个月每天的完成订单数，成交金额，净收入
var getMonthOrderCountAndAmountsUrl = baseUrl + "lamp/v1/getMonthOrderCountAndAmounts"; //查询某年每一月的订单数，总交易额，净收入
var getEarnTotalAndOrderCountUrl = baseUrl + "lamp/v1/getEarnTotalAndOrderCount"; //查询所有的订单交易额 总收入

//用户购物车  新增在小程序中
var getAllPreOrderUrl = baseUrl + "lamp/v1/getAllPreOrder"; 
var getPreOrderByIdUrl = baseUrl + "lamp/v1/getPreOrderById"; 
var updPreOrderStatusUrl = baseUrl + "lamp/v1/updPreOrderStatus"; 
var getPreOrderCountGroupByStatusUrl = baseUrl + "lamp/v1/getPreOrderCountGroupByStatus"; 
var batchAddOrderUrl =  baseUrl + "lamp/v1/batchAddOrder"; //批量生成订单

/***************************/
//页面跳转
// if (localStorage.getItem('token') == null || typeof localStorage.getItem('token') == "undefined") {
//   layer.alert("请登录", {
//       icon: 1,
//       title: '提示框',
//       closeBtn: 0 
//       }, 
//     function () {
//       top.location.href="login.html";
//       return;
//    });
// }

/*********************************************************************************/
//获取url后面的参数
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
       var str = url.substr(1);
       strs = str.split("&");
       for(var i = 0; i < strs.length; i ++) {
           theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
       }
   }
   return theRequest;
}
     


var HttpRequest = function (options) {
  var defaults = {
    type: 'get',
    headers: {},
    data: {},
    dataType: 'json',
    async: true,
    cache: false,
    beforeSend: null,
    success: null,
    error:null,
    complete: null
  };
  var o = $.extend({}, defaults, options);
  $.ajax({
    url: o.url,
    type: o.type,
    headers: {
      'Content-Type': o.contentType,
      'token': o.token
    },
    data: o.data,
    dataType: o.dataType,
    async: o.async,
    beforeSend: function () {
      o.beforeSend && o.beforeSend();
    },
    success: function (res) {
    
    if(res.code==3000){
     // layer.msg(res.msg, 2,8);//登陆过期
     
                   layer.alert(res.msg, {
                        icon: 1,
                        title: '提示框',
                        closeBtn: 0 
                        }, 
                    function () {
                        top.location.href="login.html";

                     });
                   return;


    }

      o.success && o.success(res);
    },
    error: function (err) {
       o.error && o.error(err);
    },
    complete: function () {
      o.complete && o.complete();
    }
  });
};

var loginHttp = function (options) {
  // 登入页无需携带token
  // 后台如果要求 Content-Type 
  if (options.type == 'post') {
    options.contentType = 'application/x-www-form-urlencoded';
  }
  HttpRequest(options);
}
var ajaxHttp = function (options) {
  if (options.type == 'post') {
    options.contentType = 'application/x-www-form-urlencoded';
  }
  // 每次请求携带token
  options.token = localStorage.getItem('token');
  HttpRequest(options);
}



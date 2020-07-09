



jQuery(function($) {

    if (init()) {
        if (orderCount()) {
             findTopThreeUser();
        }
    }
    
})


function init(){

    ajaxHttp({
        url: getSysHomeOrderProductNumUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            var data = res.data;
            if (res.code == 1000) {
                $("#shopUserNum").html(data.shopUserNum);
                $("#OrderCount").html(data.orderNum);
                $("#sellAllGoodsNum").html(data.sellAllGoodsNum);
                $("#earnAllPrice").html("￥"+data.earnAllPrice);

                $("#onShopNum").html(data.onShopNum);
                $("#allShopNum").html(data.allShopNum);
                $("#offShopNum").html(data.offShopNum);

                $("#wechatUserNum").html(data.wechatUserNum);
                $("#offlineUserNum").html(data.offlineUserNum);
                $("#allUserNum").html(data.allUserNum);

               
            }
            
        }
    })
    return true;
}


//最新通知  微信用户最新三名
function findTopThreeUser(){

    ajaxHttp({
        url: findTopThreeUserUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            var data = res.data;
            if (res.code == 1000) {

                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var desc = "用户昵称为<span style='color:red;'>" + data[i].userBase.nickName + "</span>在" + data[i].userBase.createDate + "登陆了小程序";
                    html += '<li><i class="icon-bell red"></i><a href="#">'+ desc +'</a></li>';
                }
                $("#newNotice").html(html);
            }
            
        }
    })
}

function orderCount(){      
    //产品类型
    ajaxHttp({
        url: getOrderCountGroupByStatusUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
           
            var data = res.data;
            if (res.code == 1000) {
                $("#doingOrderCount").html(data.doingOrderCount);
                $("#doneOrderCount").html(data.doneOrderCount);
                $("#allOrderCount").html(data.allOrderCount);    
            }
            
        }
    })

    return true;
}
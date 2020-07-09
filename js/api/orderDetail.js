function showDetail(id){
    ajaxHttp({
        url: getOrderByIdUrl,
        type: 'get',
        data: {
        'id': id
        },
        success: function (res) {
            var data = res.data;

            $(".Numbering b").html(data.orderNo);
            if (data.title != "") {
              $("#num").html("数量：" + data.num);
              $("#coverImg").attr("src",data.coverImg);
              $("#title").html(data.title);
              $("#sellPrice").html('卖出价格：<b class="price"><i>￥</i>'+ data.sellPrice +'</b>');
              $("#costPrice").html('成本价格：<b class="price"><i>￥</i>'+ data.costPrice +'</b>');
              $("#finalPrice").html('最终价格：<b class="price"><i>￥</i>'+ data.finalPrice +'</b>');
              var statusHtml = '状态：<i class="label label-danger radius">已下架</i>';
              $("#goodsStatus").html(data.goodsStatus==0?statusHtml:'状态：<i class="label label-success radius">热卖中</i>');
            }
            
            if (data.sex != null && typeof data.sex != "undefined") {
              $("#userName").html(data.userName);
              $("#phone").html(data.phone);
              $("#sex").html(data.sex == 0?"男":"女");
              $("#userType").html(data.userType==1?"微信用户":"线下用户");
            }
     
            $("#totalPrice").html('总价：<b>'+ data.finalPrice +'</b>元');
            
            $("#createDate").html(data.createDate);
            if (data.status == 1) {
              $("#status").html("已完成");
              $("#updateDate").html(data.updateDate);
            }else{
              $("#status").html("未完成");
              $("#updateDate").html("暂未完成");
            }
            
            $("#orderStatusChange").empty();
            var statusChange = "";
            if (data.status == 1) {
              statuschange = '<li><p>'+ data.createDate +'</p><p>订单未完成</p><span class="before"></span><span class="after"></span></li>'
                            +'<li class="first"><p>'+ data.updateDate +'</p><p>订单已完成</p>'
                            +'<span class="before"></span><span class="after"></span><i class="mh-icon mh-icon-new"></i></li>'
            }else{
              statuschange = '<li class="first"><p>'+ data.createDate +'</p><p>订单未完成</p><span class="before"></span><span class="after">'
                            +'</span><i class="mh-icon mh-icon-new"></i></li>'
                            +'<li><p>'+ data.createDate +'</p><p><u onclick="member_done('+ data.id +')" style="cursor:pointer;display:block;" class="text-primary">修改订单状态</u></p>'
                            +'<span class="before"></span><span class="after"></span></li>'
            } 
            $("#orderStatusChange").append(statuschange);
        }
    })
}

function member_done(id){
    layer.confirm('订单已经完成支付成功了吗？完成之后不可修改！',function(index){
            ajaxHttp({
                url: updOrderStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':1,
                },
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data == 1){
                        layer.msg('订单已完成!',{icon: 6,time:1000});
                         showDetail(id);
                    }else{
                        layer.msg('订单操作失败!',{icon: 5,time:1000});
                    }
                }
            })
           
           
        });
}


jQuery(function($) {

    //获取产品id
    var id =  GetRequest().id;

    showDetail(id);
})
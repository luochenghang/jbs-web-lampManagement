/*radio激发事件*/
function Enable(){ userSelect(1);}
function closes(){userSelect(2);}



function numControl(count){
    if($("#searchtitle").val() == -1){
        layer.alert("请选择产品",{
                    title: '提示框',               
                    icon:0,                             
                }); 
            return false; 
    }
    var num = parseInt($("#num").val());
    if(num == 1 && count == -1){
        return false;
    }else{
        var result = num + count;
        $("#num").val(result);
        if(count > 0 ){
            $("#costPrice").val(parseFloat($("#costPrice").val()) + parseFloat($("#costPriceOne").val()));
            $("#sellPrice").val(parseFloat($("#sellPrice").val()) + parseFloat($("#sellPriceOne").val()));
            $("#finalPrice").val($("#sellPrice").val());
        }else{
            $("#costPrice").val(parseFloat($("#costPrice").val()) - parseFloat($("#costPriceOne").val()));
            $("#sellPrice").val(parseFloat($("#sellPrice").val()) - parseFloat($("#sellPriceOne").val()));
            $("#finalPrice").val($("#sellPrice").val());
        }
        
        
    }
}

function checkParams(orderVo){
    $("#addOrder input[type='text']").each(function(n){
      if($(this).val()=="") {
           
           layer.alert($(this).attr("name")+"不能为空！\r\n",{
                title: '提示框',               
                icon:0,                             
            }); 
        return false;            
      } 
     });

    if(orderVo.goodsId == -1){
        layer.alert("必须选择产品！\r\n",{
            title: '提示框',               
            icon:0,                             
        }); 
        return false;    
    }

    if(isNaN(orderVo.num)){
        layer.alert("购买数量必须是数字！\r\n",{
            title: '提示框',               
            icon:0,                             
        }); 
        return false;    
    }
  

    if (isNaN(orderVo.finalPrice)) {
        layer.alert("最终价必须是数字！",{
                title: '提示框',               
                icon:0,                             
          }); 
          return false; 
    }
    if(orderVo.userId == -1){
        layer.alert("必须选择用户！\r\n",{
            title: '提示框',               
            icon:0,                             
        }); 
        return false;    
    }

    return true;
}

$(function(){
    
//修改订单
    $("#updateOrder").click(function(){

        var orderVo = {};
        orderVo.num = $("#num").val();
        orderVo.goodsId = $("#searchtitle").val();
        orderVo.status = $("input[name='status']:checked").val();;
        orderVo.userId = $("#searchUserId").val();
        orderVo.finalPrice = $("#finalPrice").val();
        orderVo.userType = $("input[name='userType']:checked").val();
        orderVo.id = idAllScope;
        if (!checkParams(orderVo)) {
            return false;
        };

        ajaxHttp({
        url: updOrderUrl,
        type: 'post',
        data: orderVo, 
        success: function (res) {
            
            var code = res.code;
            var html = "";
            if(code == 1000){
               layer.alert('修改成功！', {
                    icon: 1,
                    title: '提示框',
                    closeBtn: 0 
                    }, 
                function () {
                    window.location.href="order_list.html";
                 });
            }else{
            layer.alert(res.msg,{
                    title: '提示框',               
                    icon:1,     
                  });
                
                }
            }
        })
    });
})

//编辑修改时调用
function showDetail(id){
    ajaxHttp({
        url: getOrderByIdUrl,
        type: 'get',
        data: {
        'id': id
        },
        success: function (res) {
            var data = res.data;
            $("#num").val(data.num);
            $("#searchtitle").selectpicker('val',data.goodsId);
            
            ajaxHttp({
                url: getGoodsByIdUrl,
                type: 'get',
                data: {
                    id: data.goodsId
                },  
                success: function (res) {
                    var data = res.data;
                    if (data != null) {
                        //隐藏文本  相当于单价
                        $("#costPriceOne").val(data.costPrice);
                        $("#sellPriceOne").val(data.sellPrice);
                    }
                }
            })


            $("input[name='status'][value="+ data.status +"]").attr("checked",true); 
            
            $("#finalPrice").val(data.finalPrice);
            $("#costPrice").val(data.costPrice);
            $("#sellPrice").val(data.sellPrice);
            $("input[name='userType'][value="+ data.userType +"]").attr("checked",true); 
           
            userSelect(data.userType, data.userId);
            
        }
    })
}
//初始化用户选择 默认为微信用户

function userSelect(userType, userId){
    // 用户列表
    ajaxHttp({
        url: findAllUserByUserTypeUrl,
        type: 'get',
        data: {
            userType: userType
        },  
        success: function (res) {
            $("#searchUserId").empty();
            var data = res.data;
            var html = '<option value="-1">--请选择用户--</option>';
            for(var i=0;i<data.length; i++){
                var phone = "电话暂无"
                if(typeof data[i].phoneNo != "undefined"){
                    phone = data[i].phoneNo;
                }
                if (typeof userId != "undefined" || userId != null) {
                    if (data[i].id == userId) {
                        html += ' <option value="'+ data[i].id +'">' + data[i].nickName + '('+ phone +')</option>';
                    }else{
                        html += ' <option value="'+ data[i].id +'">' + data[i].nickName + '('+ phone +')</option>';
                    }
                }else{
                    html += ' <option value="'+ data[i].id +'">' + data[i].nickName + '('+ phone +')</option>';
                }
                
            }
            console.log(html)
            $('#searchUserId').append(html);
            // 缺一不可
        $('#searchUserId').selectpicker('refresh');
        $('#searchUserId').selectpicker('render');
        if (typeof userId != "undefined" || userId != null) {

            $("#searchUserId").selectpicker('val',userId);
        }
        //searchUserId
        }
    })
}
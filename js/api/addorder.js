/*radio激发事件*/
function Enable(){ userSelect(1);}
function closes(){userSelect(2);}

//初始化用户选择 默认为微信用户
userSelect(1);
function userSelect(userType){
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
                html += ' <option value="'+ data[i].id +'">' + data[i].nickName + '('+ phone +')</option>';
            }
            $('#searchUserId').append(html);
            // 缺一不可
        $('#searchUserId').selectpicker('refresh');
        $('#searchUserId').selectpicker('render');
        //searchUserId
        }
    })
}

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
    
    $("#addOrder").click(function(){

        var orderVo = {};
        orderVo.num = $("#num").val();
        orderVo.goodsId = $("#searchtitle").val();
        orderVo.status = $("input[name='status']:checked").val();
        orderVo.userId = $("#searchUserId").val();
        orderVo.finalPrice = $("#finalPrice").val();
        orderVo.userType = $("input[name='userType']:checked").val();

        checkParams(orderVo);
       
        ajaxHttp({
        url: addOrderUrl,
        type: 'post',
        data: orderVo, 
        success: function (res) {
                
                var code = res.code;
                var html = "";
                if(code == 1000){
                   layer.alert('添加成功！', {
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

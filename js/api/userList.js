//设置全局变量
var value = {};
function tableLoad(status){

    
    if ($("#start").val() != "") {
        value.createDate = $("#start").val();
    }else{
        value.createDate = null;
    }
    if ($("#queryStr").val() != "") {
        value.queryStr = $("#queryStr").val();
    }else{
        value.queryStr = null;
    }


     //$('#sample-table').dataTable().fnClearTable(); //清空一下table
     //$('#sample-table').dataTable().fnDestroy(); //还原初始化了的datatable

    var oTable1 = $('#sample-table').dataTable( {
        "aaSorting": [[ 1, "desc" ]],//默认第几个排序
        "bStateSave": true,//状态保存
        lengthMenu: [10, 20,50, 100],
        "aoColumnDefs": [
          //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
        
         {"orderable":false,"aTargets":[0,9]}// 制定列不参与排序
        ],
        bAutoWidth: false,//是否自动宽度
        bFilter: false, 
        "destroy":true,
        //"sAjaxSource": getAllFileResourceUrl,
        "ajax": {//ajax请求后台
                "url": findAllUserUrl,
                "type": "GET",
                "data": value
                },  

        "columns": [
                    {"data": "userBase.id"},  
                    {"data": "userBase.nickName",
                    "render": function(id, type, data) { // 返回自定义内容
                        
                        if (id == null || typeof id =="undefined") {
                            return "";
                        }
                        return id;
                       }
                    },
                    {"data": "userBase.realName",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (id == null || typeof id =="undefined") {
                            return "";
                        }
                         return id;
                       }
                    },
                    
                    {"data": "userBase.portrait",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (id == null || typeof id =="undefined") {
                            return "";
                        }
                        return '<img src='+ id +'   height="150px"/>';
                       }
                    },
                    {"data": "userBase.sex",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (id == 0) {
                            return "男";
                        }else{
                            return "女";
                        }
                       }
                    },
                    {"data": "userBase.phoneNo",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (id == null || typeof id =="undefined") {
                            return "";
                        }else{
                            return id;
                        }
                       }
                    },
                    {"data": "userBase.address",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (id == null || typeof id =="undefined") {
                            return "";
                        }else{
                            return id;
                        }
                       }
                    },
                    {"data": "userBase.orderCount",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (id == null || typeof id =="undefined") {
                            return "";
                        }else{
                            return id;
                        }
                       }
                    },
                    {"data": "userType",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.userType == 2){
                            return '<span class="label label-info radius">线下用户</span>';
                        }
                        if(data.userType == 1){
                            return '<span class="label label-success radius">微信用户</span>';
                        }
                       }
                    },
                   
                    {"data": "userBase.id",
                    "render": function(id, type, data) { // 返回自定义内容
                        //已完成没有编辑 删除
                        //修改状态只能未完成修改为已完成
                        //只能删除未完成的
                        var operate = '<a title="详细" onClick="member_show('+ id +')"  href="javascript:;"  class="btn btn-xs btn-info order_detailed" ><i class="fa fa-list bigger-120"></i></a>';
                        if (data.userType == 1) {// 修改 删除 修改状态
                            return operate;
                        }else{
                            var statusClick ='<a title="修改" onClick="member_edit('+ id +')"  href="javascript:;"  class="btn btn-xs btn-primary" ><i class="icon-edit bigger-120"></i></a>'
                                            +'<a title="删除" href="javascript:;"  onclick="member_del('+ id +')" class="btn btn-xs btn-warning" ><i class="icon-trash  bigger-120"></i></a>';
                            return operate + statusClick;
                        }
                       }
                    },
                ]
        });
}



/*支付完成*/
function member_edit(id){
        ajaxHttp({
                url: getUserUrl,
                type: 'get',
                data: "id=" + id,
                success: function (res) {
                    
                    var data = res.data;
                    var user = res.data.userBase;
                    var html = "";
                    $("#add_menber_style #nickName").val(user.nickName);
                    $("#add_menber_style #realName").val(user.realName);
                    $("input[name='sex'][value='"+ user.sex +"']").attr("checked",true);
                    $("#add_menber_style #phoneNo").val(user.phoneNo);
                    $("#add_menber_style #address").val(user.address);
                    
                    
                }
            })

    layer.open({
        type: 1,
        title: '修改用户',
        maxmin: true, 
        shadeClose: true, //点击遮罩关闭层
        area : ['800px' , ''],
        content:$('#add_menber_style'),
        btn:['提交','取消'],
        yes:function(index,layero){ 
         var num=0;
         var str="";
     $(".add_menber input[type$='text']").each(function(n){
          if($(this).val()=="")
          {
               
               layer.alert(str+=""+$(this).attr("name")+"不能为空！\r\n",{
                title: '提示框',               
                icon:0,                             
          }); 
            num++;
            return false;            
          } 
         });
          if(num>0){  return false;}        
          else{
          
          var userBase = {};
          
          userBase.nickName = $("#add_menber_style #nickName").val();
          userBase.realName = $("#add_menber_style #realName").val();
          userBase.sex = $("input[name='sex']:checked").val();
          userBase.phoneNo = $("#add_menber_style #phoneNo").val();
          userBase.address = $("#add_menber_style #address").val();
          userBase.id = id;
          
          ajaxHttp({
                url: updUserUrl,
                type: 'post',
                data: userBase,
                success: function (res) {
                    
                    var data = res.data;
                    if(data == 1){
                        layer.alert('修改成功！',{
                           title: '提示框',                
                            icon:1,     
                          });
                        tableLoad();    
                        layer.close(index); 
                    }else{
                        layer.alert(res.msg,{
                           title: '提示框',                
                            icon:1,     
                          });
                           
                    }
                }
            })
          }                                 
        }
    });
}

function member_show(id){
    ajaxHttp({
                url: getUserUrl,
                type: 'get',
                data: "id=" + id,
                success: function (res) {
                    
                    var data = res.data;
                    var user = res.data.userBase;
                    var html = "";
                        if ((typeof user.portrait == "undefined") || user.portrait == null) {
                            $("#member_show img").attr("src","images/user.png");
                        }else{
                            $("#member_show img").attr("src",user.portrait);
                        }

                        
                        $("#member_show #nickName").html(user.nickName);
                        $("#member_show #realName").html(user.realName);
                        $("#member_show #sex").html(user.sex==0?"男":"女");
                        $("#member_show #phoneNo").html(user.phoneNo);
                        $("#member_show #address").html(user.address);
                        $("#member_show #userType").html(data.userType==1?"微信用户":"线下用户");
                        $("#member_show #orderCount").html(user.orderCount + "单");
                        $("#member_show #createDate").html(user.createDate);
                    
                    
                }
            })
   layer.open({
        type: 1,
        title: '用户详情',
        maxmin: true, 
        shadeClose: true, //点击遮罩关闭层
        area : ['800px' , ''],
        content:$('#member_show'),
       
    });
}


/*删除*/
function member_del(id){

    layer.confirm('确认要删除吗？',function(index){
        ajaxHttp({
                url: delUserUrl,
                type: 'get',
                data: "id=" + id,
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data >= 1){
                        layer.msg('已删除!',{icon: 6,time:1000});
                        tableLoad();
                        
                    }else{
                        layer.msg('删除失败!',{icon: 5,time:1000});
                    }
                    
                }
            })
            
    });

}


jQuery(function($) {

    tableLoad();
   
    //查询
    $(".btn_search").on('click' , function(){
        tableLoad(); 
    });
    

    $('table th input:checkbox').on('click' , function(){
        var that = this;
        $(this).closest('table').find('tr > td:first-child input:checkbox')
        .each(function(){
            this.checked = that.checked;
            $(this).closest('tr').toggleClass('selected');
        });
            
    });


    //$('[data-rel="tooltip"]').tooltip({placement: tooltip_placement});
    function tooltip_placement(context, source) {
        var $source = $(source);
        var $parent = $source.closest('table')
        var off1 = $parent.offset();
        var w1 = $parent.width();

        var off2 = $source.offset();
        var w2 = $source.width();

        if( parseInt(off2.left) < parseInt(off1.left) + parseInt(w1 / 2) ) return 'right';
        return 'left';
    }

    
})


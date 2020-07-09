//设置全局变量
var value = {};
value.status = 0;
function tableLoad(status){

    
    if(status != null) {
        value.status = status;
    }
    
    

    if ($("#start").val() != "") {
        value.createDate = $("#start").val();
    }else{
         value.createDate = null;
    }

     //$('#sample-table').dataTable().fnClearTable(); //清空一下table
     //$('#sample-table').dataTable().fnDestroy(); //还原初始化了的datatable

    var oTable1 = $('#sample-table').dataTable( {
        "aaSorting": [[ 7, "desc" ]],//默认第几个排序
        "bStateSave": true,//状态保存
        lengthMenu: [10, 20,50, 100],
        "aoColumnDefs": [
          //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
        
         {"orderable":false,"aTargets":[0]}// 制定列不参与排序
        ],
        bAutoWidth: false,//是否自动宽度
        bFilter: false, 
        "destroy":true,
        //"sAjaxSource": getAllFileResourceUrl,
        "ajax": {//ajax请求后台
                "url": getAllPreOrderUrl,
                "type": "GET",
                "data": value
                },  

        "columns": [
                    {"data": "id",
                     "render":function(id, type, data){
                         return '<label><input name="preOrderId" type="checkbox" value="'+ id +'" class="ace" ><span class="lbl"></span></label>';
                      }
                    },  
                    {"data": "id"},
                    {"data": "userName",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (data.phone == null || typeof data.phone =="undefined") {
                            return id + "(暂无电话)";
                        }else{
                            return id + "("+ data.phone +")";
                        }
                       }
                    },
                    {"data": "title",
                    "render": function(id, type, data) { // 返回自定义内容
                        return '<img src='+ data.coverImg +' title = "'+ id +'"  height="150px"/><u style="cursor:pointer;display:block;" class="text-primary" onclick="view_detail('+ data.id +')">'+ id +'</u>';
                       }
                    },
                   
                    {"data": "sellPrice"},
                    {"data": "createDate"},
                    {"data": "status",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.status == 1){
                                return '<span class="label label-success radius">已生成订单</span>';
                            }
                        if(data.status == 2){
                                return '<span class="label label-danger radius">订单生成失败</span>';
                            }else{
                                 return '<span class="label label-info radius">未处理</span>';
                            }
                       
                       }
                    },
                    {"data": "id",
                    "render": function(id, type, data) { // 返回自定义内容
                        
                        if (data.status == 1) {// 已生成订单
                            return "";
                        }else if (data.status == 2) {// 订单生成失败
                            return "";
                        }else{
                            var statusClick ='<a onClick="member_done('+ id +')"  href="javascript:;" title="生成订单"  class="btn btn-xs btn-success"><i class="icon-ok bigger-120"></i></a>'
                                            +'<a onClick="member_nodo('+ id +')"  href="javascript:;" title="订单生成失败"  class="btn btn-xs btn-danger"><i class="icon-remove bigger-120"></i></a>';

                            return statusClick;
                        }
                       }
                    },
                ]
        });
}




function tabSelect(){      
    //产品类型
    ajaxHttp({
        url: getPreOrderCountGroupByStatusUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            $(".b_P_Sort_list").empty();
            var data = res.data;
            //<li><i class="orange  fa fa-reorder"></i><a href="#">全部订单()</a></li>
            // <li><i class="fa fa-sticky-note pink "></i> <a href="#">未完成(235)</a></li>

            var html = '<li id = "0" style="text-decoration:underline;"><i class="orange  fa fa-reorder"></i><a href="#">未处理('+ data.unReadPreOrderCount +')</a></li>'
                     +'<li id = "1"><i class="fa fa-sticky-note pink "></i> <a href="#">已生成订单('+ data.donePreOrderCount +')</a></li>'
                     +'<li id = "2"><i class="fa fa-sticky-note pink "></i> <a href="#">生成订单失败('+ data.noDoPreOrderCount +')</a></li>';
            if (value.status == 1) {
                 html = '<li id = "0"><i class="orange  fa fa-reorder"></i><a href="#">未处理('+ data.unReadPreOrderCount +')</a></li>'
                     +'<li id = "1" style="text-decoration:underline;"><i class="fa fa-sticky-note pink "></i> <a href="#">已生成订单('+ data.donePreOrderCount +')</a></li>'
                     +'<li id = "2"><i class="fa fa-sticky-note pink "></i> <a href="#">生成订单失败('+ data.noDoPreOrderCount +')</a></li>';
            }
            if (value.status == 2) {
                 html = '<li id = "0" ><i class="orange  fa fa-reorder"></i><a href="#">未处理('+ data.unReadPreOrderCount +')</a></li>'
                     +'<li id = "1"><i class="fa fa-sticky-note pink "></i> <a href="#">已生成订单('+ data.donePreOrderCount +')</a></li>'
                     +'<li id = "2" style="text-decoration:underline;"><i class="fa fa-sticky-note pink "></i> <a href="#">生成订单失败('+ data.noDoPreOrderCount +')</a></li>';
            }
            
           
            //左边显示  包含数量
            $(".b_P_Sort_list").append(html);

            $("#AllpreOrderCount").html(parseInt(data.donePreOrderCount) + parseInt(data.unReadPreOrderCount) + parseInt(data.noDoPreOrderCount));
        }
    })
}


/*生成待支付订单完成*/
function member_done(id){
    layer.confirm('你确定生成订单吗？完成之后不可修改！',function(index){
            ajaxHttp({
                url: updPreOrderStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':1,
                },
                success: function (res) {
                    
                    var data = res.data;
                    if(data >= 1){
                        layer.msg('操作成功,待支付订单已创建!',{icon: 6,time:1000});
                         tableLoad();
                         tabSelect();

                        //子页面调父页面方法使用postMessage
                        window.parent.postMessage("", "*");
                    }else{
                        layer.msg(res.msg,{icon: 5,time:1000});
                    }
                }
            })
           
           
        });
}

/*设置订单失败完成*/
function member_nodo(id){
    layer.confirm('你要设置该用户的预购订单失效吗？完成之后不可再操作！',function(index){
            ajaxHttp({
                url: updPreOrderStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':2,
                },
                success: function (res) {
                    
                    var code = res.code;
                    if(code == 1000){
                        layer.msg('操作完成!',{icon: 6,time:1000});
                         tableLoad();
                         tabSelect();
                          
                    //子页面调父页面方法使用postMessage
                    window.parent.postMessage("", "*");
                    }else{
                        layer.msg('操作失败!',{icon: 5,time:1000});
                    }
                }
            })
           
           
        });
}


jQuery(function($) {

    tableLoad();
    tabSelect();
    //点击左边的筛选
    $(document).on("click", ".b_P_Sort_list li", function () {

        $(this).css("text-decoration","underline");
        $(this).siblings().css("text-decoration","none");
        var id = $(this).attr("id");
        tableLoad(id); 
    });
    //查询
    $(".btn_search").on('click' , function(){
        tableLoad(); 
    });
  //清空
    $("#emptyData").on('click' , function(){
        $("#start").val("");
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

    $("#batchAddOrder").on('click', function(){
    
        layer.confirm('确认要一键生成待支付订单吗？',function(index){
            var ids = [];
            $("input[name='preOrderId']:checked").each(function (index, item) {
                 ids[index] = $(this).val();
            })
            if(ids.length == 0){
                layer.alert('请选择资源列表！',{
                    title: '提示框',               
                    icon:0,     
                });
                return false;
            }
        
            ajaxHttp({
                    url: batchAddOrderUrl,
                    type: 'post',
                    data: "ids=" + ids,
                    success: function (res) {
                        var code = res.code;
                        if(code == 1000){
                            layer.msg('操作成功!',{icon: 6,time:1000});
                             tableLoad();
                             tabSelect();
                        }else{
                            layer.alert(res.msg,{
                                title: '提示框',               
                                icon:5,     
                            });
                        }
                       
                    }
                })
                
        });
        
    })
})


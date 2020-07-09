//设置全局变量
var value = {};
function tableLoad(status){

    
    if(status != null) {
        value.status = status;
    }
    if(status == -1) {
        value.status = null;
    }
    if ($("#searchOrderNo").val() != "") {
        value.orderNo = $("#searchOrderNo").val();
    }else{
        value.orderNo = null;
    }

    if ($("#searchTitle").val() != "") {
        value.title = $("#searchTitle").val();
    }else{
         value.title = null;
    }

    if ($("#searchUserName").val() != "") {
        value.userName = $("#searchUserName").val();
    }else{
         value.userName = null;
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
        
         {"orderable":false,"aTargets":[0,9]}// 制定列不参与排序
        ],
        bAutoWidth: false,//是否自动宽度
        bFilter: false, 
        "destroy":true,
        //"sAjaxSource": getAllFileResourceUrl,
        "ajax": {//ajax请求后台
                "url": getAllOrderUrl,
                "type": "GET",
                "data": value
                },  

        "columns": [
                    {"data": "id",
                     "render":function(id, type, data){
                         return '<label><input name="orderId" type="checkbox" value="'+ id +'" class="ace" ><span class="lbl"></span></label>';
                      }
                    },  
                    {"data": "orderNo"},
                    {"data": "title",
                    "render": function(id, type, data) { // 返回自定义内容
                        return '<img src='+ data.coverImg +' title = "'+ id +'"  height="150px"/><u style="cursor:pointer;display:block;" class="text-primary" onclick="view_detail('+ data.id +')">'+ id +'</u>';
                       }
                    },
                    {"data": "num"},
                    {"data": "userName",
                    "render": function(id, type, data) { // 返回自定义内容
                        if (data.phone == null || typeof data.phone =="undefined") {
                            return id + "(暂无电话)";
                        }else{
                            return id + "("+ data.phone +")";
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
                    {"data": "finalPrice"},
                    {"data": "createDate"},
                    {"data": "status",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.status == 0){
                                return '<span class="label label-danger radius">未完成</span>';
                            }else{
                                return '<span class="label label-success radius">已完成</span>';
                            }
                       }
                    },
                    {"data": "id",
                    "render": function(id, type, data) { // 返回自定义内容
                        //已完成没有编辑 删除
                        //修改状态只能未完成修改为已完成
                        //只能删除未完成的
                        var operate = '<a title="订单详细"  href="order_detailed.html?id='+ id +'"  class="btn btn-xs btn-info order_detailed" ><i class="fa fa-list bigger-120"></i></a>';
                        if (data.status == 1) {// 修改 删除 修改状态
                            return operate;
                        }else{
                            var statusClick ='<a onClick="member_done('+ id +')"  href="javascript:;" title="已完成"  class="btn btn-xs btn-success"><i class="icon-ok bigger-120"></i></a>'
                                            +'<a title="修改订单" href="order-edit.html?id='+ id +'"  class="btn btn-xs btn-primary" ><i class="icon-edit bigger-120"></i></a>'
                                            +'<a title="删除订单" href="javascript:;"  onclick="member_del('+ id +')" class="btn btn-xs btn-warning" ><i class="icon-trash  bigger-120"></i></a>';
                            return operate + statusClick;
                        }
                       }
                    },
                ]
        });
}


function view_detail(id){
    window.location.href = "order_detailed.html?id="+id;
}

function tabSelect(){      
    //产品类型
    ajaxHttp({
        url: getOrderCountGroupByStatusUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            $(".b_P_Sort_list").empty();
            var data = res.data;
            //<li><i class="orange  fa fa-reorder"></i><a href="#">全部订单()</a></li>
            // <li><i class="fa fa-sticky-note pink "></i> <a href="#">未完成(235)</a></li>

            var html = '<li id = "-1" style="text-decoration:underline;"><i class="orange  fa fa-reorder"></i><a href="#">全部订单('+ data.allOrderCount +')</a></li>'
                     +'<li id = "0"><i class="fa fa-sticky-note pink "></i> <a href="#">未完成('+ data.doingOrderCount +')</a></li>'
                     +'<li id = "1"><i class="fa fa-sticky-note pink "></i> <a href="#">已完成('+ data.doneOrderCount +')</a></li>';
            if (value.status == 1) {
                html = '<li id = "-1"><i class="orange  fa fa-reorder"></i><a href="#">全部订单('+ data.allOrderCount +')</a></li>'
                     +'<li id = "0"><i class="fa fa-sticky-note pink "></i> <a href="#">未完成('+ data.doingOrderCount +')</a></li>'
                     +'<li id = "1" style="text-decoration:underline;"><i class="fa fa-sticky-note pink "></i> <a href="#">已完成('+ data.doneOrderCount +')</a></li>'; 
            }
            if (value.status == 0) {
                html = '<li id = "-1"><i class="orange  fa fa-reorder"></i><a href="#">全部订单('+ data.allOrderCount +')</a></li>'
                     +'<li id = "0" style="text-decoration:underline;"><i class="fa fa-sticky-note pink "></i> <a href="#">未完成('+ data.doingOrderCount +')</a></li>'
                     +'<li id = "1"><i class="fa fa-sticky-note pink "></i> <a href="#">已完成('+ data.doneOrderCount +')</a></li>'; 
            }
            
           
            //左边显示  包含数量
            $(".b_P_Sort_list").append(html);

            $(".orderSumCount").html(data.allOrderCount);
        }
    })
}


/*支付完成*/
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
                         tableLoad();
                         tabSelect();
                         pieChartInit();
                    }else{
                        layer.msg('订单操作失败!',{icon: 5,time:1000});
                    }
                }
            })
           
           
        });
}


/*删除*/
function member_del(id){
var ids = [];
ids[0] = id;
    layer.confirm('确认要删除吗？',function(index){
        ajaxHttp({
                url: delOrderUrl,
                type: 'get',
                data: "ids=" + ids,
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data >= 1){
                        layer.msg('已删除!',{icon: 6,time:1000});
                        tableLoad();
                        tabSelect();
                        pieChartInit();
                    }else{
                        layer.msg('删除失败!',{icon: 5,time:1000});
                    }
                    
                }
            })
            
    });

}


jQuery(function($) {

    tableLoad();
    tabSelect();
    pieChartInit();
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
        $("#searchTitle").val("");
        $("#searchOrderNo").val("");
        $("#searchUserName").val("");
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

    $("#batchDelete").on('click', function(){
    
        layer.confirm('确认要删除吗？',function(index){
            var ids = [];
            $("input[name='orderId']:checked").each(function (index, item) {
                 ids[index] = $(this).val();
            })
            if(ids.length == 0){
                layer.alert('请选择订单列表！',{
                    title: '提示框',               
                    icon:0,     
                });
                return false;
            }
        
            ajaxHttp({
                    url: delOrderUrl,
                    type: 'get',
                    data: "ids=" + ids,
                    success: function (res) {
                        var data = res.data;
                        if(data >= 1){
                            layer.msg('已删除!',{icon: 6,time:1000});
                        }else{
                            layer.msg('删除失败!',{icon: 5,time:1000});
                        }
                        tableLoad();
                        tabSelect();
                        pieChartInit();
                    }
                })
                
        });
        
    })
})


function pieChartInit(){
    var color = ["#D15B47","#87CEEB","#87B87F","#d63116","#ff6600","#2ab023","#1e3ae6","#c316a9","#13a9e1"];
    
    ajaxHttp({
        url: getOrderCountGroupByTypeUrl,
        type: 'get',
        data: {},
        success: function (res) {
            var data = res.data;
            var html = "";
            var sumOrderCount = 0;
            for (var i = 0; i < data.length; i++) {
                sumOrderCount += parseInt(data[i].orderCount);
            }

            if (sumOrderCount != 0) {
                for (var i = 0; i < data.length; i++) {
                    var j = i;
                    if (i > color.length) {
                        j = i%color.length;
                    }
                    html += '<div class="proportion"> <div class="easy-pie-chart percentage" '
                    +'data-percent="'+ (parseInt(data[i].orderCount)*100/sumOrderCount).toFixed(2) +'" data-color="'+ color[j] +'"><span class="percent">'+ (parseInt(data[i].orderCount)*100/sumOrderCount).toFixed(2)+'</span>%</div><span class="name">'+ data[i].name +'('+ data[i].orderCount +')</span></div>';
                }    
            }else{
               html = '<div class="proportion"> <div class="easy-pie-chart percentage" data-percent="0" data-color="#D15B47"><span class="percent">0</span>%</div><span class="name">没有订单数量</span></div>'; 
            }
            var oldie = /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase());
            $("#orderCountGroupByType").empty();
            $("#orderCountGroupByType").append(html);
            $('.easy-pie-chart.percentage').each(function(){
                $(this).easyPieChart({
                    barColor: $(this).data('color'),
                    trackColor: '#EEEEEE',
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: 10,
                    animate: oldie ? false : 1000,
                    size:103
                }).css('color', $(this).data('color'));
            });
           
        }
    })
}
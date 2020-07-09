//设置全局变量
var value = {};

function tableLoad(type){

 if(type != null) {
        value.type = type;
    }
    if(type == 0) {
        value.type = null;
    }
    if ($("#searchStatus").val() != -1) {
        value.status = $("#searchStatus").val();
    }else{
        value.status = null;
    }

    if ($("#searchTitle").val() != "") {
        value.title = $("#searchTitle").val();
    }else{
         value.title = null;
    }

     $('#sample-table').dataTable().fnClearTable(); //清空一下table
     $('#sample-table').dataTable().fnDestroy(); //还原初始化了的datatable
    
    var oTable1 = $('#sample-table').dataTable( {
        "aaSorting": [[ 1, "desc" ]],//默认第几个排序
        "bStateSave": true,//状态保存
        lengthMenu: [10, 20,50, 100],
        "aoColumnDefs": [
          //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
        
         {"orderable":false,"aTargets":[0,4,9]}// 制定列不参与排序
        ],
        bAutoWidth: false,//是否自动宽度
        bFilter: false, 
        "destroy":true,
        //"sAjaxSource": getAllFileResourceUrl,
        "ajax": {//ajax请求后台
                "url": getAllFileResourceUrl,
                "type": "GET",
                "data": value
                },  

        "columns": [
                    {"data": "id",
                     "render":function(id, type, data){
                         return '<label><input name="fileId" type="checkbox" value="'+ id +'" class="ace" ><span class="lbl"></span></label>';
                      }
                    },  
                    {"data": "id"},
                    {"data": "title"},
                    {"data": "sort"},
                    {"data": "url",
                     "render": function(id, type, data) { // 返回自定义内容
                        return '<span class="ad_img"><img src='+ id +'  height="150px"/></span>';
                       }
                    },
                    {"data": "type"},
                    {"data": "typeDesc"},
                    {"data": "createDate"},
                    {"data": "status",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.status == 0){
                                return '<span class="label label-danger radius">已禁用</span>';
                            }else{
                                return '<span class="label label-success radius">已启用</span>';
                            }
                       }
                    },
                    {"data": "id",
                    "render": function(id, type, data) { // 返回自定义内容
                        var operate = '<a title="删除" href="javascript:;"  onclick="member_del('+ id +')" class="btn btn-xs btn-warning" ><i class="icon-trash  bigger-120"></i></a>';
                        if(data.status == 0){
                                var statusClick = '<a onClick="member_stop(1,'+ id +')"  href="javascript:;" title="启用"  class="btn btn-xs btn-success"><i class="icon-unlock bigger-120"></i></a>';
                                return statusClick + operate;
                            }else{
                                var statusClick = '<a onClick="member_stop(0,'+ id +')"  href="javascript:;" title="停用"  class="btn btn-xs btn-success"><i class="icon-unlock-alt bigger-120"></i></a>';
                                return statusClick + operate;
                            }
                       }
                    },
                ]
        });
        
    
   
}

function tabSelect(){      
    //左边显示
    ajaxHttp({
        url: getAllFileResourceGroupByTypeUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            $(".b_P_Sort_list").empty();
            var data = res.data;
            var html = "";
            if (value.length ==0 || typeof value.type == "undefined" ) {
                html = '<li id="-1" style="text-decoration:underline;"><i class="orange  fa fa-user-secret"></i></i><a href="#" >全部('+ data[0].sumCount +')</a></li>';
                for(var i=0;i<data.length; i++){
                    html += ' <li id = "'+ data[i].type +'"><i class="fa fa-image pink "></i> <a href="#" >'+data[i].typeDesc + '(' + data[i].typeCount + ')' +'</a></li>';
                }
            }else{
                html = '<li id="-1"><i class="orange  fa fa-user-secret"></i></i><a href="#" >全部('+ data[0].sumCount +')</a></li>';
                for(var i=0;i<data.length; i++){
                    if (data[i].type == value.type) {
                        html += ' <li id = "'+ data[i].type +'" style="text-decoration:underline;"><i class="fa fa-image pink "></i> <a href="#" >'+data[i].typeDesc + '(' + data[i].typeCount + ')' +'</a></li>';
                    }else{
                        html += ' <li id = "'+ data[i].type +'"><i class="fa fa-image pink "></i> <a href="#" >'+data[i].typeDesc + '(' + data[i].typeCount + ')' +'</a></li>';                        
                    }
                    
                }
            }
            //  html = '<li id="-1" style="text-decoration:underline;"><i class="orange  fa fa-user-secret"></i></i><a href="#" >全部('+ data[0].sumCount +')</a></li>';
            // }
            // for(var i=0;i<data.length; i++){
            //     html += ' <li id = "'+ data[i].type +'"><i class="fa fa-image pink "></i> <a href="#" >'+data[i].typeDesc + '(' + data[i].typeCount + ')' +'</a></li>';
            // }
            $(".b_P_Sort_list").append(html);
            $(".SumCount").html(data[0].sumCount);
        }
    })
}

/*停用*/
function member_stop(status,id){
    if(status == 1){
        layer.confirm('确认要启用吗？',function(index){
            ajaxHttp({
                url: updFileStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':status,
                },
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data == 1){
                        layer.msg('已启用!',{icon: 6,time:1000});
                    }else{
                        layer.msg('启用失败!',{icon: 5,time:1000});
                    }
                }
            })
           
            tableLoad();
        });
    }else{
        layer.confirm('确认要停用吗？',function(index){
            ajaxHttp({
                url: updFileStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':status,
                },
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data == 1){
                        layer.msg('已停用!',{icon: 6,time:1000});
                    }else{
                        layer.msg('停用失败!',{icon: 5,time:1000});
                    }
                }
            })
            tableLoad();
        });
    }
}


/*删除*/
function member_del(id){
var ids = [];
ids[0] = id;
    layer.confirm('确认要删除吗？',function(index){
        ajaxHttp({
                url: delFileResourceUrl,
                type: 'get',
                data: "ids=" + ids,
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data >= 1){
                        layer.msg('已删除!',{icon: 6,time:1000});
                    }else{
                        layer.msg('删除失败!',{icon: 5,time:1000});
                    }
                     tableLoad();
                     tabSelect();
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
        if (id == -1) {
            //全部
            tableLoad(0);
        }else{
           tableLoad(id); 
       }
    });
    //查询
    $(".btn_search").on('click' , function(){
        tableLoad(); 
    });
    //清空
    $("#emptyData").on('click' , function(){
        $("#searchTitle").val("");
        $("#searchStatus").val("-1");
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
            $("input[name='fileId']:checked").each(function (index, item) {
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
                    url: delFileResourceUrl,
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
                    }
                })
                
        });
        
    })
})
//设置全局变量

function tableLoad(){

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
        ajax: {//ajax请求后台
                url: findSysUserListUrl,
                type: "GET",
                data: {},
                },  
                

        "columns": [
                    {"data": "id",
                     "render":function(id, type, data){
                         return '<label><input name="sysUserId" type="checkbox" value="'+ id +'" class="ace" ><span class="lbl"></span></label>';
                      }
                    },  
                    {"data": "id"},
                    {"data": "userName"},
                    {"data": "realName",
					"render":function(id, type, data){
                         return id == null?" ": id;
                      }
					},
                    {"data": "email",
					"render":function(id, type, data){
                         return id == null?" ": id;
                      }
					},
                    {"data": "createDate"},
                    {"data": "lastLoginTime",
                        "render":function(id, type, data){
                         return id == null?"暂未登陆": id;
                      }
                    },
                    {"data": "loginNum"},
                    {"data": "status",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.status == 1){
                                return '<span class="label label-success radius">正常</span>';
                            }else{
                                return '<span class="label label-danger radius">禁用</span>';
                            }
                       }
                    },
                    {"data": "id",
                    "render": function(id, type, data) { // 返回自定义内容
                        
                         var operate ='<a title="删除" href="javascript:;"  onclick="member_del('+ id +')" class="btn btn-xs btn-warning" ><i class="icon-trash  bigger-120"></i></a>';
                        if(data.status == 1){
                            var statusClick ='<a onClick="member_stop(2,'+ id +')"  href="javascript:;" title="禁用"  class="btn btn-xs btn-danger"><i class="icon-remove bigger-120"></i></a>';
                            return statusClick + operate;
                        }else{
                            var statusClick = '<a onClick="member_stop(1,'+ id +')"  href="javascript:;" title="激活"  class="btn btn-xs btn-success"><i class="icon-ok bigger-120"></i></a>';
                            return statusClick + operate;
                        }  
                       }
                    },
                ]
        });
}





/*支付完成*/
function member_stop(status, id){
    var statusDesc = "确认要激活该用户吗？";
    if (status == 2) {
        statusDesc = "确认要禁用该用户吗？";
    }
    layer.confirm(statusDesc,function(index){
            ajaxHttp({
                url: updateSysUserStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':status,
                },
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(res.code == 1000){
                        layer.msg('更新成功!',{icon: 6,time:1000});
                         tableLoad();
                    }else{
                        layer.msg(res.msg,{icon: 5,time:1000});
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
                url: delSysUserUrl,
                type: 'get',
                data: "ids=" + ids,
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(res.code == 1000){
                        layer.msg('已删除!',{icon: 6,time:1000});
                        tableLoad();
                        
                    }else{
                        layer.msg(res.msg, {icon: 5,time:1000});
                    }
                    
                }
            })
            
    });

}


jQuery(function($) {

    tableLoad();
    
    
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
            $("input[name='sysUserId']:checked").each(function (index, item) {
                 ids[index] = $(this).val();
            })
            if(ids.length == 0){
                layer.alert('请选择用户列表！',{
                    title: '提示框',               
                    icon:0,     
                });
                return false;
            }
        
            ajaxHttp({
                url: delSysUserUrl,
                type: 'get',
                data: "ids=" + ids,
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(res.code == 1000){
                        layer.msg('已删除!',{icon: 6,time:1000});
                        tableLoad();
                        
                    }else{
                        layer.msg(res.msg, {icon: 5,time:1000});
                    }
                    
                }
            })
                
        });
        
    })
})


/*添加管理员*/
$('#administrator_add').on('click', function(){
    //$("#form-admin-add")[0].reset();
    layer.open({
    type: 1,
    title:'添加管理员',
    maxmin: true, 
    area: ['800px',''],
    shadeClose: false,
    content: $('#add_administrator_style'),
    btn:['确定','取消'],  
    yes:function(index,layero){
        $("#form-admin-add").submit();
        }   
    });

})



function add_administrator(){

    ajaxHttp({
        url: regUrl,
        type: 'post',
        data: $("#form-admin-add").serialize(), 
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
                        window.location.href="administrator.html";
                     });
                }else{
                layer.alert(res.msg,{
                        title: '提示框',               
                        icon:1,     
                      });
                }
            }
        })
}

    //表单验证提交
$("#form-admin-add").Validform({
        
         tiptype:2,
         //可用的值有：1、2、3、4和function函数，默认tiptype为1。
        //1代表自定义弹出框提示。
        //2代表侧边提示，会在当前元素的父级的next对象的子级查找显示提示信息的对象。
        //3也是代表的侧边提示，不过它是会在当前元素的siblings对象中查找显示提示信息的对象
        //4也是侧边显示会在当前元素的父级的next对象下查找显示提示信息的对象
         beforeSubmit: function (curform) {
             add_administrator();
             return false;
             //这里明确return false的话表单将不会提交;
         },
        callback:function(data){
        
        
        
        }
        
    });

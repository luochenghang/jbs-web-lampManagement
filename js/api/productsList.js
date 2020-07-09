//设置全局变量
var value = {};
function tableLoad(goodsTypeId){

    
    if(goodsTypeId != null) {
        value.goodsTypeId = goodsTypeId;
    }
    if(goodsTypeId == 0) {
        value.goodsTypeId = null;
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

     //$('#sample-table').dataTable().fnClearTable(); //清空一下table
     //$('#sample-table').dataTable().fnDestroy(); //还原初始化了的datatable

    var oTable1 = $('#sample-table').dataTable( {
        "aaSorting": [[ 1, "desc" ]],//默认第几个排序
        "bStateSave": true,//状态保存
        lengthMenu: [10, 20,50, 100],
        "aoColumnDefs": [
          //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
        
         {"orderable":false,"aTargets":[0,3,8]}// 制定列不参与排序
        ],
        bAutoWidth: false,//是否自动宽度
        bFilter: false, 
        "destroy":true,
        //"sAjaxSource": getAllFileResourceUrl,
        "ajax": {//ajax请求后台
                "url": getAllGoodsUrl,
                "type": "GET",
                "data": value
                },  

        "columns": [
                    {"data": "id",
                     "render":function(id, type, data){
                         return '<label><input name="goodsId" type="checkbox" value="'+ id +'" class="ace" ><span class="lbl"></span></label>';
                      }
                    },  
                    {"data": "id"},
                    {"data": "title",
                    "render": function(id, type, data) { // 返回自定义内容
                        return '<u style="cursor:pointer" class="text-primary" onclick="view_detail('+ data.id +')">'+ id +'</u>';
                       }
                    },
                    {"data": "coverImg",
                     "render": function(id, type, data) { // 返回自定义内容
                        return '<span class="ad_img"><img src='+ id +'  height="150px"/></span>';
                       }
                    },
                    {"data": "costPrice"},
                    {"data": "sellPrice"},
                    {"data": "sellCount"},
                    {"data": "typeDesc"},
                    {"data": "status",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.status == 0){
                                return '<span class="label label-danger radius">未上架</span>';
                            }else{
                                return '<span class="label label-success radius">已上架</span>';
                            }
                       }
                    },
                    {"data": "id",
                    "render": function(id, type, data) { // 返回自定义内容
                        var operate = '<a title="编辑" onclick="member_edit('+ id +')" href="javascript:;"  class="btn btn-xs btn-info" ><i class="icon-edit bigger-120"></i></a>'
                        +'<a title="设计" href="javascript:;" onclick=\'member_design('+ id +',"' + data.title +'")\'  class="btn btn-xs btn-primary" ><i class="icon-cog  bigger-120"></i></a>'
                        +'<a title="删除" href="javascript:;"  onclick="member_del('+ id +')" class="btn btn-xs btn-warning" ><i class="icon-trash  bigger-120"></i></a>';
                        if(data.status == 0){
                                var statusClick ='<a onClick="member_stop(1,'+ id +')"  href="javascript:;" title="上架"  class="btn btn-xs btn-success"><i class="icon-ok bigger-120"></i></a>';
                                return statusClick + operate;
                            }else{
                                var statusClick = '<a onClick="member_stop(0,'+ id +')"  href="javascript:;" title="下架"  class="btn btn-xs btn-success"><i class="icon-remove bigger-120"></i></a>';
                                return statusClick + operate;
                            }
                       }
                    },
                ]
        });
}


function view_detail(id){
    window.location.href = "product-detail.html?id="+id;
}

function tabSelect(){      
    //产品类型
    ajaxHttp({
        url: getAllGoodsTypeUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            $(".b_P_Sort_list").empty();
            var data = res.data;
            var html = "";
            if (value.length ==0 || typeof value.goodsTypeId == "undefined" ) {
                var html = '<li id="-1" style="text-decoration:underline;"><i class="orange icon-folder-close"></i></i><a href="#">全部('+ data[0].sumCount +')</a></li>';
                for(var i=0;i<data.length; i++){
                    html += ' <li id = "'+ data[i].id +'"><i class="icon-file-text grey"></i> <a href="#">'+data[i].name + '(' + data[i].goodsCount + ')' +'</a></li>';
                }

            }else{
                html = '<li id="-1"><i class="orange icon-folder-close"></i></i><a href="#">全部('+ data[0].sumCount +')</a></li>';
                for(var i=0;i<data.length; i++){
                    if (data[i].id == value.goodsTypeId) {
                        html += ' <li id = "'+ data[i].id +'" style="text-decoration:underline;"><i class="icon-file-text grey"></i> <a href="#">'+data[i].name + '(' + data[i].goodsCount + ')' +'</a></li>';
                    }else{
                        html += ' <li id = "'+ data[i].id +'"><i class="icon-file-text grey"></i> <a href="#">'+data[i].name + '(' + data[i].goodsCount + ')' +'</a></li>';
                    }
                    
                }
            }    
            
            //左边显示  包含数量
            $(".b_P_Sort_list").append(html);

            $(".goodsSumCount").html(data[0].sumCount);
           
            //修改产品下拉框
            $("#goodsTypeId").empty();
            var str = '<option value="-1">--选择所属分类--</option>';
            for(var i=0;i<data.length; i++){
                str += ' <option value="'+ data[i].id +'">' + data[i].name + '</option>';
            }
            $("#goodsTypeId").append(str);

        }
    })
}

function member_design(id, title){
    $("#titleSwiper").val(title);
    //清空
    $("#sort").val('');
    $("input[name='swiperImg']").val('');
    $("#swiperTempImg").attr("src","images/image.png")
      layer.open({
        type: 1,
        title: '添加产品详细轮播图',
        maxmin: true, 
        shadeClose: false, //点击遮罩关闭层
        area : ['800px' , '50%'],
        content:$('#add_goods_banner'),
        btn:['提交','取消'],
        yes:function(index,layero){ 
         var num=0;
         var str="";
     $("#add_goods_banner input[type$='text']").each(function(n){
          if($(this).val()==""){
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
          if(isNaN($("#sort").val())){
              layer.alert("排序必须是数字！\r\n",{
                    title: '提示框',               
                    icon:0,                             
              }); 
              return false;    
          }
          var $file1 = $("input[name='swiperImg']").val();//用户文件内容(文件)
            // 判断文件是否为空 
            if ($file1 == "") {
            layer.alert("请选择上传的产品轮播资源！\r\n",{
                    title: '提示框',               
                    icon:0,                             
              }); 
                return false;
            }
          var formData = new FormData();
          formData.append('file',  $('#swiperImg')[0].files[0]);
         formData.append('objId', id); //业务id 和商品对应
          formData.append('sort', $("#sort").val());
          formData.append('type', 3);//3是系统定义好了 表示商品轮播图
          formData.append('typeDesc', '商品轮播图！');
          $.ajax({
                url: uploadBannerUrl,
                type: 'post',
                data: formData,
                async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                success: function (res) {
                    
                    var data = res.data;
                    
                    if(res.code == 1000){
                        layer.alert('添加成功！',{
                            title: '提示框',               
                            icon:1,     
                          });
                    }else{
                    layer.alert(res.msg,{
                            title: '提示框',               
                            icon:1,     
                          });
                        
                    }
                layer.close(index); 
                //tableLoad(value); //可以执行 也可以不执行 因为页面没有变化 但是数据变了
                }
            })
          }                                 
        }
    });
}


function member_edit(id){

    ajaxHttp({
        url: getGoodsByIdUrl,
        type: 'get',
        data: {
        'id': id
        },
        success: function (res) {
            var data = res.data;
            $("#title").val(data.title);
            $("#goodsTypeId").val(data.goodsTypeId);

            $("#sellPrice").val(data.sellPrice);
            $("#costPrice").val(data.costPrice);

            $("#title").val(data.title);
            $("#img").attr("src",data.coverImg);
        }
    })

      layer.open({
        type: 1,
        title: '修改产品信息',
        maxmin: true, 
        shadeClose: false, //点击遮罩关闭层
        area : ['750px' , ''],
        content:$('#add_ads_style'),
        btn:['提交','取消'],
        yes:function(index,layero){ 
         var num=0;
         var str="";
         var title = $("#title").val();
         var goodsType = $("#goodsTypeId").val();
         var costPrice = $("#costPrice").val();
         var sellPrice = $("#sellPrice").val();
         var coverImg = $("#coverImg").val();

     $("#add_picture input[type='text']").each(function(n){
          if($(this).val()=="") {
               
               layer.alert($(this).attr("name")+"不能为空！\r\n",{
                    title: '提示框',               
                    icon:0,                             
                }); 
            return false;            
          } 
         });

        if(goodsType == -1){
              layer.alert("必须选择产品类型！\r\n",{
                    title: '提示框',               
                    icon:0,                             
              }); 
              return false;    
          }
        // var $file1 = $("input[name='coverImg']").val();//封面图
        //     // 判断文件是否为空 
        // if ($file1 == "") {
        //     layer.alert("请选择封面图！\r\n",{
        //             title: '提示框',               
        //             icon:0,                             
        //       }); 
        //     return false;
        // }

        if (isNaN(costPrice) || costPrice=="") {
            layer.alert("成本价必须是数字！",{
                    title: '提示框',               
                    icon:0,                             
              }); 
              return false; 
        }

        if (isNaN(sellPrice) || sellPrice=="") {
            layer.alert("卖出价必须是数字！",{
                    title: '提示框',               
                    icon:0,                             
              }); 
              return false; 
        }
       
         var formData = new FormData();
          formData.append('file',  $('#coverImg')[0].files[0]);
          formData.append('title', title);
          formData.append('id', id);
          formData.append('goodsTypeId', goodsType);
          formData.append('costPrice', costPrice);
          formData.append('sellPrice', sellPrice);
          $.ajax({
                url: updGoodsUrl,
                type: 'post',
                data: formData,
                async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                success: function (res) {
                    
                    var code = res.code;
                    var html = "";
                    if(code == 1000){
                       layer.msg('修改成功!',{icon: 6,time:1000});
                       layer.close(index); 
                        tableLoad();
                        tabSelect();
                    }else{
                        layer.alert(res.msg, {
                            icon: 1,
                            title: '提示框',
                            closeBtn: 0 
                        });
                    }
                    
                }
            })

          }                                 

    });
}

/*停用*/
function member_stop(status,id){
    if(status == 1){
        layer.confirm('确认要上架吗？',function(index){
            ajaxHttp({
                url: updGoodsStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':status,
                },
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data == 1){
                        layer.msg('已上架!',{icon: 6,time:1000});
                    }else{
                        layer.msg('上架失败!',{icon: 5,time:1000});
                    }
                }
            })
           
            tableLoad();
        });
    }else{
        layer.confirm('确认要下架吗？',function(index){
            ajaxHttp({
                url: updGoodsStatusUrl,
                type: 'post',
                data: {
                'id':id,
                'status':status,
                },
                success: function (res) {
                    
                    var data = res.data;
                    var html = "";
                    if(data == 1){
                        layer.msg('已下架!',{icon: 6,time:1000});
                    }else{
                        layer.msg('下架失败!',{icon: 5,time:1000});
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
                url: delGoodsUrl,
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
            $("input[name='goodsId']:checked").each(function (index, item) {
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
                    url: delGoodsUrl,
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
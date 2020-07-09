function showDetail(id){
    ajaxHttp({
        url: getGoodsByIdUrl,
        type: 'get',
        data: {
        'id': id
        },
        success: function (res) {
            var data = res.data;
            $("#title").html(data.title);
            $("#typeDesc").html(data.typeDesc);

            $("#sellPrice").html(data.sellPrice + "元");
            $("#costPrice").html(data.costPrice + "元");
            $("#status").html(data.status==0?"已下架":"已上架");
            $("#sellCount").html("共" + data.sellCount + "件");
            $("#createDate").html(data.createDate);
            $("#id").html(data.id);
            $("#coverImg").attr("src",data.coverImg);
            // 显示细节图
            var detailImg = data.detailImg;
            var html = '';
            if (detailImg.length == 0 || detailImg == null) {
                html = '<li style="width:200px; height:150px;"><img style="border:1px solid #ddd;"'
                +'src="images/none_img.png"  width="200px" height="150px" /></li>';
            }else{
                for (var i = 0; i < detailImg.length; i++) {
                    html+= '<li style="width:200px; height:200px;">'
                        +'<img style="border:1px solid #ddd;" src="'+ detailImg[i].url +'"  width="200px" height="150px" /></li>';
                }
            }  
            if (detailImg.length < 3) {
                html+= '<li style="width:200px; height:150px; line-height: 150px;text-align: center;">'
                +'<a href="javascript:;" onclick=\'member_addFileResource(2,' + data.id +', "' + data.title +'")\' title="添加产品介绍图" class="btn btn-warning"><i class="icon-plus"></i>添加产品介绍图</a></li>';
            }
            
            $("#procuctDetalImg").empty();
            $("#procuctDetalImg").append(html);
            


            var bannerImg = data.bannerImg;
            var htmlBanner = '';
            if (bannerImg.length == 0 || bannerImg == null) {
                htmlBanner = '<li style="width:200px; height:150px;"><img style="border:1px solid #ddd;"'
                +'src="images/none_img.png"  width="200px" height="150px" /></li>';
            }else{
                for (var i = 0; i < bannerImg.length; i++) {
                    htmlBanner+= '<li style="width:200px; height:200px;">'
                    +'<img style="border:1px solid #ddd;" src="'+ bannerImg[i].url +'"  width="200px" height="150px" /></li>';
                }
               
            }
            if (bannerImg.length < 3) {
                htmlBanner+= '<li style="width:200px; height:150px; line-height: 150px;text-align: center;">'
                +'<a href="javascript:;" onclick=\'member_addFileResource(3,' + data.id +', "' + data.title +'")\' title="添加产品轮播资源" class="btn btn-warning"><i class="icon-plus"></i>添加产品轮播资源</a></li>';
         
            }
            $("#procuctBannerImg").empty();
            $("#procuctBannerImg").append(htmlBanner);


        }
    })
}

function member_addFileResource(type, id, title){
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
          formData.append('type', type);//3是系统定义好了 表示商品轮播图 2 表示详细图
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
                showDetail(id);
                }
            })
          }                                 
        }
    });
}





jQuery(function($) {

    //获取产品id
    var id =  GetRequest().id;

    showDetail(id);
})
//设置全局变量
var value = {};
value.status = 1 //订单已完成
function tableLoad(params){
    if(params == null || typeof params == "undefined") {
        value.isCurrentDay = null;
        value.isCurrentMonth = null;
    }
    if(params == 1) {
        value.isCurrentDay = 1;
        value.isCurrentMonth = null;
    }
    if(params == 2) {
        value.isCurrentDay = null;
        value.isCurrentMonth = 1;
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
                "url": getAllOrderAmountUrl,
                "type": "GET",
                "data": value
                },  

        "columns": [
                    {"data": "id"},  
                    {"data": "orderNo"},
                    {"data": "title"},
                    {"data": "num"},
                    {"data": "costPrice"},
                    {"data": "sellPrice"},
                    {"data": "finalPrice"},
                    {"data": "finalPrice",
                        "render": function(id, type, data) { // 返回自定义内容
                            return data.finalPrice - data.costPrice;
                        }
                    },
                    {"data": "updateDate"},
                    {"data": "status",
                    "render": function(id, type, data) { // 返回自定义内容
                        if(data.status == 0){
                                return '<span class="label label-danger radius">未完成</span>';
                            }else{
                                return '<span class="label label-success radius">已完成</span>';
                            }
                       }
                    }
                ]
        });
}



function tabSelect(){    
    ajaxHttp({
        url: getAmountCountUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            var data = res.data;
            $(".orderSumCount").html(data.doneOrderCount);
            $("#today").html("截止时间：" + data.todayZero);
            $("#earnToday").html("截止时间：" + data.todayZero);
            $("#totalPriceTodayBefore").html("成交总额：" + typeof data.totalPriceTodayBefore == "undefined"?"0.00元":data.totalPriceTodayBefore.toFixed(2) + "元");
            $("#earnTotalPriceTodayBefore").html("总净收入：" + typeof data.earnTotalPriceTodayBefore == "undefined"?"0.00元":data.earnTotalPriceTodayBefore.toFixed(2) + "元");
            $("#totalPriceToday").html(typeof data.totalPriceToday == "undefined"?"0.00元": data.totalPriceToday.toFixed(2) + "元");
            $("#earnTotalPriceToday").html(typeof data.earnTotalPriceToday == "undefined"?"0.00元": data.earnTotalPriceToday.toFixed(2) +"元");
        }
    })
}

function allOrder(){
    tableLoad();
}
function todayOrder(){
    tableLoad(1);
}
function monthOrder(){
    tableLoad(2);
}




jQuery(function($) {

    tableLoad();
    tabSelect();
   
    //查询
    $(".btn_search").on('click' , function(){
        var dataDay = $("#dataDay").val();
        if (dataDay == "") {
            layer.alert("请输入查询时间！",{
                    title: '提示框',               
                    icon:0,                             
              }); 
              return false; 
        }
        Statistics_btn(dataDay);
    });
    

    $('table th input:checkbox').on('click' , function(){
        var that = this;
        $(this).closest('table').find('tr > td:first-child input:checkbox')
        .each(function(){
            this.checked = that.checked;
            $(this).closest('tr').toggleClass('selected');
        });
            
    });
})

//获取当前日期
function doHandleDate() {
    var myDate = new Date();
    var tYear = myDate.getFullYear();
    var tMonth = myDate.getMonth();
 
    var m = tMonth + 1;
    if (m.toString().length == 1) {
        m = "0" + m;
    }
    return tYear +'-'+ m;
}


//当月统计
function Statistics_btn(dataDay){
    var date = doHandleDate();
    
    if (dataDay != null) {
        date = dataDay;
    }

    ajaxHttp({
        url: getEveryOrderCountAndAmountsUrl,
        type: 'get',
        data: {
            dateDay:date
        },
        success: function (res) {
            var data = res.data;

            var days = [];
            var orderCount = [];
            var totalPrice = [];
            var totalEarnPrice = [];
            var title = data[0].days.split("-")[0] + "年" + data[0].days.split("-")[1] + "月";
            for (var i = 0; i < data.length; i++) {
                days[i] = data[i].days.split("-")[2];//日期取几号
                orderCount[i] = data[i].orderCount;
                totalPrice[i] = data[i].totalPrice;
                totalEarnPrice[i] = data[i].totalEarnPrice;
            }
             
            var index = layer.open({
                type: 1,
                title: title + '订单交易统计',
                maxmin: true, 
                shadeClose:false,
                area : ['1000px' , ''],
                content:$('#Statistics'),
                btn:['确定','取消'],        
            })

           //统计
            require.config({
                paths: {
                    echarts: './assets/dist'
                }
            });
            require(
                [
                    'echarts',
                    'echarts/theme/macarons',
                    'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                    'echarts/chart/bar'
                ],
                function (ec,theme) {
                    var myChart = ec.init(document.getElementById('main'),theme);
                    option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        legend: {
                            data:['成交订单','总交易额','总净收入']
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : days
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                name : '订单',
                                axisLabel : {
                                    formatter: '{value} 单'
                                }
                            },
                            {
                                type : 'value',
                                name : '金额',
                                axisLabel : {
                                    formatter: '{value} 元'
                                }
                            }
                        ],
                        series : [

                            {
                                name:'成交订单',
                                type:'bar',
                                data:orderCount
                            },
                            {
                                name:'总交易额',
                                type:'line',
                                yAxisIndex: 1,
                                data:totalPrice
                            },
                            {
                                name:'总净收入',
                                type:'line',
                                yAxisIndex: 1,
                                data: totalEarnPrice
                            }
                        ]
                    };
                     myChart.setOption(option);
                }
            )


        }
    })


}
       
jQuery(function($) {
    echartShow();
    priceOrderShow();
   
    //查询
    $(".btn_search").on('click' , function(){
        var year = $("#year").val();
        if (year == "-1") {
            layer.alert("请选择年份！",{
                    title: '提示框',               
                    icon:0,                             
              }); 
              return false; 
        }
        echartShow(year);
    });



})
function priceOrderShow(){   
	
    ajaxHttp({
        url: getEarnTotalAndOrderCountUrl,
        type: 'get',
        data: {
        
        },
        success: function (res) {
            var data = res.data;
            $("#doneOrderCount").html(data.doneOrderCount + "单");
            $("#allOrderCount").html(data.allOrderCount + "单");
            $("#totalPrice").html(typeof data.totalPrice == "undefined"?"0.00元":data.totalPrice.toFixed(2) + "元");
            $("#earnTotalPrice").html(typeof data.earnTotalPrice == "undefined"?"0.00元":data.earnTotalPrice.toFixed(2) + "元");
           
        }
    })
}



function echartShow(year){
	var date = new Date().getFullYear();
    
    if (year != null) {
        date = year;
    } 

    ajaxHttp({
        url: getMonthOrderCountAndAmountsUrl,
        type: 'get',
        data: {
            year:date
        },
        success: function (res) {
        	var data = res.data;
        	var months = [];
            var orderCount = [];
            var totalPrice = [];
            var totalEarnPrice = [];
            var title = data[0].months.split("-")[0] + "年";
            for (var i = 0; i < data.length; i++) {
                months[i] = data[i].months.split("-")[1] + "月";//日期取月份
                orderCount[i] = data[i].orderCount;
                totalPrice[i] = data[i].totalPrice;
                totalEarnPrice[i] = data[i].totalEarnPrice;
            }

            var orderCountMax = Math.max(orderCount);
            var orderCountMin = Math.min(orderCount);
            var totalPriceMax = Math.max(totalPrice);
            var totalPriceMin = Math.min(totalPrice);
            var totalEarnPriceMax = Math.max(totalEarnPrice);
            var totalEarnPriceMin = Math.min(totalEarnPrice);

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
						title : {
					        text: title +'每月购买订单交易记录',
					        subtext: title + '订单购买以及成交价和收入记录'
					    },
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
                                data : months
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
                                type:'bar',
                                yAxisIndex: 1,
                                data:totalPrice
                            },
                            {
                                name:'总净收入',
                                type:'bar',
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
       
(function($){
  $.fn.indexGraph = function(){
    var me = this;

    var chart;
    var Data = {
      0: {
        'chartTitle': '不同房价区间内小区数量',
        'lineChartTitle': '',
        'xAxisTitle': '房价',
        'valueSuffix': '元/平米',
        //'data': [2,12,28,32,35,63,57,36,47,25,20],
        'categories': ['小于1w','1w-2w','2w-3w','3w-4w','4w-5w','5w-6w','6w-7w','7w-8w','8w-9w','9w-10w','大于10w'],
      },
      1: {
        'chartTitle': '不同房龄区间内小区数量',
        'lineChartTitle': '不同房龄区间内小区均价',
        'xAxisTitle': '房龄',
        'valueSuffix': '年',
        //'data': [32,48,45,39,27,20,39],
        'categories': ['0-5','5-10','10-15','15-20','20-25','25-30','>30'],
      },
      2: {
        'chartTitle': '不同容积率区间内小区数量',
        'lineChartTitle': '不同容积率区间内小区均价',
        'xAxisTitle': '容积率',
        'valueSuffix': '百分比',
        //'data': [12,23,34,28,50,8,15,17,32,10],
        'categories': ['0.0-1.0','1.0-1.5','1.5-2.0','2.0-2.5','2.5-3.0','3.0-3.5','3.5-4.0','4.0-4.5','4.5-5.0','>5.0'],
    },
      3: {
        'chartTitle': '不同建筑类型的小区数量',
        'lineChartTitle': '不同建筑类型的小区均价',
        'xAxisTitle': '建筑类型',
        'valueSuffix':'',
        //'data': [10,48,35,28,27,20,39],
        'categories': ['板房','小高层','高层','公寓','联排别墅','双排别墅','花园洋房'],
      },
      4: {
        'chartTitle': '与附近最近商圈不同距离区间小区数量',
        'lineChartTitle': '与附近最近商圈不同距离区间小区均价',
        'xAxisTitle': '与其最近商圈距离',
        'valueSuffix': '米',
        //'data': [48,45,39,27,20,39],
        'categories': ['0-500','500-1000','1000-1500','1500-2000','2000-3000','>3000'],
      }
    };

    //$(document).ready(function(){
      chart = Highcharts.chart('graph-container', {

        title: {
          style: {
            fontWeight: 'bold'
          },
          text: '不同房价区间内小区数量'
        },
        yAxis: {
          title: {
            text: '小区数量'
          }
        },
        xAxis: {
          title: {
            text: '房价'
          },
          categories: ['小于1w','1w-2w','2w-3w','3w-4w','4w-5w','5w-6w','6w-7w','7w-8w','8w-9w','9w-10w','大于10w']
        },
        tooltip: {
          formatter: function(){
            return '房价: ' + this.x + '元/平米' + "<br/>" + "小区数 " + this.y;
          }
        },
        //去掉底部legend
        legend: {
          enabled: false
        },
        series: [{
          name: '小区数量',
          type: 'column',
          //color: '#4572A7',
          colorByPoint:true,
          data: [],
        },{
          name: '小区均价',
          type: 'line',
          data: []
        }]
      });
      chart.showLoading();


      //区域选择器发生变化，更新数据
      $("ol[class='drop-list dlist']").children().each(function(){
        $(this).click(function(){
          me.newUpdateData();
        })
      })

      //维度区间发生变化，更新数据
      $("ol[name='price']").children().each(function(){
                  var val = $(this).data('value');
                  $(this).on('click',function(){
                    $(this).css({'color':'#4572A7','fontWeight':'bold'});
                    $(this).siblings().each(function(){
                      $(this).css({'color':'','fontWeight':''});

                    })


                     $(this).parent('.sl-value-list').data('price',val);
                     me.newUpdateData();
                  })
      })
      $("ol[name='age']").children().each(function(){
                  var val = $(this).data('value');
                  $(this).on('click',function(){
                    $(this).css({'color':'#4572A7','fontWeight':'bold'});
                    $(this).siblings().each(function(){
                      $(this).css({'color':'','fontWeight':''});
                    })
                     $(this).parent('.sl-value-list').data('age',val);
                     me.newUpdateData();
                  })
      })
      $("ol[name='plot_rate']").children().each(function(){
                  var val = $(this).data('value');
                  $(this).on('click',function(){
                    $(this).css({'color':'#4572A7','fontWeight':'bold'});
                    $(this).siblings().each(function(){
                      $(this).css({'color':'','fontWeight':''});
                    })
                    $(this).parent('.sl-value-list').data('plotrate',val);
                    me.newUpdateData();
                  })
      })
      $("ol[name='build_type']").children().each(function(){
        var val = $(this).data('value');
        $(this).on('click',function(){
          $(this).css({'color':'#4572A7','fontWeight':'bold'});
          $(this).siblings().each(function(){
            $(this).css({'color':'','fontWeight':''});
          })
          $(this).parent('.sl-value-list').data('buildtype',val);
          me.newUpdateData();
        })
      })


      //维度发生变化，更新数据
      $('.attribute-selector li').click(function(){
        $(this).addClass('chosen');
        $(this).siblings().removeClass('chosen');
        var order = $(this).attr("value");
        $(this).parent(".attribute-selector").data('chosen',order);
        $('.indexGraph .attribute-filter').children().each(function(){
          if($(this).data('value')==order){
            $(this).addClass('hidden');
            $(this).siblings().each(function(){
              $(this).removeClass('hidden');
            })
          }
        })
        //updateData(order);
        me.newUpdateData();
      });


    //2016-12-03 重写updateData
    me.newUpdateData = function() {
      chart.showLoading();
      //获取区域名称 后期可能去掉
      var district = $('.aside #district_name').text();
      console.log("重写updateData，选择区域:"+district);
      console.log(district);
      //获取商圈名称
      var business = $('.aside #business_name').text();
      console.log("商圈名称:"+business);
      //获取选择的维度 0-房价,1-房龄,2-容积率,3-建筑类型
      var attribute = $('.indexGraph .attribute-selector').data('chosen');
      console.log("重写updateData，选择维度:"+attribute);
      //获取维度区间
      var age, price, plotrate,build_type;
      var min_age,min_price,min_plotrate,max_age,max_price,max_plotrate;
      //根据选择的标准重写chart属性
      var chartType = $('.index-y-selector').data('chosen');
      switch (chartType) {
        case 0:
          chart.setTitle({text: Data[attribute].chartTitle});
          //chart.yAxis.setTitle({text:"y1"});
          //重写chart tooltip
          chart.tooltip.options.formatter = function () {
            return xAxisTitle + ": " + this.x + Data[attribute].valueSuffix + '<br/>' + this.series.name + ": " +this.y;
          };
          break;
        case 1:
          console.log("更改title:"+Data[attribute].lineChartTitle);
          chart.setTitle({text: Data[attribute].lineChartTitle});
          chart.yAxis[0].setTitle({text:"小区均价"});
          //重写chart tooltip
          chart.tooltip.options.formatter = function () {
            return xAxisTitle + ": " + this.x + Data[attribute].valueSuffix + '<br/>' + this.series.name + ": " +this.y+"元/平米";
          };
          break;
        default:
          break;
      }
      var xAxisTitle = Data[attribute].xAxisTitle;
      chart.xAxis[0].setTitle({text: xAxisTitle});
      chart.xAxis[0].setCategories(Data[attribute].categories);
      //ajax url
      var url="";
      //判断是按照商圈更新图表还是按照区域更新图表
      //if(business!=="商圈"){
        //console.log("商圈商圈商圈");
        //url = /getBlocksByBusiness/+business;
        //sendAjaxRequest(url);
      //}else{
        console.log("区域区域区域");
        switch (attribute) {
          //选择房价
          case 0:
            age = $("ol[name='age']").data('age');
            plotrate = $("ol[name='plot_rate']").data('plotrate');
            build_type = $("ol[name='build_type']").data('buildtype');
            console.log("建筑类型:"+build_type);
            if (age==="") {
              min_age = 0;
              max_age = 0;
            }else{
              min_age = age.split("&")[0];
              max_age = age.split("&")[1];
            }
            if (plotrate==="") {
              min_plotrate = 0;
              max_plotrate = 0;
            }else{
              min_plotrate = plotrate.split("&")[0];
              max_plotrate = plotrate.split("&")[1];
            }
            console.log("build_type:"+build_type);
            url = "/getBlocksByPrice?district="+district+"&business="+business+"&min_year="+min_age+"&max_year="+max_age+"&min_plotrate="+min_plotrate+"&max_plotrate="+max_plotrate+"&build_type="+build_type;
            sendAjaxRequest(url);
            break;
          //选择房龄
          case 1:
            price = $("ol[name='price']").data('price');
            plotrate = $("ol[name='plot_rate']").data('plotrate');
            build_type = $("ol[name='build_type']").data('buildtype');
            if (price==="") {
              min_price = 0;
              max_price = 0;
            }else{
              min_price = price.split("&")[0];
              max_price = price.split("&")[1];
            }
            if (plotrate==="") {
              min_plotrate = 0;
              max_plotrate = 0;
            }else{
              min_plotrate = plotrate.split("&")[0];
              max_plotrate = plotrate.split("&")[1];
            }
            url = "/getBlocksByTime?district="+district+"&business="+business+"&min_price="+min_price+"&max_price="+max_price+"&min_plotrate="+min_plotrate+"&max_plotrate="+max_plotrate+"&build_type="+build_type;
            sendAjaxRequest(url);
            break;
          //选择容积率
          case 2:
            price = $("ol[name='price']").data('price');
            age = $("ol[name='age']").data('age');
            build_type = $("ol[name='build_type']").data('buildtype');
            if (price==="") {
              min_price = 0;
              max_price = 0;
            } else {
              min_price = price.split("&")[0];
              max_price = price.split("&")[1];
            }
            if (age==="") {
              min_age = 0;
              max_age = 0;
            } else {
              min_age = age.split("&")[0];
              max_age = age.split("&")[1];
            }
            url = "/getBlocksByPlotRate?district="+district+"&business="+business+"&min_price="+min_price+"&max_price="+max_price+"&min_year="+min_age+"&max_year="+max_age+"&build_type="+build_type;
            sendAjaxRequest(url);
            break;
          //选择建筑类型
          case 3:
            price = $("ol[name='price']").data('price');
            age = $("ol[name='age']").data('age');
            plotrate = $("ol[name='plot_rate']").data('plotrate');
            if (price==="") {
              min_price = 0;
              max_price = 0;
            }else{
              min_price = price.split("&")[0];
              max_price = price.split("&")[1];
            }
            if (age==="") {
              min_age = 0;
              max_age = 0;
            }else{
              min_age = age.split("&")[0];
              max_age = age.split("&")[1];
            }
            if (plotrate==="") {
              min_plotrate = 0;
              max_plotrate = 0;
            }else{
              min_plotrate = plotrate.split("&")[0];
              max_plotrate = plotrate.split("&")[1];
            }
            console.log(district);
            url = "/getBlocksByBuildType?district="+district+"&business="+business+"&min_price="+min_price+"&max_price="+max_price+"&min_year="+min_age+"&max_year="+max_age+"&min_plotrate="+min_plotrate+"&max_plotrate="+max_plotrate;
            console.log(url);
            sendAjaxRequest(url);
            break;
          case 4:
            console.log("下个版本开发距商圈距离维度");
            break;
          default:
            console.log("维度选择错误");
            break;
        }
      //}
      //需要判断区域未选择或选择为不限
      //获取选择的指标，小区数量柱状图，平均价格折线图
    }

    /*第一次加载首页
    function initData(attribute){
      var url = '/getBlocksByPriceAll';
      sendAjaxRequest(url);
    }
    */

    //发送ajax请求，简单封装
    function sendAjaxRequest(url){
      $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data){
          chart.hideLoading();
          console.log(url);
          if (url.startsWith("/getBlocksByBusiness")) {
            console.log("商圈url"+url);
            console.log("商圈小区数量"+data.blocklist.length);
          }else{
            if (url.startsWith("/getBlocksBy")) {
              console.log("bug url: "+url);
              console.log("小区数量数组:"+data.count);
              console.log("平均房价数组:"+data.avg_price);
              var total_num = 0;
              for(var i = 0;i<data.count.length;i++){
                  total_num += data.count[i];
              }
              var subtitle = {
                    text:"为您找到符合条件的<span style='color:red'>"+total_num+"</span>个小区",
                    useHTML:true,
                    style:{
                        color:"#000",
                        fontWeight:"bold"
                    }
                };
              chart.setTitle(null,subtitle);     //设置副标题，第一个参数设置为null
              chart.series[0].setData(data.count);
              chart.series[1].setData(data.avg_price);
            }
          }

          /*留作以后优化这个封装函数时使用
          if (url.startsWith("/getBlockListBy")) {

          }
          */
        },
        error:function(msg){
          console.log(msg);
        }
      });
    }


    //指标选择(Y轴)
    $('.index-y-selector li').click(function () {
      $(this).addClass('chosen');
      $(this).siblings().removeClass('chosen');
      var index = $(this).attr('value');
      $(this).parent('.index-y-selector').data('chosen',index);
      console.log("Y轴因子选择:"+index);
      me.newUpdateData();
      console.log("根据选择指标更新数据完毕");
      switch (index) {
        case 0:
          chart.series[index].show();
          chart.series[1].hide();
          break;
        case 1:
          chart.series[index].show();
          chart.series[0].hide();
          break;
        default:
          console.log("其他指标尚在研讨");
          break;
      }
    })
    chart.series[1].hide();
    me.newUpdateData();

    //闭包测试
    me.testclosure = function () {
      console.log("闭包测试");
    }
    return this;
  }
})(jQuery);

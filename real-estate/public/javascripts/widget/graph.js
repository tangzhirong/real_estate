$(function(){
  var chart;
  $(document).ready(function(){
    chart = new Highcharts.Chart({
      chart: {
          renderTo:'container',
          zoomType: 'xy'
      },
      title: {
        style:{
          fontWeight:'bold'
        },
          text: '一年内北京市小区均价走势图'
      },
      xAxis: [{
          categories: ['十月', '十一月', '十二月','一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月']
      }],
      yAxis: [{ // 主Y轴
          gridLineWidth: 0,
          title: {
              text: '均价',
              style: {
                  color: '#4572A7'
              }
          },
          labels: {
              formatter: function() {
                  return this.value+'元/平方';
              },
              style: {
                  color: '#4572A7'
              }
          }

      },
      { // 次Y轴
          labels: {
              formatter: function() {
                  return this.value +'套';
              },
              style: {
                  color: '#89A54E'
              }
          },
          title: {
              text: '成交量',
              style: {
                  color: '#89A54E'
              }
          },
          opposite: true

      }],
      tooltip: {
          shared: true
      },
      legend: {
          layout: 'horizontal',
          align: 'left',
          verticalAlign: 'top',
          x: 150,
          y: 0,
          floating: true,
          backgroundColor: '#FFFFFF'
      },
      series: [{
          name: '成交量',
          color: '#4572A7',
          type: 'column',
          yAxis: 1,
          data: [39,42,67,55,45,56,18,26,58,32,26,38],
          tooltip: {
              valueSuffix: ' 套'
          }
      }, {
          name: '参考均价',
          type: 'spline',
          color: '#AA4643',
          yAxis: 0,
          data: [10522.7, 10790.3, 11324.4, 12130.0, 13139.5, 14964.4, 16039.0, 15709.4, 16807.3, 19607.3, 22579.3, 24681.7],
          marker: {
              enabled: false
          },
          dashStyle: 'shortdot',
          tooltip: {
              valueSuffix: ' 元/平方'
          }

      }, {
          name: '燕郊城区均价',
          color: '#89A54E',
          type: 'spline',
          yAxis:0,
          data: [11698.3,11995.9,12589.6,13489.8,14607.7,14964.3,16039.0,17445.7,18524.6,20748.1,23373.8,25742.9],
          tooltip: {
              valueSuffix: ' 元/平方'
          }
      }]
    });

    //居室选择
    $('.room_selector li').on('click',function(){
      $(this).addClass('on');
      $(this).siblings().removeClass('on');
      //更新相应居室的数据
      updateData($(this).attr("value"));
    })
  })

  function updateData(value){
          //全部，一居，两居，三居的模拟数据
          var Data = {
            0:{
              payNum:[39,42,67,55,45,56,18,26,58,32,26,38],
              avgPrice:[10522.7, 10790.3, 11324.4, 12130.0, 13139.5, 14964.4, 16039.0, 15709.4, 16807.3, 19607.3, 22579.3, 24681.7],
              xiaoqu_avgPrice:[11698.3,11995.9,12589.6,13489.8,14607.7,14964.3,16039.0,17445.7,18524.6,20748.1,23373.8,25742.9]
            },
            1:{
              payNum:[39,42,67,55,45,56,18,26,58,32,26,38].reverse(),
              avgPrice:[10522.7, 10790.3, 11324.4, 12130.0, 13139.5, 14964.4, 16039.0, 15709.4, 16807.3, 19607.3, 22579.3, 24681.7].reverse(),
              xiaoqu_avgPrice:[11698.3,11995.9,12589.6,13489.8,14607.7,14964.3,16039.0,17445.7,18524.6,20748.1,23373.8,25742.9].reverse()
            },
            2:{
              payNum:[56,78,23,69,55,44,88,69,70,68,34,63],
              avgPrice:[10790.3,10522.7, 16807.3,11324.4, 12130.0, 13139.5, 14964.4, 16039.0,22579.3, 15709.4, 19607.3, 24681.7],
              xiaoqu_avgPrice:[11995.9,12589.6,13489.8,11698.3,14607.7,14964.3,17445.7,18524.6,16039.0,20748.1,23373.8,25742.9]
            },
            3:{
              payNum:[56,78,23,69,55,44,88,69,70,68,34,63].reverse(),
              avgPrice:[10790.3,10522.7, 16807.3,11324.4, 12130.0, 13139.5, 14964.4, 16039.0,22579.3, 15709.4, 19607.3, 24681.7].reverse(),
              xiaoqu_avgPrice:[11995.9,12589.6,13489.8,11698.3,14607.7,14964.3,17445.7,18524.6,16039.0,20748.1,23373.8,25742.9].reverse()
            }
          };
          //更新数据
          chart.series[0].setData(Data[value].payNum);
          chart.series[1].setData(Data[value].avgPrice);
          chart.series[2].setData(Data[value].xiaoqu_avgPrice);
  }
});

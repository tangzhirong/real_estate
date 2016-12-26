$(function () {

 var address=[];
if(!window.localStorage.blocklist){
      window.localStorage.blocklist = JSON.stringify([]);
}
$('#clearBlockList').on('click',function(){
    $('#spider-table .ui-table tbody').children().each(function(){
          $(this).remove();
         })
  window.localStorage.blocklist =JSON.stringify([]);
})
 $('#b-hd3-submit').click(function(){
    $('.item-check').each(function(){
        if($(this).attr("checked")){

           address.push($(this).siblings().children(".item-address").text());
       }

   })
    if(address.length==0)
    { 
        alert("您还未选择要筛选的小区");
         address=[1,2];
    }

    if($("#spider-graph").css("display")=="none"&&address!=[1,2]){
        $("#graph-container").hide();
        $(".attribute-selector").hide();
        $(".index-y-selector").hide();
        $(".attribute-filter").hide();
        $(".selector-line").hide();
        $("#spider-graph").show();
        $("#spider-table").show();
        $(".total").text("加入比较栏");
        $("#b-hd3-submit").val("点击重新筛选");

    }
    else{
         
        $("#spider-graph").hide();
         $("#spider-table").hide();
        $(".attribute-selector").show();
        $(".index-y-selector").show();
        $(".attribute-filter").show();
        $("#graph-container").show();
         $(".selector-line").show();
         $(".total").text("小区维度关联分析");
        $("#b-hd3-submit").val("加入比较栏");
        $(".item-check").removeAttr("checked"); 
        address=[];
    }




   console.log(address);

  // chart.series[0].setData([20,time,30,40,100]);
 var chart;
 // chart=new Highcharts.Chart({
var options={
    chart: {
        renderTo:'spider-graph',
        polar: true,
        type: 'line'
    },
    title: {
        text: '小区筛选集多维度对比',
        x: -80
    },
    pane: {
        size: '90%'
    },
    xAxis: {
        categories: ['容积率','房龄', '房价', '绿化率', '距商圈距离'
        ],
        tickmarkPlacement: 'on',
        lineWidth: 0
    },
    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
    },
    tooltip: {
        shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
        y: 70,
        layout: 'vertical'
    },

   //  series: [{
   //      name: '和平大街皓月大路散盘',
   //      data: [69,45,60,90,30],
   //      pointPlacement: 'on'
   //  },
   //  {
   //      name: '益寿里高层',
   //      data: [57,36,98,23,12],
   //      pointPlacement: 'on'
   //  },
   //  {
   //      name: '精益公寓',
   //      data: [66,89,34,60,70],
   //      pointPlacement: 'on'
   //  }
   // ]
   series:[]
}

// });
      options.series=new Array();
      var add = address.join(';');
      console.log(add);
      
      if(add!=''){
          $.ajax({
        type: "POST",
        url: "/getBlockByAddress",
        data:{'address':add},
        traditional:true,
        dataType: "json",
        success: function(data){         
            // console.log('length:'+data.spiderGraph.length);
            //console.log("spider graph:"+data.spiderGraph[0][0].title);
            //console.log("spider graph:"+data.spiderGraph[1][0].title);
            var oldBlocks = JSON.parse(window.localStorage.blocklist);
       for(var j=0;j<data.spiderGraph.length;j++){
            

        //     chart.series[j].update({
        //     name:data.spiderGraph[j][0].title
        // });

            // chart.series[j].setData([parseFloat(data.spiderGraph[j][0].green_rate),(2016-age),parseFloat(data.spiderGraph[j][0].unit_price/1000),56,23]);

          
            var block_info = data.spiderGraph[j][0];
            oldBlocks.push(block_info);

         }

         window.localStorage.blocklist = JSON.stringify(oldBlocks);
         var blocksInfo = JSON.parse(window.localStorage.blocklist);
         $('#spider-table .ui-table tbody').children().each(function(){
          $(this).remove();
         })
       
         for(var j=0;j<blocksInfo.length;j++){
               var date=new Date;
              var current_year=date.getFullYear();

              var build_time = blocksInfo[j].build_time || current_year+'-01-01'; 
              var age=build_time.split("-")[0];
         
              
          var block_item = $("<tr><td>"+blocksInfo[j].title+"</td><td>"+blocksInfo[j].district+"</td><td>"+blocksInfo[j].address+"</td><td>"+blocksInfo[j].unit_price+
              "</td><td>"+blocksInfo[j].total_buildings+"</td><td>"+blocksInfo[j].total_houses+"</td><td>"+blocksInfo[j].build_type+"</td><td>"+blocksInfo[j].build_time+
              "</td><td>"+blocksInfo[j].property_fee+"</td><td>"+blocksInfo[j].parking_num+"</td><td>"+blocksInfo[j].green_rate+"</td></tr>");
            $('#spider-table .ui-table tbody').append(block_item);

             options.series[j]=new Object();
              options.series[j].name=blocksInfo[j].title;
              options.series[j].data=new Array(parseFloat(blocksInfo[j].plot_rate*10),(2016-age),parseFloat(blocksInfo[j].unit_price/1000),0,0);


            
              if(j%5==0) options.series[j].color="#1A2933";
              if(j%5==1)options.series[j].color="#FF0000";
              if(j%5==2)options.series[j].color="#1d953f";
              if(j%5==3)options.series[j].color="#009ad6";
              if(j%5==4) options.series[j].color="#fcaf17";
              chart=new Highcharts.Chart(options);

         }

        },
        error:function(msg){
          console.log(msg);
        }
      });
      }
      
   // }




});

});

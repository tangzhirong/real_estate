(function($){    //形成闭包，在这个内部定义的函数和变量只在这个范围内有效，有参数的匿名函数
	$.fn.areaMap = function(options){  //fn是jquery的命名空间，之后的每一个jquery实例都可以使用areaMap方法
		var me = this;
		//默认参数
		var defaults = {     //对象
			x:116.395645,
			y:39.929986,
			zoom:12,
			price:{
				min:200,
				max:300
			},
			size:{
				min:60,
				max:80
			},
			style:'两居',
			level:'province',   //地图层级
			currentArea:'beijing',  //当前查看单位名称
			heatmap_type:'price'  //热力图种类
		};
		//合并参数
		var opts = $.extend({},defaults,options);  //后两个合并到第一个中去

		//属性初始化
		me.level = opts.level;
		me.currentArea = opts.currentArea;
		me.heatmap_type = opts.heatmap_type;
		me.x = opts.x;
		me.y = opts.y;
		me.zoom = opts.zoom;


		initMap(me.x,me.y,me.zoom);//创建和初始化地图

		 //创建和初始化地图函数：
    		function initMap(x,y,zoom){
        			createMap(x,y,zoom);//创建地图
        			setMapEvent();//设置地图事件
        			addMapControl();//向地图添加控件
    		}

    		//创建地图函数：
    		function createMap(x,y,zoom){
       			var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        			var point = new BMap.Point(x,y);//定义一个中心点坐标
        			map.centerAndZoom(point,zoom);//设定地图的中心点和坐标并将地图显示在地图容器中
        			window.map = map;//将map变量存储在全局，window对象表示浏览器中打开的窗口

   		 }

    		//地图事件设置函数：
    		function setMapEvent(){
		        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
		        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
		        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
		        map.enableKeyboard();//启用键盘上下左右键移动地图
    		}

		//地图控件添加函数：
		function addMapControl(){
		        //向地图中添加缩放控件
			var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
			map.addControl(ctrl_nav);
		        //向地图中添加缩略图控件
			var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
			map.addControl(ctrl_ove);
		        //向地图中添加比例尺控件
			var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
			map.addControl(ctrl_sca);
		 }

		 me.pointToDistrict = function(district,level){
		 	var opt = {
		 		isChosenOne:true,
		 	}
		 	getBoundary(district,level,opt);	 	
		 }

		//地图更新的方法
		me.init = function(){
			var mapOverlays = map.getOverlays();
			var opt = {
				isChosenOne:false,
			};
			for(var i=0;i<mapOverlays.length;i++){
				console.log(mapOverlays[i].constructor.name);
				if(mapOverlays[i].constructor.name ==  'Bc' ){
					map.removeOverlay(mapOverlays[i]);
				}
			}

			//如果地图当前层级为北京市地图
			 if(me.level == 'province'){

			 	var districtArr = [
				    '东城',
				    '西城',
				     '朝阳',
				     '海淀',
				     '丰台',
				    '石景山',
				     '门头沟',
				     '房山',
				    '通州',
				    '顺义',
				    '昌平',
				    '大兴',
				    '怀柔',
				     '平谷',
				    '密云',
				    '亦庄',
				    '门头沟'
    				];
    				//渲染各行政区overlay
				for (var i = 0; i < districtArr.length; i++) {					
			       		getBoundary(districtArr[i],'province',opt);
				}
				
			}else if(me.level == 'district'){    //如果当前地图层级为某行政区
				var point = new BMap.Point(me.x,me.y);//定义一个中心点坐标
				map.centerAndZoom(point,me.zoom);
							 
				//获取该行政区的所有商圈
				 $.ajax({
		                                       type: "GET",
		                                       url: "/getBusinessByDistrict/"+me.currentArea,
		                                       dataType: "json",
		                                       success: function(data){
		                                       	console.log(data.businessList);
		                                        	 for(var i=0;i<data.businessList.length;i++){		                                        	 
		                                        	 	getBoundary(data.businessList[i],'district',opt);
		                                        	 }
		                                       },
		                                       error:function(msg){
		                                         console.log(msg);
		                                       }
                            		});
			}else{
				//获取该商圈的所有小区
				$.ajax({
		                                       type: "GET",
		                                       url: "/getBlocksByBusiness/"+me.currentArea,
		                                       dataType: "json",
		                                       success: function(data){
		                                        console.log(data.blocklist.length);
		                                                $('.blockList .b-hd1_i').text(data.blocklist.length);
		                                                var point = new BMap.Point(me.x,me.y);//定义一个中心点坐标
					         map.centerAndZoom(point,me.zoom);
		                                               for(var i=0;i<data.blocklist.length;i++){		
		                                               	console.log(data.blocklist[i]);	                                               		                                               	
		                                                   getBoundary(data.blocklist[i],'business',opt);       //商圈内部的小区
		                                               }
		                                       },
		                                       error:function(msg){
		                                         console.log(msg);
		                                       }
                            		});
			}


		};

		//Heatmap
		me.heatmap = function(){

			// map.removeOverlay(heatmapOverlay);
			if(!isSupportCanvas()){
			      alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
			      return;
			  }

			  //创建热力图实例
			  heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});


			    //是否显示热力图
			    function openHeatmap(){
			        heatmapOverlay.show();
			    }
			  function closeHeatmap(){
			        heatmapOverlay.hide();
			   }
			   // closeHeatmap();
			  //设置渐变
			  function setGradient(){
				      /*格式如下所示:
				    {
				        0:'rgb(102, 255, 0)',
				      .5:'rgb(255, 170, 0)',
				        1:'rgb(255, 0, 0)'
				    }*/
				      var gradient = {};
				      var colors = document.querySelectorAll("input[type='color']");
				      colors = [].slice.call(colors,0);
				      colors.forEach(function(ele){
				      gradient[ele.getAttribute("data-key")] = ele.value;
				      });
				       heatmapOverlay.setOptions({"gradient":gradient});
			    }

			  //判断浏览区是否支持canvas
			    function isSupportCanvas(){
			        var elem = document.createElement('canvas');
			        return !!(elem.getContext && elem.getContext('2d'));
			    }

			 //points 数据格式 
			var points =[
				    {"lng":116.418261,"lat":39.921984,"count":50},
				    {"lng":116.423332,"lat":39.916532,"count":51}
			];
			//均价热力图
			if(me.heatmap_type == 'price'){
				//获取curentArea所有的小区均价数据
				     // $.ajax({
				     //         type: "GET",
				     //         url: "",   //获取该行政区小区数据api
				     //         data: {currentArea:me.currentArea,heatmap_type:opts.heatmap_type},
				     //         dataType: "json",
				     //         success: function(data){
				     //      		//render data and add heatmap overlay
				     //         },
				     //         error:function(msg){
				     //         	console.log(msg);
				     //         }
        	// 		 	});

				  map.addOverlay(heatmapOverlay);
				  heatmapOverlay.setDataSet({data:points,max:100});
			}else if(me.heatmap_type == 'paynum'){
				map.addOverlay(heatmapOverlay);
				heatmapOverlay.setDataSet({data:points,max:100});
			}else if(me.heatmap_type == 'potential'){
				map.addOverlay(heatmapOverlay);
				heatmapOverlay.setDataSet({data:points,max:100});
			}
			   return heatmapOverlay;
		}



		 //绘制该区的边界Boundary和房价信息Label
		    function getBoundary(district,level,opt){
		    	// console.log(district);
		    	if(level == 'province'){
		    		var bdary = new BMap.Boundary();
		        		bdary.get('北京市'+district+'区', function(rs){       //获取行政区域
			            // map.clearOverlays();        //清除地图覆盖物
				            var count = rs.boundaries.length; //行政区域的点有多少个
				            if (count === 0) {
				                alert(district+'未能获取当前输入行政区域');
				                return ;
				            }
				            var pointArray = [];
			                        //遍历该区所有分区
				            for (var i = 0; i < 1; i++) {
				                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "rgb(75,179,119)"}); //建立多边形覆盖物

				                //获取区域初始颜色
				                var plyFillColor = ply.getFillColor();

				                 // map.addOverlay(ply);  //添加覆盖物
				                pointArray = pointArray.concat(ply.getPath());

				                //计算区域中心点位置
				                var bdary_arr = rs.boundaries[i].split(';');
				                var lng_arr = [];
				                var lat_arr = [];
				                for(var j=0;j<bdary_arr.length;j++){
				                    var lng = parseFloat(bdary_arr[j].split(',')[0]);
				                    var lat = parseFloat(bdary_arr[j].split(',')[1]);
				                    lng_arr.push(lng);
				                    lat_arr.push(lat);
				                }
				                var max_lng =Math.max.apply(null, lng_arr);
				                var min_lng = Math.min.apply(null, lng_arr);
				                var max_lat = Math.max.apply(null, lat_arr);
				                var min_lat = Math.min.apply(null, lat_arr);

				                //中心点经纬度
				                var avg_lng = (max_lng+min_lng)/2;
				                var avg_lat = (max_lat+min_lat)/2;

				                var point = new BMap.Point(avg_lng,avg_lat);
				                
				                if(opt.isChosenOne){
				                	map.centerAndZoom(point,13);//设定地图的中心点和坐标并将地图显示在地图容器中
				                }
				                
				                //设置颜色
				                var circleColor = 'rgb(75,179,119)';
				                var changecColor = 'rgb(227,74,76)';
				                var changepColor = 'rgb(209,232,220)';

				                //计算区域面积，估算圆半径,绘制房价信息圆
				                // var swPoint =  ply.getBounds().getSouthWest();
				                // var nePoint =  ply.getBounds().getNorthEast() ;
				                // var radius = Math.sqrt((nePoint.lat-swPoint.lat)*(nePoint.lng-swPoint.lng));
				                var circle = new BMap.Circle(point,2000,{strokeColor:"rgba(75,179,119)", strokeWeight:2, strokeOpacity:0.5}); //创建圆

				                //干掉可恶的闭包问题
				                circle.ply = ply;
				                circle.setFillColor(circleColor);

				                //添加鼠标事件
				                circle.addEventListener('mouseover',function(){
				                    this.setFillColor(changecColor);
				                    this.ply.setFillColor(changepColor);
				                   map.addOverlay(circle.ply);  //添加覆盖物
				                });
				                circle.addEventListener('mouseout',function(){
				                    this.setFillColor(circleColor);
				                    this.ply.setFillColor(plyFillColor);
				                    map.removeOverlay(circle.ply);
				                });
				                //点击圆后，打开该区级别的地图
				                circle.ply.addEventListener('click',function(){
				                    //清空地图覆盖物
				                    map.clearOverlays();
				                    // map.centerAndZoom(new BMap.Point(avg_lng,avg_lat), 12.5);
				                    // map.enableScrollWheelZoom();
				                    me.level = 'district';
				                    // console.log(district.lng);
				                    me.x = avg_lng;
				                    me.y = avg_lat;
				                    me.zoom = 13;
				                    me.currentArea = district;
				                    console.log(me.currentArea);

				                    me.init();
				                    // me.heatmap();

					        $('.b-container .b-content').children().each(function(){
					          $(this).remove();
					        })
					        $('.aside #district_name').text(district);
					        //新添加
					        $(this).addClass('clicked');
					        $(this).siblings().removeClass('clicked');
					        

					        //更新blocklist区域名和均价
					        $('.i-card-name').text(district);
					        //更新indexGraph标题
        					        $('.indexGraph .total span').text(district);
        					        //取消滚动加载事件
                         				         $('.b-container').unbind('scroll');
        					       
        					        $.ajax({
					                     type: "GET",
					                     url: "/getBlocks/"+district,
					                     dataType: "json",
					                     success: function(data){					                     	
					                              $('.blockList .b-hd1_i').text(data.blocklist.length);
					                             for(var i=0;i<data.blocklist.length;i++){
					                                   var block_item = $('<li class="list-item"><div class="item-picture"><img src="/images/block_default.jpg" ></div><div class="item-main"><p class="item-title">'+data.blocklist[i].title+'</p><input type="checkbox" class="item-check" value=""/><p class="item-des"><span class="item-info item-address">'+data.blocklist[i].address+'</span><span class="item-info">'+data.blocklist[i].build_type+'</span><span class="item-info ">'+data.blocklist[i].build_time+'</span><span class="item-price">'+data.blocklist[i].unit_price+'<span>元/平方米</span></span> </p><p class="item-tag-wrap"><span class="item-tag-school item-extra">学区房</span><span class="item-tag-hospital item-extra">近医院</span></p></div></li>');


					                                    $('.b-content').append(block_item);
					                             }
					                     },
					                     error:function(msg){
					                       console.log(msg);
					                     }
          					        });
				                });
				                // console.log("province:"+map);
				                map.addOverlay(circle);



				                //ajax获取该行政区小区数据
				          //      $.ajax({
					         //     type: "GET",
					         //     url: "",   //获取该行政区小区数据api
					         //     data: {district_name:district,select_opts:opts},
					         //     dataType: "json",
					         //     success: function(data){
					         //  		addlabel(point,district+'<br/>'+data.price+'<br/>'+data.blocknum);
					         //     },
					         //     error:function(msg){
					         //     	console.log(msg);
					         //     }
		        			 // });

		        			 /*****************just for test!!!*****************/
				                addlabel(point,district+'<br/>7.3万<br/>8864套');


		           		 }
		            // map.setViewport(pointArray);    //调整视野
		        });
		    }else if(level == 'district'){
		    		  // console.log('sss'+district.lng);
		    		  var point = new BMap.Point(district.lng,district.lat);

		    		  if(opt.isChosenOne){
			                	map.centerAndZoom(point,14);//设定地图的中心点和坐标并将地图显示在地图容器中
			                }

			                //设置颜色
			                var circleColor = 'rgb(75,179,119)';
			                var changecColor = 'rgb(227,74,76)';
			                var changepColor = 'rgb(209,232,220)';

			                //计算区域面积，估算圆半径,绘制房价信息圆
			                // var swPoint =  ply.getBounds().getSouthWest();
			                // var nePoint =  ply.getBounds().getNorthEast() ;
			                // var radius = Math.sqrt((nePoint.lat-swPoint.lat)*(nePoint.lng-swPoint.lng));
			                var circle = new BMap.Circle(point,1000,{strokeColor:"rgba(75,179,119)", strokeWeight:2, strokeOpacity:0.5}); //创建圆


			                circle.setFillColor(circleColor);

			               
			                // console.log("district:"+map);
			                
			                 map.addOverlay(circle);
			                 


			                //ajax获取该行政区小区数据
			          //      $.ajax({
				         //     type: "GET",
				         //     url: "",   //获取该行政区小区数据api
				         //     data: {district_name:district,select_opts:opts},
				         //     dataType: "json",
				         //     success: function(data){
				         //  		addlabel(point,district+'<br/>'+data.price+'<br/>'+data.blocknum);
				         //     },
				         //     error:function(msg){
				         //     	console.log(msg);
				         //     }
	        			 // });

	        			 /*****************just for test!!!*****************/
			                var label = addlabel(point,'<br/>'+district.name+'<br/>');

			                 //添加鼠标事件
			                circle.addEventListener('mouseover',function(){
			                    this.setFillColor(changecColor);
			                     label.setStyle({
			            		color : "red",			           
		        		        });
			                });
			                circle.addEventListener('mouseout',function(){
			                    this.setFillColor(circleColor);
			                    label.setStyle({
			            		color : "white",			           
		        		        });
			                });
			                //点击圆后，打开该区级别的地图
			                circle.addEventListener('click',function(){
			                    //清空地图覆盖物
			                    map.clearOverlays();
			                    // map.centerAndZoom(new BMap.Point(district.lng,district.lat), 12.5);
			                    // map.enableScrollWheelZoom();
			                    me.level = 'business';

			                    me.x = district.lng;
			                    me.y = district.lat;
			                    me.zoom = 16;
			                    me.currentArea = district.name;
	                  		       me.init();

	                  		       $('.b-container .b-content').children().each(function(){
			                            $(this).remove();
			                     })
		                                 $('.aside #business_name').text(district.name);
		                                 //新添加
		                                 $(this).addClass('clicked');
		                                 $(this).siblings().removeClass('clicked');
		                          
		                                 //更新blocklist区域名和均价
		                                 $('.i-card-name').text(district.name);
		                                 //取消滚动加载事件
                         		                    $('.b-container').unbind('scroll');
                         		                    //更新indexGraph标题
        			                    $('.indexGraph .total span').text(district.name);

		                                 $.ajax({
		                                       type: "GET",
		                                       url: "/getBlocksByBusiness/"+district.name,
		                                       dataType: "json",
		                                       success: function(data){
		                                        console.log(data.blocklist.length);
		                                                $('.blockList .b-hd1_i').text(data.blocklist.length);
		                                               for(var i=0;i<data.blocklist.length;i++){
		                                                     var block_item = $('<li class="list-item"><div class="item-picture"><img src="/images/block_default.jpg" ></div><div class="item-main"><p class="item-title">'+data.blocklist[i].title+'</p><input type="checkbox" class="item-check" value=""/><p class="item-des"><span class="item-info item-address">'+data.blocklist[i].address+'</span><span class="item-info">'+data.blocklist[i].build_type+'</span><span class="item-info ">'+data.blocklist[i].build_time+'</span><span class="item-price">'+data.blocklist[i].unit_price+'<span>元/平方米</span></span> </p><p class="item-tag-wrap"><span class="item-tag-school item-extra">学区房</span><span class="item-tag-hospital item-extra">近医院</span></p></div></li>');


		                                                      $('.b-content').append(block_item);
		                                               }
		                                       },
		                                       error:function(msg){
		                                         console.log(msg);
		                                       }
                            		    });

			                });

		   	}else{
		   		// console.log('sss'+district.lng);
		   		console.log(district.title+":"+district.lng+","+district.lat);
		    		  var point = new BMap.Point(district.lng,district.lat);



			                //计算区域面积，估算圆半径,绘制房价信息圆
			                // var swPoint =  ply.getBounds().getSouthWest();
			                // var nePoint =  ply.getBounds().getNorthEast() ;
			                // var radius = Math.sqrt((nePoint.lat-swPoint.lat)*(nePoint.lng-swPoint.lng));
			                 var opts = {
					 position : point,    // 指定文本标注所在的地理位置
					 offset   : new BMap.Size(-50, -10)    //设置文本偏移量
				     };
					var label = new BMap.Label(district.title, opts);  // 创建文本标注对象
					label.setStyle({
						color : "#FFF",
						backgroundColor:'#53b371',//文本背景色
						borderColor:'#2e8d56',//文本框边框色
						fontSize : "14px",
						height : "20px",
						lineHeight : "20px",
						fontFamily:'微软雅黑'
				  	});
				  	var label_out = new BMap.Label(district.unit_price+'元/平方'+district.total_houses+'套', opts);  // 创建文本标注对象
			                	label_out.setStyle({
						color : "#FFF",
						backgroundColor:'#53b371',//文本背景色
						borderColor:'#2e8d56',//文本框边框色
						fontSize : "14px",
						height : "20px",
						lineHeight : "20px",
						fontFamily:'微软雅黑'
				  	});
			                	label_out.setOffset(new BMap.Size(-5, -10));

			                //添加鼠标事件
			                label.addEventListener('mouseover',function(){
			                    	this.setStyle({
			                    		backgroundColor:'#e4393c'
			                    	})
			                    	map.addOverlay(label_out);

			                });
			                label.addEventListener('mouseout',function(){
			                    	this.setStyle({
			                    		backgroundColor:'#53b371'
			                    	})
			                    	map.removeOverlay(label_out);
			                });
			                //点击圆后，打开该区级别的地图
			                label.addEventListener('click',function(){

			                    //弹出右侧小区详情栏

			                });
			                // console.log("district:"+map);

			                 map.addOverlay(label);



			                //ajax获取该行政区小区数据
			          //      $.ajax({
				         //     type: "GET",
				         //     url: "",   //获取该行政区小区数据api
				         //     data: {district_name:district,select_opts:opts},
				         //     dataType: "json",
				         //     success: function(data){
				         //  		addlabel(point,district+'<br/>'+data.price+'<br/>'+data.blocknum);
				         //     },
				         //     error:function(msg){
				         //     	console.log(msg);
				         //     }
	        			 // });	        			

		   	}
		}

		//添加Label
		    function addlabel(point,text) {
		        var opts = {
		            position:point,
		            offset:new BMap.Size(-22,-30)
		        }
		            var label = new BMap.Label(text,opts);
		            label.setStyle({
			            color : "white",
			            fontSize : "12px",
			            height : "20px",
			            border:0,
			            lineHeight : "20px",
			            fontFamily : "微软雅黑",
			            textAlign:"center",
			            background:"rgba(75,179,119,0)"
		        	});
		             map.addOverlay(label);
		             return label;
		    }

		    function addBlockLabel(blockInfo){
		    	var point = new BMap.Point(blockInfo.lng,blockInfo.lat);   		    	
		             var opts = {
				 position : point,    // 指定文本标注所在的地理位置
				 offset   : new BMap.Size(-50, -10)    //设置文本偏移量
			};
			var label = new BMap.Label(blockInfo.title, opts);  // 创建文本标注对象
			label.setStyle({
				color : "#FFF",
				backgroundColor:'#2973b3',//文本背景色
				borderColor:'#2973b3',//文本框边框色
				fontSize : "14px",
				height : "20px",
				lineHeight : "20px",
				fontFamily:'微软雅黑'
		  	});
		  	var label_out = new BMap.Label(blockInfo.unit_price+'元/平方'+blockInfo.house_num+'套', opts);  // 创建文本标注对象
	                	label_out.setStyle({
				// color : "",
				backgroundColor:'white',//文本背景色
				borderColor:'white',//文本框边框色
				fontSize : "14px",
				height : "20px",
				lineHeight : "20px",
				fontFamily:'微软雅黑'
		  	});
	                	label_out.setOffset(new BMap.Size(0, 0));
	                	 //添加鼠标事件
		                label.addEventListener('mouseover',function(){
		                    	this.setStyle({
		                    		backgroundColor:'red',
		                    		borderColor:"red",
		                    	})
		                    	map.addOverlay(label_out);

		                });
		                label.addEventListener('mouseout',function(){
		                    	this.setStyle({
		                    		backgroundColor:'#2973b3',
		                    		borderColor:'#2973b3',
		                    	})
		                    	map.removeOverlay(label_out);
		                });
		                //点击圆后，打开该区级别的地图
		                label.addEventListener('click',function(){

		                    //弹出右侧小区详情栏

		                });
	                	map.addOverlay(label);
		    }

		//更新小区标注		
		me.updateMarker = function(pointArray){
					for (var i = 0; i < pointArray.length; i++) {
						addBlockLabel(pointArray[i]);
						if(i == pointArray.length-1){
							var point = new BMap.Point(pointArray[i].lng,pointArray[i].lat);
							// me.clear();
							map.centerAndZoom(point,16);//设定地图的中心点和坐标并将地图显示在地图容器中
						}
					}
		},
		//清除地图覆盖物
		me.clear = function(){
			map.clearOverlays();
		}

   	return this;
   }
})(jQuery);

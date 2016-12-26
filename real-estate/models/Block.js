// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/db');
var $sql = require('./BlockSql');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

module.exports = {

	queryByBuildAge:function(req,res,next){
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		var business =  decodeURI(req.params.business);
		if(business=='商圈'){
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryByBuildAge, district, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}else{
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByBusiness_BuildAge, business, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}
		
	},

	queryByBuildAgeDesc:function(req,res,next){
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		var business =  decodeURI(req.params.business);	
		if(business=='商圈'){
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryByBuildAgeDesc, district, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}else{
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByBusiness_BuildAgeDesc, business, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}	
		
	},

	queryByBuildPrice:function(req,res,next){
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		var business =  decodeURI(req.params.business);
		//console.log(district);
		if(business=='商圈'){
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryByBuildPrice, district, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}else{
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByBusiness_BuildPrice, business, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}
		
	},

	queryByBuildPriceDesc:function(req,res,next){
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		var business =  decodeURI(req.params.business);
		//console.log(district);
		if(business=='商圈'){
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryByBuildPriceDesc, district, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}else{
			pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByBusiness_BuildPriceDesc, business, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

				});
			});
		}
		
	},

	queryAllBlocks: function (req, res, next) {
		var last_index = parseInt(req.query.last_index);
		console.log(last_index);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAllBlocks, last_index,function(err, result) {
				console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

			});
		});
	},
	queryByDistrict: function (req, res, next) {
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryByDistrict, district, function(err, result) {
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

			});
		});
	},
	queryByBuild_time:function(req,res,next) {
		var district=decodeURI(req.params.district);
		pool.getConnection(function(err,counnection) {
			connection.query($sql.queryByBuild_time,district,function(err,result){
                res.send({blocklist:result});
                counnection.release();
			});
		});
	},
	//这嵌套语句不知道怎么优化，感觉自己笨笨哒-_-
	queryByPlotRate: function (req, res, next) {
		var district = decodeURI(req.query.district);
		var business = decodeURI(req.query.business);
		var min_year,max_year,min_price,max_price;
		if (req.query.min_year==="0"&&req.query.max_year==="0") {
			min_year = 0;
			max_year = 2050;
		}else{
			min_year = 2016-req.query.max_year;
			max_year = 2016-req.query.min_year;
		}
		if (req.query.min_price==="0"&&req.query.max_price==="0") {
			min_price=0;
			max_price=10000000;
		} else {
			min_price = req.query.min_price;
			max_price = req.query.max_price;
		}
		if (req.query.build_type==="") {
			build_type = "";
		}else{
			build_type = decodeURI(req.query.build_type);
		}
		pool.getConnection(function(err, connection) {
			var numArr = [];
			var avg_priceArr = [];
			var sql = [];
			var condition = [];
			if (req.query.district==="不限"||req.query.district==="区域") {
				sql = [$sql.queryByPlotRateAll1,$sql.queryByPlotRateAll2,$sql.queryByPlotRateAll3,$sql.queryByPlotRateAll4,$sql.queryByPlotRateAll5,$sql.queryByPlotRateAll6,$sql.queryByPlotRateAll7,$sql.queryByPlotRateAll8,$sql.queryByPlotRateAll9,$sql.queryByPlotRateAll10];
				condition = [min_year,max_year,min_price,max_price,build_type];
			}else {
				if (req.query.business !== "商圈") {
					//选择了商圈
					sql = [$sql.queryByPlotRate1WithBusiness,$sql.queryByPlotRate2WithBusiness,$sql.queryByPlotRate3WithBusiness,$sql.queryByPlotRate4WithBusiness,$sql.queryByPlotRate5WithBusiness,$sql.queryByPlotRate6WithBusiness,$sql.queryByPlotRate7WithBusiness,$sql.queryByPlotRate8WithBusiness,$sql.queryByPlotRate9WithBusiness,$sql.queryByPlotRate10WithBusiness];
					condition = [district,business,min_year,max_year,min_price,max_price,build_type];
				}else {
					sql = [$sql.queryByPlotRate1,$sql.queryByPlotRate2,$sql.queryByPlotRate3,$sql.queryByPlotRate4,$sql.queryByPlotRate5,$sql.queryByPlotRate6,$sql.queryByPlotRate7,$sql.queryByPlotRate8,$sql.queryByPlotRate9,$sql.queryByPlotRate10];
					condition = [district,min_year,max_year,min_price,max_price,build_type];
				}
			}
			console.log(condition);
			connection.query(sql[0],condition, function(err, result) {
				var num1 = result[0].num;
				var avg_price1 = Math.ceil(result[0].avg_price);
				numArr.push(num1);
				avg_priceArr.push(avg_price1);
				connection.query(sql[1],condition, function(err, result) {
					var num2 = result[0].num;
					var avg_price2 = Math.ceil(result[0].avg_price);
					numArr.push(num2);
					avg_priceArr.push(avg_price2);
					connection.query(sql[2],condition,function(err, result) {
						var num3 = result[0].num;
						var avg_price3 = Math.ceil(result[0].avg_price);
						numArr.push(num3);
						avg_priceArr.push(avg_price3);
						connection.query(sql[3],condition,function(err, result) {
							var num4 = result[0].num;
							var avg_price4 = Math.ceil(result[0].avg_price);
							numArr.push(num4);
							avg_priceArr.push(avg_price4);
							connection.query(sql[4],condition,function(err, result) {
								var num5 = result[0].num;
								var avg_price5 = Math.ceil(result[0].avg_price);
								numArr.push(num5);
								avg_priceArr.push(avg_price5);
								connection.query(sql[5],condition, function(err, result) {
									var num6 = result[0].num;
									var avg_price6 = Math.ceil(result[0].avg_price);
									numArr.push(num6);
									avg_priceArr.push(avg_price6);
									connection.query(sql[6],condition, function(err, result) {
										var num7 = result[0].num;
										var avg_price7 = Math.ceil(result[0].avg_price);
										numArr.push(num7);
										avg_priceArr.push(avg_price7);
										connection.query(sql[7],condition,function(err, result) {
											var num8 = result[0].num;
											var avg_price8 = Math.ceil(result[0].avg_price);
											numArr.push(num8);
											avg_priceArr.push(avg_price8);
											connection.query(sql[8],condition,function(err, result) {
												var num9 = result[0].num;
												var avg_price9 = Math.ceil(result[0].avg_price);
												numArr.push(num9);
												avg_priceArr.push(avg_price9);
												connection.query(sql[9],condition,function(err, result) {
													var num10 = result[0].num;
													var avg_price10 = Math.ceil(result[0].avg_price);
													numArr.push(num10);
													avg_priceArr.push(avg_price10);
													res.send({count:numArr,avg_price:avg_priceArr});
													connection.release();
												});
											});
										});
									});
								});
							});
						});
					});
				});

			});
		});
	},
	queryByPrice:function(req,res,next){
		var district = decodeURI(req.query.district);
		var business = decodeURI(req.query.business);
		console.log(district);
		var min_year,max_year,min_plotrate,max_plotrate,build_type;
		if (req.query.min_year==="0"&&req.query.max_year==="0") {
			min_year = 0;
			max_year = 2500;
		}else {
			min_year = 2016-req.query.max_year;
			max_year = 2016-req.query.min_year;
		}
		if (req.query.min_plotrate==="0"&&req.query.max_plotrate==="0") {
			min_plotrate = 0;
			max_plotrate = 20;
		}else {
			var min_plotrate = req.query.min_plotrate;
			var max_plotrate = req.query.max_plotrate;
		}
		if (req.query.build_type==="") {
			build_type = "";
		}else{
			build_type = decodeURI(req.query.build_type);
		}
		console.log(district,min_year,max_year);
		pool.getConnection(function(err, connection) {
			var num = [0,0,0,0,0,0,0,0,0,0,0];
			var priceArr = [0,0,0,0,0,0,0,0,0,0,0];
			var avg_priceArr = [0,0,0,0,0,0,0,0,0,0,0];
			var sql;
			var condition = [];
			if (req.query.district==="不限"||req.query.district==="区域") {
				//不选择城市无法选择商圈
				sql = $sql.queryByPriceAll;
				console.log("总体统计");
				condition = [min_year,max_year,min_plotrate,max_plotrate,build_type];
			}else{
				console.log("房价商圈名称:"+req.query.business);
				if (req.query.business!=="商圈") {
					sql = $sql.queryByPriceWithBusiness;
					condition = [district,business,min_year,max_year,min_plotrate,max_plotrate,build_type];
				}else{
					sql = $sql.queryByPrice;
					condition = [district,min_year,max_year,min_plotrate,max_plotrate,build_type];
				}
			}
			console.log("Block.js最终的sql:"+sql);
			console.log(condition);
			connection.query(sql,condition,function(err, result) {
				for(var i in result){
					if(result[i].unit_price<10000){
						num[0]++;
						priceArr[0] = priceArr[0]+result[i].unit_price;
					}else if(result[i].unit_price>=10000&&result[i].unit_price<20000){
						num[1]++;
						priceArr[1] = priceArr[1]+result[i].unit_price;
					}else if(result[i].unit_price>=20000&&result[i].unit_price<30000){
						num[2]++;
						priceArr[2] = priceArr[2]+result[i].unit_price;
					}else if(result[i].unit_price>=30000&&result[i].unit_price<40000){
						num[3]++;
						priceArr[3] = priceArr[3]+result[i].unit_price;
					}else if(result[i].unit_price>=40000&&result[i].unit_price<50000){
						num[4]++;
						priceArr[4] = priceArr[4]+result[i].unit_price;
					}else if(result[i].unit_price>=50000&&result[i].unit_price<60000){
						num[5]++;
						priceArr[5] = priceArr[5]+result[i].unit_price;
					}else if(result[i].unit_price>=60000&&result[i].unit_price<70000){
						num[6]++;
						priceArr[6] = priceArr[6]+result[i].unit_price;
					}else if(result[i].unit_price>=70000&&result[i].unit_price<80000){
						num[7]++;
						priceArr[7] = priceArr[7]+result[i].unit_price;
					}else if(result[i].unit_price>=80000&&result[i].unit_price<90000){
						num[8]++;
						priceArr[8] = priceArr[8]+result[i].unit_price;
					}else if(result[i].unit_price>=90000&&result[i].unit_price<100000){
						num[9]++;
						priceArr[9] = priceArr[9]+result[i].unit_price;
					}else if(result[i].unit_price>=100000){
						num[10]++;
						priceArr[10] = priceArr[10]+result[i].unit_price;
					}
				}
				console.log("priceArr:"+priceArr);
				for (var i = 0; i < num.length; i++) {
					avg_priceArr[i] = Math.ceil(priceArr[i]/num[i]);
				}
				console.log("avg_priceArr:"+avg_priceArr);
        console.log("Block.js返回数组长度:"+result.length);
				res.send({count:num,avg_price:avg_priceArr});
				connection.release();

			});
		});
	},
	queryByTime:function(req,res,next){
		var district = decodeURI(req.query.district);
		var business = decodeURI(req.query.business);
		console.log("房龄筛选输入行政区:"+district);
		var min_price,max_price,min_plotrate,max_plotrate,build_type;
		if (req.query.min_price==="0"&&req.query.max_price==="0") {
			min_price = 0;
			max_price = 10000000;
		}else{
			min_price = req.query.min_price||0;
			max_price = req.query.max_price || 10000000;
		}
		if (req.query.min_plotrate==="0"&&req.query.max_plotrate==="0") {
			min_plotrate = 0;
			max_plotrate = 20;
		} else {
			min_plotrate = req.query.min_plotrate;
			max_plotrate = req.query.max_plotrate;
		}
		if (req.query.build_type==="") {
			build_type = "";
		}else{
			build_type = decodeURI(req.query.build_type);
		}
		var sql = [];
		var condition = [];
		if (req.query.district==="不限"||req.query.district==="区域") {
			//未选择行政区 因此没有商圈
			sql = [$sql.queryByTimeAll1,$sql.queryByTimeAll2,$sql.queryByTimeAll3,$sql.queryByTimeAll4,$sql.queryByTimeAll5,$sql.queryByTimeAll6,$sql.queryByTimeAll7];
			condition = [min_price,max_price,min_plotrate,max_plotrate,build_type];
		}else {
			console.log("房龄商圈名称:"+req.query.business);
			if (req.query.business!=="商圈") {
				//选择了商圈
				sql=[$sql.queryByTime1WithBusiness,$sql.queryByTime2WithBusiness,$sql.queryByTime3WithBusiness,$sql.queryByTime4WithBusiness,$sql.queryByTime5WithBusiness,$sql.queryByTime6WithBusiness,$sql.queryByTime7WithBusiness];
				condition = [district,business,min_price,max_price,min_plotrate,max_plotrate,build_type];
			}else{
				//未选择商圈
				sql = [$sql.queryByTime1,$sql.queryByTime2,$sql.queryByTime3,$sql.queryByTime4,$sql.queryByTime5,$sql.queryByTime6,$sql.queryByTime7];
				condition = [district,min_price,max_price,min_plotrate,max_plotrate,build_type];
			}
		}
		console.log("最终sql:"+sql[1]);
		console.log(condition);
		pool.getConnection(function(err, connection) {
			var numArr = [];
			var avg_priceArr = [];
			connection.query(sql[0],condition,function(err, result) {
				var num1 = result[0].num;
				var avg_price1 = Math.ceil(result[0].avg_price);
				numArr.push(num1);
				avg_priceArr.push(avg_price1);
				connection.query(sql[1],condition,function(err, result) {
					var num2 = result[0].num;
					var avg_price2 = Math.ceil(result[0].avg_price);
					numArr.push(num2);
					avg_priceArr.push(avg_price2);
					connection.query(sql[2],condition, function(err, result) {
						var num3 = result[0].num;
						var avg_price3 = Math.ceil(result[0].avg_price);
						numArr.push(num3);
						avg_priceArr.push(avg_price3);
						connection.query(sql[3],condition,function(err, result) {
							var num4 = result[0].num;
							var avg_price4 = Math.ceil(result[0].avg_price);
							numArr.push(num4);
							avg_priceArr.push(avg_price4);
							connection.query(sql[4],condition,function(err, result) {
								var num5 = result[0].num;
								var avg_price5 = Math.ceil(result[0].avg_price);
								numArr.push(num5);
								avg_priceArr.push(avg_price5);
								connection.query(sql[5],condition, function(err, result) {
									var num6 = result[0].num;
									var avg_price6 = Math.ceil(result[0].avg_price);
									numArr.push(num6);
									avg_priceArr.push(avg_price6);
									connection.query(sql[6],condition,function(err, result) {
										var num7 = result[0].num;
										var avg_price7 = Math.ceil(result[0].avg_price);
										numArr.push(num7);
										avg_priceArr.push(avg_price7);
										res.send({count:numArr,avg_price:avg_priceArr});
										connection.release();
									});
								});
							});
						});
					});
				});

			});
		});
	},
	queryByBuildType:function(req,res,next){
		var district = decodeURI(req.query.district);
		var business = decodeURI(req.query.business);
		console.log("建筑类型输入行政区:"+district);
		var min_price,max_price,min_year,max_year,min_plotrate,max_plotrate;
		if (req.query.min_price==="0"&&req.query.max_year==="0") {
			min_price = 0;
			max_price = 10000000;
		}else {
			min_price = req.query.min_price;
			max_price = req.query.max_price;
		}
		if (req.query.min_year==="0"&&req.query.max_year==="0") {
			min_year = 0;
			max_year = 2500;
		}else {
			min_year = 2016-req.query.max_year;
			max_year = 2016-req.query.min_year;
		}
		if (req.query.min_plotrate==="0"&&req.query.max_year==="0") {
			min_plotrate = 0;
			max_plotrate = 20;
		}else {
			min_plotrate = req.query.min_plotrate;
			max_plotrate = req.query.max_plotrate;
		}
		var sql = [];
		var condition = [];
		if (req.query.district==="不限"||req.query.district==="区域") {
			sql = [$sql.queryByBuildTypeAll1,$sql.queryByBuildTypeAll2,$sql.queryByBuildTypeAll3,$sql.queryByBuildTypeAll4,$sql.queryByBuildTypeAll5,$sql.queryByBuildTypeAll6,$sql.queryByBuildTypeAll7];
			condition = [min_year,max_year,min_price,max_price,min_plotrate,max_plotrate];
		}else {
			if (req.query.business!=="商圈") {
				//选择了商圈
				console.log("建筑类型商圈名称:"+req.query.business);
				sql = [$sql.queryByBuildType1WithBusiness,$sql.queryByBuildType2WithBusiness,$sql.queryByBuildType3WithBusiness,$sql.queryByBuildType4WithBusiness,$sql.queryByBuildType5WithBusiness,$sql.queryByBuildType6WithBusiness,$sql.queryByBuildType7WithBusiness];
				condition = [district,business,min_year,max_year,min_price,max_price,min_plotrate,max_plotrate];
			}else{
				//未选择商圈
				sql = [$sql.queryByBuildType1,$sql.queryByBuildType2,$sql.queryByBuildType3,$sql.queryByBuildType4,$sql.queryByBuildType5,$sql.queryByBuildType6,$sql.queryByBuildType7];
				condition = [district,min_year,max_year,min_price,max_price,min_plotrate,max_plotrate];
			}
		}
		pool.getConnection(function(err,connection){
			var numArr = [];
			var avg_priceArr = [];
			console.log("建筑类型最终sql0:"+sql[0]);
			console.log("建筑类型最终sql2:"+sql[2]);
			console.log("建筑类型最终参数:"+condition);
			connection.query(sql[0],condition,function(err, result) {
				var num1 = result[0].num;
				var avg_price1 = Math.ceil(result[0].avg_price);
				numArr.push(num1);
				avg_priceArr.push(avg_price1);
				connection.query(sql[1],condition,function(err, result) {
					var num2 = result[0].num;
					var avg_price2 = Math.ceil(result[0].avg_price);
					numArr.push(num2);
					avg_priceArr.push(avg_price2);
					connection.query(sql[2],condition, function(err, result) {
						var num3 = result[0].num;
						var avg_price3 = Math.ceil(result[0].avg_price);
						numArr.push(num3);
						avg_priceArr.push(avg_price3);
						connection.query(sql[3],condition,function(err, result) {
							var num4 = result[0].num;
							var avg_price4 = Math.ceil(result[0].avg_price);
							numArr.push(num4);
							avg_priceArr.push(avg_price4);
							connection.query(sql[4],condition,function(err, result) {
								var num5 = result[0].num;
								var avg_price5 = Math.ceil(result[0].avg_price);
								numArr.push(num5);
								avg_priceArr.push(avg_price5);
								connection.query(sql[5],condition, function(err, result) {
									var num6 = result[0].num;
									var avg_price6 = Math.ceil(result[0].avg_price);
									numArr.push(num6);
									avg_priceArr.push(avg_price6);
									connection.query(sql[6],condition,function(err, result) {
										var num7 = result[0].num;
										var avg_price7 = Math.ceil(result[0].avg_price);
										numArr.push(num7);
										avg_priceArr.push(avg_price7);
										res.send({count:numArr,avg_price:avg_priceArr});
										connection.release();
									});
								});
							});
						});
					});
				});
			});
		});
	},
	queryBlocksByTime:function(req,res,next){
		var district = decodeURI(req.query.district);
		var min_price = req.query.min_price||0;
		var max_price = req.query.max_price || 10000000;
		var min_plotrate = req.query.min_plotrate || 0;
		var max_plotrate = req.query.max_plotrate || 20;
		console.log(district,min_price,max_price);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByTime, [district,min_price,max_price,min_plotrate,max_plotrate],function(err, result) {
				res.send({blocklist:result});
				connection.release();
			});
		});
	},
	queryBlocksByPlotRate:function(req,res,next){
		var district = decodeURI(req.query.district);
		var min_year = 2016-req.query.max_year ||0;
		var max_year = 2016-req.query.min_year ||2500;
		var min_price = req.query.min_price ||0;
		var max_price = req.query.max_price ||1000000;
		console.log(district,min_price,max_price);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByPlotRate, [district,min_year,max_year,min_price,max_price],function(err, result) {
				res.send({blocklist:result});
				connection.release();
			});
		});
	},
	queryBlocksByPrice:function(req,res,next){
		var district = decodeURI(req.query.district);
		var min_year = 2016-req.query.max_year||0;
		var max_year = 2016-req.query.min_year||2500;
		var min_plotrate = req.query.min_plotrate ||0;
		var max_plotrate = req.query.max_plotrate ||20;
		console.log(district,min_year,max_year);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByPrice,[district,min_year,max_year,min_plotrate,max_plotrate],function(err, result) {
				res.send({blocklist:result});
				connection.release();

			});

		});
	},
	//不同维度总计
	queryByPriceAll:function(req,res,next) {
		pool.getConnection(function(err, connection) {
			var num =[0,0,0,0,0,0,0,0,0,0,0];
			connection.query($sql.queryByPriceAll,function(err, result) {
				for(var i in result){
					if(result[i].unit_price<10000){
						num[0]++;
					}else if(result[i].unit_price>=10000&&result[i].unit_price<20000){
						num[1]++;
					}else if(result[i].unit_price>=20000&&result[i].unit_price<30000){
						num[2]++;
					}else if(result[i].unit_price>=30000&&result[i].unit_price<40000){
						num[3]++;
					}else if(result[i].unit_price>=40000&&result[i].unit_price<50000){
						num[4]++;
					}else if(result[i].unit_price>=50000&&result[i].unit_price<60000){
						num[5]++;
					}else if(result[i].unit_price>=60000&&result[i].unit_price<70000){
						num[6]++;
					}else if(result[i].unit_price>=70000&&result[i].unit_price<80000){
						num[7]++;
					}else if(result[i].unit_price>=80000&&result[i].unit_price<90000){
						num[8]++;
					}else if(result[i].unit_price>=90000&&result[i].unit_price<100000){
						num[9]++;
					}else if(result[i].unit_price>=100000){
						num[10]++;
					}
				}
        console.log("queryByPriceAll:"+num);
				res.send({count:num});
				connection.release();
			});
		});
	},
	queryByAddress:function(req,res,next) {

		var address=decodeURI(req.body.address);

		  console.log("333333333333333333333333"+address);
		pool.getConnection(function(err,connection) {
			var sql=$sql.queryByAddress;
			var blocklist = [];
			console.log("按地址查找的sql:"+sql);
			var add = address.split(';');
			for(var i in add){
					(function(i){
						connection.query($sql.queryByAddress, add[i], function(err,result){
							blocklist.push(result);
			       			if(i == add.length-1){
			       				//console.log("查到的小区:"+blocklist[0][0]);
			       				res.send({spiderGraph:blocklist});
			       				connection.release();

			       			}
						});
					})(i);

			}


		});
	},
	queryBusinessByDistrict:function(req,res,next) {

		var district='%'+decodeURI(req.params.district)+'%';
		console.log('district:'+district);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryBusinessByDistrict,district,function(err, result) {
				res.send({businessList:result});
				connection.release();

			});

		});
	},
	queryBlocksByBusiness:function(req,res,next) {

		var business=decodeURI(req.params.business);

		pool.getConnection(function(err, connection) {
			connection.query($sql.queryBlocksByBusiness,business,function(err, result) {				
				res.send({blocklist:result});
				connection.release();

			});

		});
	},
	queryBusinessByName:function(req,res,next) {

		var business=decodeURI(req.params.business);

		pool.getConnection(function(err, connection) {
			connection.query($sql.queryBusinessByName,business,function(err, result) {
				console.log('ssssssssss:'+result);
				res.send({business:result});
				connection.release();

			});

		});
	},

	// test:function(req,res,next){
	// 		var arr = ['聚鑫园','新洲城市花园御景苑'];
	// 		var blocklist = [];
	// 		pool.getConnection(function(err, connection) {
	// 			for(var i in arr){
	// 				(function(i){
	// 					connection.query($sql.queryByTitle,arr[i],function(err, result) {
	// 						blocklist.push(result);

	// 						if(i == arr.length-1){
	// 							console.log(blocklist);
	// 							res.send({blocklist:blocklist});
	// 							connection.release();
	// 						}
	// 					});
	// 				})(i);
	// 			}
	// 		});

	// },

};

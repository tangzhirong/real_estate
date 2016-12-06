// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/db');
var $sql = require('./BlockSql');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

module.exports = {

	queryByBuildAge:function(req,res,next){
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		console.log(district);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryByBuildAge, district, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

			});
		});
	},

	queryByBuildPrice:function(req,res,next){
		var district =  decodeURI(req.params.district); // 为了拼凑正确的sql语句，这里要转下整数
		//console.log(district);
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryByBuildPrice, district, function(err, result) {
				//console.log(result);
				res.send({blocklist:result});
				// jsonWrite(res, result);
				connection.release();

			});
		});
	},

	queryAllBlocks: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAllBlocks,  function(err, result) {
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
		var min_year = 2016-req.query.max_year ||0;
		var max_year = 2016-req.query.min_year ||2500;
		var min_price = req.query.min_price ||0;
		var max_price = req.query.max_price ||1000000;
		console.log(district,min_year,max_year);
		pool.getConnection(function(err, connection) {
			var numArr = [];
			var avg_priceArr = [];
			var sql = [];
			var condition = [];
			if (req.query.district==="不限"||req.query.district==="区域") {
				sql = [$sql.queryByPlotRateAll1,$sql.queryByPlotRateAll2,$sql.queryByPlotRateAll3,$sql.queryByPlotRateAll4,$sql.queryByPlotRateAll5,$sql.queryByPlotRateAll6,$sql.queryByPlotRateAll7,$sql.queryByPlotRateAll8,$sql.queryByPlotRateAll9,$sql.queryByPlotRateAll10];
				condition = [min_year,max_year,min_price,max_price];
			}else {
				sql = [$sql.queryByPlotRate1,$sql.queryByPlotRate2,$sql.queryByPlotRate3,$sql.queryByPlotRate4,$sql.queryByPlotRate5,$sql.queryByPlotRate6,$sql.queryByPlotRate7,$sql.queryByPlotRate8,$sql.queryByPlotRate9,$sql.queryByPlotRate10];
				condition = [district,min_year,max_year,min_price,max_price];
			}
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
		var min_year = 2016-req.query.max_year||0;
		var max_year = 2016-req.query.min_year||2500;
		var min_plotrate = req.query.min_plotrate ||0;
		var max_plotrate = req.query.max_plotrate ||20;
		console.log(district,min_year,max_year);
		pool.getConnection(function(err, connection) {
			var num = [0,0,0,0,0,0,0,0,0,0,0];
			var priceArr = [0,0,0,0,0,0,0,0,0,0,0];
			var avg_priceArr = [0,0,0,0,0,0,0,0,0,0,0];
			var sql;
			var condition = [];
			if (req.query.district==="不限"||req.query.district==="区域") {
				sql = $sql.queryByPriceAll;
				console.log("总体统计");
				condition = [min_year,max_year,min_plotrate,max_plotrate];
			}else{
				sql = $sql.queryByPrice;
				condition = [district,min_year,max_year,min_plotrate,max_plotrate];
			}
			console.log("Block.js最终的sql:"+sql);
			console.log(district,min_year,max_year,min_plotrate,max_plotrate);
			connection.query(sql,condition,function(err, result) {
				for(var i in result){
					if(result[i].num<10000){
						num[0]++;
						priceArr[0] = priceArr[0]+result[i].unit_price;
					}else if(result[i].num>=10000&&result[i].num<20000){
						num[1]++;
						priceArr[1] = priceArr[1]+result[i].unit_price;
					}else if(result[i].num>=20000&&result[i].num<30000){
						num[2]++;
						priceArr[2] = priceArr[2]+result[i].unit_price;
					}else if(result[i].num>=30000&&result[i].num<40000){
						num[3]++;
						priceArr[3] = priceArr[3]+result[i].unit_price;
					}else if(result[i].num>=40000&&result[i].num<50000){
						num[4]++;
						priceArr[4] = priceArr[4]+result[i].unit_price;
					}else if(result[i].num>=50000&&result[i].num<60000){
						num[5]++;
						priceArr[5] = priceArr[5]+result[i].unit_price;
					}else if(result[i].num>=60000&&result[i].num<70000){
						num[6]++;
						priceArr[6] = priceArr[6]+result[i].unit_price;
					}else if(result[i].num>=70000&&result[i].num<80000){
						num[7]++;
						priceArr[7] = priceArr[7]+result[i].unit_price;
					}else if(result[i].num>=80000&&result[i].num<90000){
						num[8]++;
						priceArr[8] = priceArr[8]+result[i].unit_price;
					}else if(result[i].num>=90000&&result[i].num<100000){
						num[9]++;
						priceArr[9] = priceArr[9]+result[i].unit_price;
					}else if(result[i].num>=100000){
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
		var min_price = req.query.min_price||0;
		var max_price = req.query.max_price || 10000000;
		var min_plotrate = req.query.min_plotrate || 0;
		var max_plotrate = req.query.max_plotrate || 20;
		console.log(district,min_price,max_price);
		var sql = [];
		var condition = [];
		if (req.query.district==="不限"||req.query.district==="区域") {
			sql = [$sql.queryByTimeAll1,$sql.queryByTimeAll2,$sql.queryByTimeAll3,$sql.queryByTimeAll4,$sql.queryByTimeAll5,$sql.queryByTimeAll6,$sql.queryByTimeAll7,];
			condition = [min_price,max_price,min_plotrate,max_plotrate];
		}else {
			sql = [$sql.queryByTime1,$sql.queryByTime2,$sql.queryByTime3,$sql.queryByTime4,$sql.queryByTime5,$sql.queryByTime6,$sql.queryByTime7];
			condition = [district,min_price,max_price,min_plotrate,max_plotrate];
		}
		//console.log("Time最终sql:"+sql);
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
					if(result[i].num<10000){
						num[0]++;
					}else if(result[i].num>=10000&&result[i].num<20000){
						num[1]++;
					}else if(result[i].num>=20000&&result[i].num<30000){
						num[2]++;
					}else if(result[i].num>=30000&&result[i].num<40000){
						num[3]++;
					}else if(result[i].num>=40000&&result[i].num<50000){
						num[4]++;
					}else if(result[i].num>=50000&&result[i].num<60000){
						num[5]++;
					}else if(result[i].num>=60000&&result[i].num<70000){
						num[6]++;
					}else if(result[i].num>=70000&&result[i].num<80000){
						num[7]++;
					}else if(result[i].num>=80000&&result[i].num<90000){
						num[8]++;
					}else if(result[i].num>=90000&&result[i].num<100000){
						num[9]++;
					}else if(result[i].num>=100000){
						num[10]++;
					}
				}
        console.log("queryByPriceAll:"+num);
				res.send({count:num});
				connection.release();

			});
		});
	}
};

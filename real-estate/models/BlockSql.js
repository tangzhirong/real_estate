// CRUD SQL语句
var block = {
	queryByDistrict: 'select * from community where district=?',
	queryAllBlocks: 'select * from community LIMIT 0,5',


	queryByBuild_time:'SELECT * FROM community where district=? order by build_time desc ;',


	queryByPlotRate1:'SELECT COUNT(1) AS num FROM community WHERE plot_rate<1.0 and district=?',
	queryByPlotRate2:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 1.0 and 1.5 and district=?',
	queryByPlotRate3:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 1.5 and 2.0 and district=?',
	queryByPlotRate4:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 2.0 and 2.5 and district=?',
	queryByPlotRate5:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 2.5 and 3.0 and district=?',
	queryByPlotRate6:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 3.0 and 3.5 and district=?',
	queryByPlotRate7:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 3.5 and 4.0 and district=?',
	queryByPlotRate8:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 4.0 and 4.5 and district=?',
	queryByPlotRate9:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 4.5 and 5.0 and district=?',
	queryByPlotRate10:'SELECT COUNT(1) AS num FROM community WHERE plot_rate>5.0 and district=?',
	queryByPrice:'SELECT AVG(community_price_history.price) AS num FROM  community JOIN community_price_history ON (community.id = community_price_history.community_id) WHERE district=? GROUP BY community.id ',
	queryByTime1:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time)>2011 and district=?',
	queryByTime2:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 2006 and 2011 and district=?',
	queryByTime3:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 2001 and 2006 and district=?',
	queryByTime4:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 1996 and 2001 and district=?',
	queryByTime5:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 1991 and 1996 and district=?',
	queryByTime6:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 1986 and 1991 and district=?',
	queryByTime7:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) <1986 and district=?',



	/*我写的*/
	queryByBuildAge:'select * from community where district=? order by build_time asc',
	queryByBuildPrice:'select * from community where district=? order by unit_price asc',


	queryByPlotRate1:'SELECT COUNT(1) AS num FROM community WHERE plot_rate<1.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate2:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 1.0 and 1.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate3:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 1.5 and 2.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate4:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 2.0 and 2.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate5:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 2.5 and 3.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate6:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 3.0 and 3.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate7:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 3.5 and 4.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate8:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 4.0 and 4.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate9:'SELECT COUNT(1) AS num FROM community WHERE plot_rate between 4.5 and 5.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate10:'SELECT COUNT(1) AS num FROM community WHERE plot_rate>5.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPrice:'SELECT AVG(community_price_history.price) AS num FROM  community JOIN community_price_history ON (community.id = community_price_history.community_id) WHERE community.district=? and YEAR(community.build_time) between ? and ? and community.plot_rate between ? and ? GROUP BY community.id ',
	queryByTime1:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time)>2011 and district=? and unit_price between ? and ?',
	queryByTime2:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 2006 and 2011 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime3:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 2001 and 2006 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime4:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 1996 and 2001 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime5:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 1991 and 1996 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime6:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) between 1986 and 1991 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime7:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) <1986 and district=? and unit_price between ? and ? and plot_rate between ? and ?',

	queryByPlotRate1:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate<1.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate2:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 1.0 and 1.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate3:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 1.5 and 2.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate4:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 2.0 and 2.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate5:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 2.5 and 3.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate6:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 3.0 and 3.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate7:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 3.5 and 4.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate8:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 4.0 and 4.5 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate9:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate between 4.5 and 5.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRate10:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>5.0 and district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPrice:'SELECT AVG(community_price_history.price) AS num, unit_price FROM  community JOIN community_price_history ON (community.id = community_price_history.community_id) WHERE community.district=? and YEAR(community.build_time) between ? and ? and community.plot_rate between ? and ? GROUP BY community.id ',
	queryByTime1:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>2011 and district=? and unit_price between ? and ?',
	queryByTime2:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) between 2006 and 2011 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime3:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) between 2001 and 2006 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime4:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) between 1996 and 2001 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime5:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) between 1991 and 1996 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime6:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) between 1986 and 1991 and district=? and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTime7:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) <1986 and district=? and unit_price between ? and ? and plot_rate between ? and ?',

	queryBlocksByPlotRate:'SELECT * FROM community WHERE district=? and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryBlocksByPrice:'SELECT * from community where district=? and YEAR(build_time) between ? and ? and plot_rate between ? and ?',
	queryBlocksByTime:'SELECT * FROM community WHERE district=? and unit_price between ? and ? and plot_rate between ? and ?',
  //不同维度总计
  //价钱维度
	queryByPriceAll:'SELECT AVG(community_price_history.price) AS num, unit_price FROM  community JOIN community_price_history ON (community.id = community_price_history.community_id) WHERE YEAR(community.build_time) between ? and ? and community.plot_rate between ? and ? GROUP BY community.id ',
	//房龄维度
	//queryByTimeAll:'SELECT COUNT(1) AS num FROM community WHERE YEAR(build_time) is not null and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTimeAll1:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>2011 and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTimeAll2:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>2006 and YEAR(build_time)<=2011 and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTimeAll3:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>2001 and YEAR(build_time)<=2006 and 2006 and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTimeAll4:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>1996 and YEAR(build_time)<=2001 and 2001 and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTimeAll5:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>1991 and YEAR(build_time)<=1996 and unit_price between ? and ? and plot_rate between ? and ?',
	queryByTimeAll6:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time)>1986 and YEAR(build_time)<=1991 and unit_price between ? and ? and plot_rate between ? and ?',
  queryByTimeAll7:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE YEAR(build_time) <=1986 and unit_price between ? and ? and plot_rate between ? and ?',
	//容积率维度
	queryByPlotRateAll1:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate<1.0 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll2:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=1.0 and plot_rate<1.5 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll3:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=1.5 and plot_rate<2.0 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll4:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=2.0 and plot_rate<2.5 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll5:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=2.5 and plot_rate<3.0 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll6:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=3.0 and plot_rate<3.5 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll7:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=3.5 and plot_rate<4.0 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll8:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=4.0 and plot_rate<4.5 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll9:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=4.5 and plot_rate<5.0 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
	queryByPlotRateAll10:'SELECT COUNT(1) AS num, SUM(unit_price)/COUNT(1) AS avg_price FROM community WHERE plot_rate>=5.0 and YEAR(build_time) between ? and ? and unit_price between ? and ?',
};


module.exports = block;

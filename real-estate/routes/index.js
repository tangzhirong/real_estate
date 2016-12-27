var express = require('express');
var router = express.Router();

var Block = require('../models/Block');

/* GET home page. */
router.get('/beijing', function(req, res, next) {
  res.render('index', { title: '链区网' });
});

router.get('/', function(req, res, next) {
  res.render('newIndex');
});

router.get('/getAllBlocks',function(req,res,next){
	Block.queryAllBlocks(req,res,next);
})
router.get('/getBlocksByBuild_time/:district',function(req,res,next){
    Block.queryByBuild_time(req,res,next);
})

router.get('/getBlocks/:district',function(req,res,next){
	Block.queryByDistrict(req,res,next);
})

router.get('/getBlocksByPlotRate',function(req,res,next){
	Block.queryByPlotRate(req,res,next);
})

router.get('/getBlocksByPrice',function(req,res,next){
	Block.queryByPrice(req,res,next);
})

router.get('/getBlocksByTime',function(req,res,next){
	Block.queryByTime(req,res,next);
})

router.get('/getBlocksByBuildType',function(req,res,next){
  Block.queryByBuildType(req,res,next);
})


router.get('/getBlocksByBuildAge/:district/:business',function(req,res,next){
	Block.queryByBuildAge(req,res,next);
})
router.get('/getBlocksByBuildAgeDesc/:district/:business',function(req,res,next){

	Block.queryByBuildAgeDesc(req,res,next);
})
router.get('/getBlocksByBuildPrice/:district/:business',function(req,res,next){
	Block.queryByBuildPrice(req,res,next);
})
router.get('/getBlocksByBuildPriceDesc/:district/:business',function(req,res,next){
	Block.queryByBuildPriceDesc(req,res,next);
})

router.get('/getBlockListByTime',function(req,res,next){
	Block.queryBlocksByTime(req,res,next);
})

router.get('/getBlockListByPlotRate',function(req,res,next){
	Block.queryBlocksByPlotRate(req,res,next);
})

router.get('/getBlockListByPrice',function(req,res,next){
	Block.queryBlocksByPrice(req,res,next);
})
//首页不同维度总计
router.get('/getBlocksByPriceAll',function(req,res,next){
  Block.queryByPriceAll(req,res,next);
})

router.post('/getBlockByAddress',function(req,res,next){
	 console.log("55555555555555555"+req.body.address);
    Block.queryByAddress(req,res,next);
})

router.get('/getBusinessByDistrict/:district',function(req,res,next){
    Block.queryBusinessByDistrict(req,res,next);
})

router.get('/getBlocksByBusiness/:business',function(req,res,next){
    Block.queryBlocksByBusiness(req,res,next);
})

router.get('/getBusinessByName/:business',function(req,res,next){
    Block.queryBusinessByName(req,res,next);
})


module.exports = router;

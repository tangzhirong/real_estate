var express = require('express');
var router = express.Router();

var Block = require('../models/Block');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: '链区网' });
// });

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

/*我写的*/
router.get('/getBlocksByBuildAge/:district',function(req,res,next){
	//console.log(req.params.district);
	Block.queryByBuildAge(req,res,next);
})

router.get('/getBlocksByUnitPrice/:district',function(req,res,next){
	Block.queryByBuildPrice(req,res,next);
})
/*我写的*/

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

module.exports = router;

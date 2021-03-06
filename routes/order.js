const log4js = require('../utils/log4js');
const utils = require('../utils/utils');
const logger = log4js.getLogger();
var express = require('express');
var orderRouter = express.Router();
const exchangeDAO = require('../dao/exchangeDAO');
const orderService = require('../services/order');

orderRouter.get('/', function(req, res, next) {
    logger.log("info", "user query:"+JSON.stringify(req.query));
    let qy = req.query
    orderService.getOrderByUserId(qy.userId).then(ret => {
        res.send(ret)
    })
});

orderRouter.get('/exchange', function(req, res, next) {
    logger.log("info", "exchange query:"+JSON.stringify(req.query));
    let qy = req.query
    exchangeDAO.queryByCode(qy.code,qy.password).then(result=> {
        logger.log("info", "exchange search result:" + JSON.stringify(result));
        if (result.length>0 && result[0].status===0){
            exchangeDAO.updateExchange(qy.userId,1,qy.code).then(updateResult=> {
                logger.log("info", "exchange update result:"+JSON.stringify(updateResult));
                let orderId = orderService.addOrder(result[0].goods_id,qy.userId)
                res.send(utils.responseForm(orderId));
            })
        }else {
            res.send("该兑换码已兑换，请确认后重试！");
        }
    })
});

orderRouter.post('/address', function(req, res, next) {
    logger.log("info", "exchange address:"+JSON.stringify(req.body));
    let qy = req.body
    orderService.changeAddress(qy.orderId,qy.consignee,qy.mobile,qy.address).then(ret => {
        res.send("地址修改成功，您可以在订单详情查看。")
    })
});

module.exports = orderRouter;

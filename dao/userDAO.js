var express = require('express');
var mysql = require('mysql');

var config = require('../config');
var $sql = require('./userSql');

var pool = mysql.createPool( config.sqlConfig );
const log4js = require('../utils/log4js');
const logger = log4js.getLogger();

var add=function (userInfo) {
        pool.getConnection(function(err, connection) {
            logger.info("add user :"+JSON.stringify(userInfo))
            userInfo=JSON.parse(userInfo)
            let result=queryByOpenid(userInfo.openid);
            logger.info("search result:"+JSON.stringify(result))
            if (result){
                return 'add success';
            }
            logger.info("begin add  user to db:"+userInfo.openid)
            connection.query($sql.insert, [userInfo.openid,userInfo.nickname, userInfo.openid, userInfo.sex, userInfo.openid], function(err, result) {
                // 释放连接
                logger.info("end add  user to db")

                if(err) {
                    logger.info("end add  user to db:"+JSON.stringify(err))
                }else{
                    //{"fieldCount":0,"affectedRows":1,"insertId":1,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
                    logger.info("end add  user to db:"+JSON.stringify(result))
                }
                connection.release();
            });
        });
    }
var queryAll=function (page,count) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, [page, count], function(err, result) {
                connection.release();
                if(err) {
                    return err
                }else{
                    return result;
                }
            });
        });
    }
var queryByOpenid= function (openid) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryByOpenid, [openid], function(err, result) {
                connection.release();
                if(err) {
                    return err
                }else{
                    return result;
                }
            });
        });
    }
var  update= function (userInfo) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
                if(err) {
                    res.send(err);
                }else{
                    res.send('update success');
                }
                connection.release();
            });
        });
    }

module.exports = {update,add,update,queryByOpenid,queryAll};
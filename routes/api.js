var wait = require('wait.for');
var util = require( "util" );
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

//defined Month string
var monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  

function handleGetReport(req, res){
  //create report structure data 
  var chartData = { 
          "cols": [{
                    id: "month",
                    label: "Month",
                    type: "string"
                }],
          "rows": []};

  var qYear = req.query.year? parseInt(req.query.year) : 2015;
  var qFromMonth = req.query.fmonth? parseInt(req.query.fmonth) : 1;
  var qToMonth = req.query.tmonth? parseInt(req.query.tmonth) : 12;
  
  //create mongo queries function. get all months had orders by year
  var funcMonths = [
    {$match: {orderYear: qYear , orderMonth : { $lte : qToMonth , $gte : qFromMonth } } },
    {$group: {_id: '$orderMonth'}},
    {$sort: {_id: -1}}];

  //excute queries get months by year
  var months  = wait.forMethod(Order, "aggregate", funcMonths);
  
  var month;  
  
  for (var i = months.length - 1; i >= 0; i--) {

    month = months[i]._id;
    // add months to chart
    chartData['cols'].push({
                    id: month + "-id",
                    label: monthsName[month -1] + " cohort",
                    type: "number"
                });

    var lines = {
                    c: [{
                        v: monthsName[month -1]
                    }]
                };
    //add default value (0) to per months 
    for (var j = months.length - 1; j >= 0; j--) {
      lines['c'].push({ v: 0});
    }
    //add rows to chart
    chartData['rows'].push(lines);
  }

  for (var i = months.length - 1; i >= 0; i--) {
  	month = months[i]._id;
    
    //create mongo queries function. get total order value of group by month(group order) group by month
    var funcGetGroup = [
         { $match: { orderGroup : month ,   orderMonth : { $lte : qToMonth , $gte : qFromMonth } } },
         { $group: { _id: "$orderMonth", total: { $sum: "$orderValue" } } },
         { $sort: { _id: 1} },
       ];

    //excute queries get order value of group
    var getGrouporder  = wait.forMethod(Order, "aggregate", funcGetGroup);

    //defined variable of total order in month
    var orderMonth = 0;
    var pre_index;
    var index;
    for (var j = 0; j<= getGrouporder.length - 1; j++) {
      var clos = getGrouporder[j]._id;
      //value of month add with total of pre-month. if there no order in current month, it should be the same value of previous month
      orderMonth += getGrouporder[j].total;
      //update data in chart
      index = clos - qFromMonth;
      chartData['rows'][index]['c'][month - qFromMonth + 1 ]['v'] = orderMonth;

      //correctly missing data of month have not order
      if(orderMonth && index - pre_index > 1){
        for (var k = pre_index + 1; k < index; k ++) {
          chartData['rows'][k]['c'][month - qFromMonth + 1 ]['v'] = chartData['rows'][k-1]['c'][month - qFromMonth + 1 ]['v'];
        };
      }
      pre_index = index;
    };
    
    //correctly last missing data of month have not order, when last month in report have no orders
    if(getGrouporder[getGrouporder.length -1]._id < qToMonth){
      chartData['rows'][qToMonth - qFromMonth ]['c'][month - qFromMonth + 1 ]['v'] = chartData['rows'][qToMonth - qFromMonth - 1]['c'][month - qFromMonth + 1 ]['v'];
    }
  };
  //renspone data of chart
  res.json(chartData);
}

/* GET report listing. */
router.get('/', function(req, res, next) {
  wait.launchFiber(handleGetReport, req, res);
});

/* GET report listing. */
router.get('/year', function(req, res, next) {
  Order.aggregate({$group: {_id: '$orderYear'}}, {$sort: {_id: -1}}, function (err, data) {
    if (err) return next(err);
    var years = [];
    for (var i = data.length-1; i >= 0; i--) {
      years.push(data[i]._id);
    };
    res.json(years);
  });
});

/* GET report listing. */
router.get('/month', function(req, res, next) {
  
  var qyear = req.query.ryear? parseInt(req.query.ryear) : 2015;
  Order.aggregate({ $match: { 'orderYear': qyear }},{$group: { _id: '$orderMonth'} }, {$sort: {_id: -1}}, function (err, data) {
    if (err) return next(err);
    var months = [];
    for (var i = data.length-1; i >= 0; i--) {
      var month = data[i]._id;
      months.push({ id: month, text : monthsName[month -1] } );
    };
    res.json(months);
  });
});

module.exports = router;

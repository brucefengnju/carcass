var express = require('express');
var User = require('./model/user');
var app = express(express.logger());
var log4js = require('log4js');

log4js.addAppender(require('fluent-logger').support.log4jsAppender('td.carcass-logger', {
    host: 'localhost',
    port: 24224,
    timeout: 3.0
}));

var logger = log4js.getLogger('carcass');

var port = process.env.PORT || 8080;
app.listen(port, function() {
    logger.info("carcass logger test start");
    console.log("Listening on " + port);
});

app.get('/', function(request, response) {
    response.send('Hello World!');
    var user = new User('test','male');
    var userinfo = JSON.stringify(user);
    logger.info(userinfo);
    logger.warn(userinfo + 'is not login');
    logger.error('userinfo' + ' is a error info');
    logger.fatal('this fatal info will be sent into fluentd');
});
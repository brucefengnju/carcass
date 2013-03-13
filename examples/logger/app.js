var express = require('express');
var app = express(express.logger());
var carcass = require('carcass');
var Model = carcass.factories.Model();
var log4js = require('log4js');

log4js.addAppender(require('fluent-logger').support.log4jsAppender('td.carcass-logger', {
    host: 'localhost',
    port: 24224,
    timeout: 3.0
}));

var logger = log4js.getLogger('carcass');

var port = process.env.PORT || 8080;

var logModel = function(msg,type){
    msg = msg||'';
    msg = JSON.stringify(this) + ':' + msg;
    type = type|| 'info';
    logger[type](msg);
}
var logStatic = function(msg,type,obj){
    msg = msg||'';
    type = type || 'info';
    if(obj){
        msg = JSON.stringify(obj) + ':' + msg;
    }
    logger[type](msg);
}

app.listen(port, function() {

    var model = Model();
    model.on('trace',function(msg){
        logger.trace(msg);
    });
    model.on('debug',function(msg){
        logger.debug(msg);
    });
    model.on('info',function(msg){
        logger.info(msg);
    });
    model.on('warn',function(msg){
        logger.warn(msg);
    });
    model.on('fatal',function(msg){
        logger.fatal(msg);
    });

    if(process.env.NODE_ENV === 'debug'){
        model.emit('trace',model.toJSON());
    }else{
        model.emit('trace',model.toJSON());
    }
    if(model.isValid()){
        model.emit('info',model);
    }else{
        model.emit('warn',model);
    }

    var other = Model({
        lorem: 'dolor'
    });
    other.on('log',logModel);

    if(other.has('lorem')){
        other.emit('log',' has lore property','info');
    }else{
        other.emit('log','dont has lore property','warn');
    }

    if(!other.isValid()){
        other.emit('log',' is not valid','error');
    }

    var validator = function(){
        console.log('validate is called');
    }
    var fun = function(obj){
        console.log(JSON.stringify(obj));

    }
    Model.validators = [validator];
    Model.on('logstatic',logStatic);
    Model.emit('logstatic','test');
    if(Model.use){
        Model.emit('logstatic','test','info');
        Model.use(fun);
    }

    console.log("Listening on " + port);
});

app.get('/', function(request, response) {
    response.send('Hello World!');
    var model = Model({
        name:'request',
        url:'/'
    });
    model.on('log',logModel);
    model.emit('log','called','info');
});
"use strict";
var express = require('express');
var nodeConfig = require("./nodeConfig.json");
global.nodeConfig = nodeConfig;
var routes = require('./routes/index');
var packageConfig = require("./package.json");
global.packageConfig = packageConfig;
var path = require('path');
var http = require('http');
var notificationServiceApp = require('./notificationservice');
notificationServiceApp.set('views', path.join(__dirname, 'views'));
notificationServiceApp.set('view engine', 'jade');
notificationServiceApp.use(express.static(path.join(__dirname, 'public')));
notificationServiceApp.get('/', routes.index);
http.createServer(notificationServiceApp).listen(nodeConfig.port, function () {
    console.log("Started");
});
module.exports = notificationServiceApp;
//# sourceMappingURL=app.js.map
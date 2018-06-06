'use strict';
var express = require("express");
var bodyparser = require("body-parser");
var http = require('http');
var async = require("async");
var appts = require("./app");
var Guid = require("guid");
var nodemailer = require('nodemailer');
var app = express();
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    database: 'pi',
    user: 'admin',
    password: 'admin',
});
//con.connect((err) => {
//    if (err) {
//        console.log('Error connecting to Db');
//        return;
//    }
//    console.log('Connection established');
//});
//var connection = mysql.createConnection({
//    host: 'gimre.ddns.net',
//    user: 'phpmyadmin',
//    password: 'gerike'
//});
////connection.connect(function (err) {
////    if (err) {
////        console.error('error connecting: ' + err.stack);
////        return;
////    }
////    console.log('connected as id ' + connection.threadId);
////});
//var con = mysql.createConnection({
//    database: "phpmyadmin",
//    host: "gimre.ddns.net",
//    port: "3306",
//    user: "phpmyadmin",
//    password: "gerike"
//});
//var sql = 'SELECT * FROM User ;';
//var selectResult;
//con.connect(function (err) {
//    if (err) throw err;
//    console.log("Selecteed email: ");
//    con.query(sql, function (err, result) {
//        if (err) throw err;
//        console.log(result.toString());
//    });
//});
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});
//con.connect(function (err) {
//    if (err) throw err;
//    console.log("Connected!");
//});
//con.connect(function (err) {
//    if (err) throw err;
//    console.log("Connected!");
//    con.query(sql, function (err, result) {
//        if (err) throw err;
//        console.log("Result: " + result);
//    });
//});
//var mysql = require('mysql');
//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'me',
//    password: 'secret',
//    database: 'my_db'
//});
//connection.connect();
//connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//    if (error) throw error;
//    console.log('The solution is: ', results[0].solution);
//});
//connection.end();
app.use(bodyparser.urlencoded({ extended: false, limit: '10000kb' }));
app.use(bodyparser.json({ type: "*/json", limit: '10000kb' }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.get('/verify/:verifyGuid/:email', function (request, response) {
    var email = request.params.email;
    var verifyGuid = request.params.verifyGuid;
    var sql = 'SELECT * FROM User where email = "' + email + '";';
    var selectResult;
    con.connect(function (err) {
        if (err)
            throw err;
        console.log("Selecteed email: " + email);
        con.query(sql, function (err, result) {
            if (err)
                throw err;
            selectResult = result;
        });
    });
    if (selectResult != null) {
        if (selectResult[0].IsVerified == false) {
            if (selectResult[0].verifyGuid == verifyGuid) {
                var sql = 'UPDATE User SET IsVerified = true Where email=' + email;
                var selectResult;
                con.connect(function (err) {
                    if (err)
                        throw err;
                    console.log("Verifying: " + email);
                    con.query(sql, function (err, result) {
                        if (err)
                            throw err;
                        selectResult = result;
                    });
                });
            }
        }
    }
});
app.post('/adduser', function (request, response) {
    var body = request.body;
    var sql = 'SELECT * FROM User where email = "' + body.email + '";';
    var selectResult;
    con.connect(function (err) {
        if (err)
            throw err;
        console.log("Connected!");
        con.query(sql, function (err, result) {
            if (err)
                throw err;
            selectResult = result;
        });
    });
    con.end();
    if (selectResult == null) {
        var verifyGuid = (Guid.create()).value;
        sql = 'INSERT INTO User (Name, Email, VerifyCode, IsVerified) VALUES (' + body.name + ',' + body.email + ',' + verifyGuid + ',' + 'false';
        con.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
                if (err)
                    throw err;
                selectResult = result;
            });
        });
        var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'myfriend@yahoo.com',
            subject: 'Verify your emaui',
            html: '<h1>Welcome</h1><p>httpl://gimre.ddns.com:9999/verify?verifyGuid=' + verifyGuid + '&email=' + body.email + '</p>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    if (1) {
        body = "success";
    }
    else {
        body = "error";
    }
    response.status(200);
    response.send(body);
});
var delay = 1000;
async.forever(function (next) {
    //le kell kérni a usereket 
    http.get({
        host: "google.com",
        path: "/"
    }, function (response) {
        // Continuously update stream with data
        var body = "";
        response.on("data", function (chunk) {
            body += chunk;
        });
        response.on("end", function () {
            //Store data in database
            //console.log(body);
            console.log("loop");
            //Repeat after the delay
            setTimeout(function () {
                next();
            }, delay);
        });
    });
}, function (err) {
    console.error(err);
});
module.exports = app;
//# sourceMappingURL=notificationservice.js.map
var express = require('express');
var router = express.Router();
var async = require('async');

var mysql = require('mysql');
var pool = mysql.createPool({
    "connectionLimit": 10,
    "host": "127.0.0.1",
    "port": "3306",
    "user": "root",
    "password": "root",
    "database": "home"
});

// 위 테이블 구조 
// CREATE TABLE `switches` (
//     `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
//     `number` int(11) NOT NULL,
//     `ip` varchar(15) NOT NULL DEFAULT '',
//     `title` varchar(255) DEFAULT NULL,
//     PRIMARY KEY (`id`),
//     UNIQUE KEY `number` (`number`)
// ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

var axios = require('axios');


module.exports = function(App) {

    // 나중에 페이지 만들 예정
    App.get('/', showMainPage);

    // 디바이스가 켜지면 자동으로 접속해서 자신을 등록한다
    App.get('/regist', registDevice);
    // 등록된 디바이스 리스트를 보내준다.
    App.get('/sw-lists', getSwitchLists);
    // 앱에서 디바이스로 명령을 보낸다.
    App.post('/action', postAction);
};


function showMainPage(req, res){
    res.render('index', { title: "Billy's Home-Improvement" });
};


function getSwitchLists(req, res) {

    // 현재 접속 되어 있는 모든 디바이스를 가져와 확인하고 앱에 정보를 보내 준다.
    let select_sql = 'SELECT * FROM switches ORDER BY number';
    pool.query(select_sql, [], function(err, results) {

        // 각 디바이스 IP 의 Status 를 받아온다.        
        async.each(results, function(sw, callback){
            var requestUrl = 'http://'+sw.ip+'/status';
            axios.get(requestUrl)
                .then(function(resp){
                    sw.status = resp.data;
                    callback();
                });
        }, function(err){
            // 결과를 전송
            res.send({ switches: results });
        });

    });
};

function registDevice(req, res){

    // 디바이스에서 접속을 받아 디바이스가 가진 IP를 DB에 저장한다.
    let update_sql = 'UPDATE switches SET ip = ?, title = ? WHERE number = ?';
    pool.query(update_sql, [req.query.ip, req.query.name, req.query.number], function(err) {
        if (err){
            res.send('FAIL');
        } else {
            res.send('OK');
        }
    });

};

function postAction(req, res){

    // 앱에서 스위치를 on/off 하면 디바이스를 끄거나 켠다.
    var status = ((req.body.status) ? "/on" : "/off")
    var requestUrl = 'http://'+req.body.ip+status;
    axios.get(requestUrl)
        .then(function(resp){
            res.send('OK');
        });

};
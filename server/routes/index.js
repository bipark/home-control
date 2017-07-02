var express = require('express');
var router = express.Router();

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
    let select_sql = 'SELECT * FROM switches ORDER BY number';
    pool.query(select_sql, [], function(err, results) {
        res.send({ switches: results });
    });
};

function registDevice(req, res){

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
    var status = ((req.body.status) ? "/on" : "/off")
    var requestUrl = 'http://'+req.body.ip+status;
    axios.get(requestUrl)
        .then(function(resp){
            res.send('OK');
        });

};
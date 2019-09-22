const Nightmare = require('nightmare');
const pefl = 'http://pefl.ru/';
// const urlIndex = pefl + 'index.php';
const login = require('./pefl-login');
const jim = pefl + 'desmond_jim.php';

// const searchPageRef = 'http://pefl.ru/plug.php?p=search&z=eaaba7976996785daecdd4ec941c1c3d';

const pefl_auth =  pefl + 'auth.php';
const selPeflLogin = 'td.back4 tr:nth-child(2) input[type=text]:nth-child(1)';
const selPeflPassword ='td.back4 tr:nth-child(2) form > input[type=password]:nth-child(2)';
const selIndexNews ='td.back4 tr:nth-child(1) > td > a:nth-child(2)';
const selID = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td:nth-child(3)';

const getHtml = (selector) => document.querySelector(selector).innerHTML;

const nightmare = Nightmare({show: false});

function GetPlayersBase(_url) {
    const jimUrl = _url;
  return new Promise(function(resolve, reject) {
        nightmare
        .goto(pefl_auth)
        .wait('body')
        .insert(selPeflLogin, login.login)
        .insert(selPeflPassword, login.password)
        .click('input[type=submit]')
        .wait(selIndexNews)
        .evaluate(function ev(){
          var xhr = new XMLHttpRequest();
          xhr.open("GET", 'http://pefl.ru/desmond_jim.php', false);
          xhr.overrideMimeType("application/octetstream; charset=x-user-defined");
          xhr.send();
          return xhr.responseText;
      })
      .end()
       .then((results)=> {
             console.log(jimUrl);
          const fs = require("fs");
          fs.writeFile("desmond_jim.zip", results, "binary", (err)=>{
            nightmare.end();
            resolve(results);
          })
        })
        .catch(err => {
          console.log("GetPlayersBase - ", err);
          nightmare.end();
          reject(err);          
        });;
  });
}


 //INSERT INTO `Yu6lr7ef8O`.`players` (`id`, `name`, `lastname`, `nation`, `age`, `position`, `type`, `teamId`, `ff`)
  // VALUES ('0', 'dfdd', 'rgwrtrw', '93', '15', 'GK', '2', '488', '93');
 
const insertUpdatePlayersSql = "INSERT INTO `Yu6lr7ef8O`.`players` (`name`, `nation`, `age`, `position`, `type`, `teamId`, `ff`, `href`)" + 
" VALUES ? " + 
" ON DUPLICATE KEY UPDATE name = VALUES(name),  nation = VALUES(nation), age = VALUES(age)" + 
", position = VALUES(position), type = VALUES(type), teamId = VALUES(teamId), ff = VALUES(ff), href = VALUES(href);" ;
// const insertUpdatePlayersSql = "INSERT INTO `Yu6lr7ef8O`.`players` (`name`, `nation`, `age`, `position`, `type`, `teamId`, `ff`, `href`)" + 
// " VALUES ? ;"
// " ON DUPLICATE KEY UPDATE name = VALUES(name),  nation = VALUES(nation), age = VALUES(age)" + 
// ", position = VALUES(position), type = VALUES(type), teamId = VALUES(teamId), ff = VALUES(ff), href = VALUES(href);" ;

let startTime, endTime;

const dbPool = require('./connection-pool');
const dbQuery = require('./db').dbQuery;
const dbExecute = require('./db').dbExecute;

function handlePlayersFile() {
    return new Promise((res, rej) => {
        const zip = new require('adm-zip')('desmond_jim.zip');
        zip.extractAllTo(/*target path*/"data/", /*overwrite*/true);
        const dataarr =[];
        const iconv = require("iconv-lite");
        const fs1 = require('fs');
        fs1.createReadStream('data/desmond_jim.txt')
        .pipe(iconv.decodeStream('win1251'))
        .pipe(iconv.encodeStream('utf8'))
        .on('data', function(data) {
            dataarr.push(data);
        })
        .on('end', function(data) {
            const playerRecords = dataarr.toString('utf8').slice(1).split('|');
            const players = [];
            let rec = [];
            let r = 0;
            playerRecords.forEach(el => {
                rec.push(el);
                if (++r === 9) {
                    players.push(rec);
                    r = 0;
                    rec = [];
                };
                
            });
                 res(players);


        })
        .on('error', function(err) {
            console.log("stream error - ", err);
            rej(err);
            
        });
    })
}
function dressUpRow(arr) {
  return "[tr]" + arr.reduce((acc, el) => acc +'[td]' + el + "[/td]", '') + "[/tr]";
}



function insertPlayersBase() {
  return new Promise((resolve, reject) => {

      GetPlayersBase(jim).then(results => {
          console.log("===============================================================================");
              return handlePlayersFile();
      })
      .catch(err => {
        reject("Upload from PEFL problem");
      })
      .then(playersArr => {
          const ff = 216;
          const playersToBd = playersArr.map((el, i) => {
            const player = el;
            player.forEach((col, i, arr) => arr[i] = col.replace(/\,/, ''));
            player[1] = player[0] === '' ? player[1] : player[0] + ' ' + player[1];
            if (player[7] == '') player[7] = '-1';
            // if (player[7] == '-1') console.log(i, player);
            player.shift();
            // if ( i>11882 & i<11885 || i>8609 & i<8612) console.log(i,player[1], player);
            return player
          });
          // console.log("playersToBd - ",  playersToBd.length);
          const playersFF = playersToBd.filter((element, index ) => {
            return true;
            // return index !== 8611 & index !== 11884 & index < 20000
           // return element[2]==ff 
            // if (element[2]==93 & element[5] == 1) console.log(element);
            // if (element[6]==teamId & element[5] > 0) console.log(element);
          });
          console.log("playersFF -" , playersFF.length);
          global.playersBase = playersToBd;

          return dbQuery(insertUpdatePlayersSql, playersFF);
      })
      .then(result => {
        // dbPool.end();
        resolve(true);
      })
      .catch(error => {
        // dbPool.end();
        reject(error);
      })
  })
  }


  startTime = new Date();
/**
 * delete FROM Yu6lr7ef8O.players where id>0;
alter table Yu6lr7ef8O.players AUTO_INCREMENT = 1;
 */
function updatePlayersBase(){

  return new Promise((res, rej) => {
    dbQuery("delete FROM Yu6lr7ef8O.players where id>0; alter table Yu6lr7ef8O.players AUTO_INCREMENT = 1;")
    .then(()=>{
      return insertPlayersBase();
    })
    .catch((err)=>{
      console.log("Clear players table err --", err);
      rej();
    })
    .then(resp=> {
        console.log("Calculation time", new Date() - startTime, "ms");
        // console.log(dbQuery("SELECT count(name) FROM `Yu6lr7ef8O`.`players`"));
        res(resp)
    })
    .catch(err=> {
        console.log(err);
        console.log("Calculation time", new Date() - startTime, "ms");
        rej();
      });

  })
};
 
// updatePlayersBase();
module.exports = updatePlayersBase;


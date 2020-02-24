const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const url = require('url');
const getPlayerRow = require('./model/form-player-string');
const HOSTNAME = process.env.HOST || '95.158.47.15';
const PORT = process.env.PORT || 3003;
console.log(__dirname);

const logger = require('morgan');
const rfs = require('rotating-file-stream');
const requestIp = require('request-ip');
const expressip = require('express-ip');

app.use("/public", express.static(__dirname + "/public"));
app.use("/", express.static(__dirname + "/public"));

app.use(function (req, res, next) {

    console.log("request - ", req.path);
    next();
});
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

app.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500") ;//"*");
    const allowedOrigins = ['http://127.0.0.1:5500', 'https://eugenkondratiev.github.io/nations', 'http://127.0.0.1:3003', 'http://95.158.47.15'];
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(requestIp.mw())
app.use(expressip().getIpInfoMiddleware);
logger.token('type', function (req, res) {
    return req.headers['content-type'];
});
logger.format('iplog', function (req, res) {
    if (!req.ipInfo.country) {
        return `${req.clientIp}`
    }
    const ipInfo = req.ipInfo;
    return `${req.clientIp} - ${ipInfo.country} - ${ipInfo.region} - ${ipInfo.eu} - ${ipInfo.city} - [${ipInfo.ll}]  - ${ipInfo.area}`;
});
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs')
});
const logFormat = ":iplog :remote-user [:date[iso]] :method \":url\" HTTP/:http-version :status :res[content-length] - :response-time ms";
app.use(logger(logFormat, {
    stream: accessLogStream
}));



app.get('/find', (req, res) => {

    const params = url.parse(req.url, true).query;
    const _name = params["name"];
    if (_name.length < 4) {
        res.json({
            fail: "Некорректный запрос"
        });
        return
    }
    try {
        console.log("playersBase - ", playersBase.length)
        const findResult = playersBase
            .filter(pl => pl)
            .filter(pl => pl[0].toLowerCase().includes(_name.toLowerCase()));
        if (!findResult.length) {
            res.json({
                fail: "Не найдено"
            });
            return
        }

        // res.json(findResult);
        res.json(findResult.map(row => getPlayerRow(row)));

        // 	 res.json({base: playersBase.length, findResult:findResult});
        //res.json(_name);
    } catch (err) {
        console.log(err)
        res.json({
            fail: err.message
        });
    }

})

app.get('/exot', (req, res) => {
    const params = url.parse(req.url, true).query;
    const _nation = parseInt(params.nation);

    if (_nation > 230 || _nation < 1) {
        res.json({
            fail: "Некорректный запрос"
        });
        return
    }
    try {
        const findResult = playersBase
            .filter(pl => pl)
            .filter(pl => +pl[1] == _nation);
        if (!findResult.length) {
            res.json({
                fail: "Не найдено"
            });
            return
        }

        // res.json(findResult);
        res.json(findResult.map(getPlayerRow));
    } catch (err) {
        console.log(err);
        res.json({
            fail: err.message
        });
    }

})
app.get('/latins', (req, res) => {

    try {
        const findResult = playersBase
            .filter(pl => pl)
            .filter(pl => pl[0].match(/[a-zA-Z]/g));
        if (!findResult.length) {
            res.json({
                fail: "Не найдено"
            });
            return
        }
        res.json(findResult.map(getPlayerRow));
    } catch (err) {
        console.log(err);
        res.json({
            fail: err.message
        });
    }
})

app.get('/ids', (req, res) => {
    res.json({
        nations: global.nationBase,
        base: {
            all: playersBase.length,
            school: playersBase.filter(pl => +pl[4] == 2).length,
            pens: playersBase.filter(pl => +pl[4] == 1).length
        }
    });
})
app.get('/', (req, res) => {
    console.log("/ send index");
    res.sendFile(__dirname + "/index.html", err => {
        if (err) console.log("index sending error ", err.message)
    })
    //res.sendStatus(200);
})




module.exports = () => {
    app.listen(PORT, () => {
        // app.listen(PORT, HOSTNAME, () => {
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
    })
}
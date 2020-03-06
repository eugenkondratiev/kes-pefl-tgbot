compression = require('compression');
const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const url = require('url');
const getPlayerRow = require('./model/form-player-string');
const HOSTNAME = process.env.HOST || '95.158.47.15';
const PORT = process.env.PORT || 3003;
process.env.NODE_ENV = "production";
console.log(__dirname);

app.use(compression());

const fs = require('fs');
app.use("/public", express.static(__dirname + "/public", {maxAge : "3d"}));
app.use("/", express.static(__dirname + "/public", {maxAge : "3d"}));

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

const useragent = require('express-useragent');
app.use(useragent.express());

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

require('./utils/request-logger')(app);

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
        res.json(findResult.map(row => getPlayerRow(row)));
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

        res.setHeader('Content-Type', 'application/json');
        res.json(findResult.map(getPlayerRow));
    } catch (err) {
        console.log(err);
        res.json({
            fail: err.message
        });
    }

})
app.get('/latins', (req, res) => {
    const BAD_SYMBOLS_REGEXP = /[^А-ЯЁа-яё\-\s\`\.]/g;

    try {
        const findResult = playersBase
            .filter(pl => pl)
            .filter(pl => pl[0].match(BAD_SYMBOLS_REGEXP));
        if (!findResult.length) {
            res.json({
                fail: "Не найдено"
            });
            return
        }
        res.setHeader('Content-Type', 'application/json');
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
});

app.get('/levi-find', (req, res) => {
    const params = url.parse(req.url, true).query;
    const leviDiff = parseInt(params["levi-length"]) || 2;
    const _name = params["name"];

    if (_name.length < 4 || leviDiff < 1 || leviDiff > 7) {
        res.json({
            fail: "Некорректный запрос"
        });
        return
    }
    try {
        const calcLeviLength = require('./utils/levi-length');

        const findResult = playersBase
            .filter(pl => pl)
            .filter(pl => {
                const levi = +calcLeviLength(_name.toLocaleLowerCase(), pl[0].toLocaleLowerCase(), leviDiff);
                if (levi < leviDiff) console.log(levi, _name, pl[0]);
                return levi < leviDiff;
            });
        if (!findResult.length) {
            res.json({
                fail: "Не найдено"
            });
            return
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(findResult.map(getPlayerRow));
    } catch (err) {
        console.log(err);
        res.json({
            fail: err.message
        });
    }
})

app.get('/doubles-find', (req, res) => {
    const params = url.parse(req.url, true).query;
    const ageDiff = parseInt(params["age-diff"]) || 5;
    const _name = params["name"];

    if (_name.length < 2) {
        res.json({
            fail: "Некорректный запрос"
        });
        return
    }
    try {
        const comparePlayersSmart = require('./utils/smart-names-comparator');

        const findResult = playersBase
            .filter(pl => pl)
            .filter((pl, i) => {
                const isSimilar = comparePlayersSmart(_name, pl[0]);
                if (isSimilar) console.log(isSimilar, _name, pl[0]);
                return isSimilar;
            });
        console.log(findResult.length)
        if (!findResult.length) {
            res.json({
                fail: "Не найдено"
            });
            return
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(findResult.map(getPlayerRow));
    } catch (err) {
        console.log(err);
        res.json({
            fail: err.message
        });
    }
})

app.get('/calculate-doubles', (req, res) => {
    const findDoubles = require('./utils/smart-players-compare');
    const start = Date.now();
    const answer = findDoubles();
    console.log("answer.length - ", answer.length);
    console.log(" doubles calculation time - ", Date.now() - start);
    res.setHeader('Content-Type', 'application/json');
    res.json("OK");
})

app.get('/doubles', (req, res) => {

    fs.readFile(__dirname + "/doubles.json", (err, data) => {
        if (err) {
            console.error;
            return;
        }
        try {
        const rowData = JSON.parse(data);
        const findResult = rowData.map(coincidence => coincidence.map(getPlayerRow));
        res.setHeader('Content-Type', 'application/json');
        res.json(findResult);
        } catch (error) {
            console.error(error);
        }
    })
        console.log(" doubles sending - ");

    
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
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
    })
}
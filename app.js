compression = require('compression');
const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const url = require('url');
const getPlayerRow = require('./model/form-player-string');
const HOSTNAME = process.env.HOST || '95.158.44.52';
const PORT = process.env.PORT || 3003;
process.env.NODE_ENV = "production";
console.log(__dirname);

app.use(compression());

const fs = require('fs');
app.use("/public", express.static(__dirname + "/public", { maxAge: "3d" }));
app.use("/", express.static(__dirname + "/public", { maxAge: "3d" }));

app.use(function (req, res, next) {
    console.log("request - ", req.path);
    next();
});
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 5000
}));
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

const useragent = require('express-useragent');
app.use(useragent.express());
app.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500") ;//"*");
    const allowedOrigins = ['http://127.0.0.1:5500', 'https://eugenkondratiev.github.io/nations',
        'http://127.0.0.1:3003',
        'http://95.158.47.15',
        'http://95.158.47.15:3003',
        'http://95.158.47.15:3001'
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require('./utils/request-logger')(app);


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

const doubles = require('./routes/doubles');
const finds = require('./routes/find');

app.use('/doubles', doubles);
app.use('/find', finds);

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
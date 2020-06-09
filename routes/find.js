const router = require('express').Router();
// const fs = require('fs');
// const path = require('path');

const getPlayerRow = require('../model/form-player-string');
const url = require('url');

router.get('/latins', (req, res) => {
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



router.get('/levi', (req, res) => {
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
        const calcLeviLength = require('../utils/levi-length');

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

router.get(['/part','/'], (req, res) => {

    const params = url.parse(req.url, true).query;
    const _name = params["name"];
    console.log(params);
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
module.exports = router;
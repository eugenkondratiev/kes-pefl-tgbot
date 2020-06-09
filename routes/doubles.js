const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const getPlayerRow = require('../model/form-player-string');
const url = require('url');

router.get('/find', (req, res) => {
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
        const comparePlayersSmart = require('../utils/smart-names-comparator');

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

router.post('/calculate', (req, res) => {
    const findDoubles = require('../utils/promise-smart-players-compare');
    const start = Date.now();
    setTimeout(()=>{
        const answer = findDoubles();
        console.log("answer.length - ", answer.length);
        console.log(" doubles calculation time - ", Date.now() - start);
        },0);
    res.setHeader('Content-Type', 'application/json');
    res.json("Doubles calculation started");
})


router.get('/fixed', async (req, res) => {

    const { readFixedDoubles } = require('../utils/_compare-results');
    try {
        const rowData = await readFixedDoubles();
        const findResult = rowData.map(coincidence => coincidence.map(getPlayerRow));
        res.setHeader('Content-Type', 'application/json');
        res.json(findResult);
    } catch (error) {
        console.error(error);
    }
    // })
    console.log(" fixed doubles sending - ");


})
router.get('/new', async (req, res) => {

    const { readNewDoubles } = require('../utils/_compare-results');
    try {
        const rowData = await readNewDoubles();
        const findResult = rowData.map(coincidence => coincidence.map(getPlayerRow));
        res.setHeader('Content-Type', 'application/json');
        res.json(findResult);
    } catch (error) {
        console.error(error);
    }
    // })
    console.log(" new doubles sending - ");


})
router.get(['/all','/'], (req, res) => {

    fs.readFile(path.join(__dirname, "../doubles.json"), (err, data) => {
        if (err) {
            console.error;
            return;
        }
        try {
            const rowData = JSON.parse(data);
            const findResult = rowData.map(coincidence => coincidence.map(getPlayerRow));
            console.log("results - ", findResult.length);

            res.setHeader('Content-Type', 'application/json');
            res.json(findResult);
        } catch (error) {
            console.error(error);
        }
    })
    console.log(" doubles sending - ");


})
module.exports = router;
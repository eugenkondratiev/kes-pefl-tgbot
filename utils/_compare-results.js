// const fsp = require('fs/promises');
console.log("Start");

const fs = require("fs");
const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const rename = promisify(fs.rename);

async function readNewDoubles() {
    const lastDoubles = await readFile('./doubles-last.json', { encoding: null });
    const currentDoubles = await readFile('./doubles.json', { encoding: null });
    const lastData = JSON.parse(lastDoubles);
    const currentData = JSON.parse(currentDoubles);


    const newDoubles = currentData.filter(pair => !lastData.some(lastPair => lastPair[0][0] == pair[0][0]));
    return newDoubles;
}

async function readFixedDoubles() {
    const lastDoubles = await readFile('./doubles-last.json', { encoding: null });
    const currentDoubles = await readFile('./doubles.json', { encoding: null });
    const lastData = JSON.parse(lastDoubles);
    const currentData = JSON.parse(currentDoubles);

    // console.log(lastData.length, currentData.length);

    const fixedDoubles = lastData.filter(pair => !currentData.some(currentPair => currentPair[0][0] == pair[0][0]));
    // console.log(newDoubles, "newDoubles -", newDoubles.length);
    // console.log(fixedDoubles, "fixedDoubles -", fixedDoubles.length);
    return fixedDoubles;
}

// main()
//     .then(() => { console.log("ok") })
//     .catch((err) => { console.log(err) });

module.exports = {
    readFixedDoubles: readFixedDoubles,
    readNewDoubles: readNewDoubles
}
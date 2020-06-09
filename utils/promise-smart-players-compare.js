const compareNames = require('./promise-smart-names-comparator');
const NOCLONES_AGE_DIFFERENSE = 6;

async function comparePlayersSmart(player1, player2) {
    // console.log("comparePlayersSmart   " , player1[0], player2[0]);
    try {
        if (!player1 || !player2) return false;
        if (Math.abs(+player2[2] - +player1[2]) > NOCLONES_AGE_DIFFERENSE) return false;
        return await compareNames(player1[0], player2[0]);
        
    } catch (error) {
        console.error;
    }
}

module.exports = async function () {
    // player[0] = name
    //player[2] = age
    // 
    const _base = new Array().concat(playersBase);
    const baseLength = _base.length;
    console.log(" players quantity - ", baseLength);

    const result = new Array();
    // for (let first = 0; first < 5000; first++) {
    for (let first = 0; first < baseLength; first++) {
        let isDoubles = false;
        const coincidence = new Array();
        // setTimeout(() => {

        for (let second = first + 1; second < baseLength; second++) {
            const player1 = _base[first];
            const player2 = _base[second];
            try {

                if (await comparePlayersSmart(player1, player2)) {
                    if (!isDoubles) {
                        coincidence.push(player1);
                        isDoubles = true;
                    }
                    coincidence.push(player2);
                    delete _base[second];
                }
            } catch (error) {
                console.error;
            }

        }

        //   }, 0)

        if (coincidence.length) {
            result.push(coincidence);
            console.log(coincidence.length, "   ", _base[first][0], first);
        }
    }
    const fs = require('fs');
    fs.writeFile('./doubles.json', JSON.stringify(result, null, ""), err => {
        if (err) console.error;

    });
    return result;
}
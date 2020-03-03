const compareNames = require('./smart-names-comparator');
const NOCLONES_AGE_DIFFERENSE = 5;


module.exports = function (_name, player) {
    if (!player) return false;
    // if (Math.abs(+player2[2] - +player1[2]) > NOCLONES_AGE_DIFFERENSE) return false;
    // console.log("comparePlayersSmart   " , player1[0], player2[0]);

    return compareNames(_name, player);
}
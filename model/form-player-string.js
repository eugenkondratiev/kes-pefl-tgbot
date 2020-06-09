// const peflSearcher = require('./pefl-searcher');
const getClubUrl = require('./pefl-searcher').prototype.getClubUrl;
const pefl_host = 'plug.php';
const pefl = 'http://pefl.ru/';

module.exports = (row) => {
    const prettyRow = new Array().concat(row);
    const _nation = global.nationBase[row[1]];
    const _club = global.clubsBase[row[5]];

    // prettyRow[1] = _nation[1];
    prettyRow[4] = row[4] == 0 ? "-" : row[4] == 2 ? "шк" : "пенс";
    if (row[4] == 1) prettyRow[7] = pefl + row[7];
    prettyRow[8] = _club ? _club[1] : " свободный ";
    // prettyRow[9] = _club ?_club[2] : "";
    prettyRow[9] = _club ? getClubUrl(row[5], _club[2]) : "";
    prettyRow[10] = _nation[1];
    prettyRow[11] = row[6] == -1 ? "-1" : global.nationBase[row[6]][1];

    return prettyRow
}
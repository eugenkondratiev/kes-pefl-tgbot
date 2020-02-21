const peflSearcher = require('./pefl-searcher');
const getClubUrl = peflSearcher.prototype.getClubUrl;

module.exports = (row) => {
        const prettyRow = [].concat(row);
        const _nation = global.nationBase[row[1]];
        const _club =  global.clubsBase[row[5]];

        prettyRow[1] = _nation[1];
        prettyRow[4] = row[4] == 0 ? "-" : row[4] == 2 ? "шк" : "пенс" ;
        prettyRow[5] = _club ? _club[1] : " свободный ";

    return prettyRow
}
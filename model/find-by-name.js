let findByNameResponse = [];
let viewPosition = 0;
function getPlayersPortion(){
    return findByNameResponse.filter((pl, index) => index >= viewPosition && index < (viewPosition + 30));
}

function findByName(nameSubString) {
    findByNameResponse = playersBase.filter(pl => pl[0].includes(nameSubString));
    return findByNameResponse.length < 31  
            ? findByNameResponse
            : getPlayersPortion()
}

function getNextPortionOfPlayers() {
    if (findByNameResponse.length > viewPosition + 30 ) viewPosition += 30;
    return getPlayersPortion();
}
function getPrevPortionOfPlayers() {
    if (viewPosition >= 30 ) viewPosition -= 30;
    return getPlayersPortion();
}

module.exports = {
    findByName : findByName,
    getNextPortionOfPlayers : getNextPortionOfPlayers,
    getPrevPortionOfPlayers : getPrevPortionOfPlayers
}

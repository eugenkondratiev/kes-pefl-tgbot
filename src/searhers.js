const renderDoubles = require('./renders').renderDoubles;
const renderResults = require('./renders').renderResults;

const API_HOST = "http://95.158.47.15:3003";
// const API_HOST = "http://127.0.0.1:3003";
const ajaxGet = require('./utils/ajaxwrap');

async function getDoubles(command) {
    console.log('get ' + command + ' doubles! ');

    try {
        const resp = await ajaxGet("GET", `${API_HOST}/doubles/${command}`);
        try {
            const answer = JSON.parse(resp);
            console.log(JSON.stringify(answer));

            // const searchTarget = document.getElementById("by-name");
            renderDoubles(answer);

        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function getNewDoubles() {
    
    // console.log('get New doubles! ');
    try {
        await getDoubles("new");
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function getAllDoubles() {
    
    // console.log('get New doubles! ');
    try {
        // await getDoubles("");
        await getDoubles("all");
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function getFixedDoubles() {
    
    // console.log('get New doubles! ');
    try {
        await getDoubles("fixed");
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function searchByName() {
    const _name = document.querySelector("#player-name").value.toLocaleLowerCase();
    console.log('searchByName! ', _name);

    try {
        const resp = await ajaxGet("GET", `${API_HOST}/find/part?name=${_name}`);
        try {
            const answer = JSON.parse(resp);
            console.log(JSON.stringify(answer));

            // const searchTarget = document.getElementById("by-name");
            renderResults(answer);

        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function leviSearchByName() {
    const _name = document.querySelector("#levi-name").value.toLocaleLowerCase();
    const _length = document.querySelector("#levi-length").value;
    console.log('searchByName by Levinstein! ', _name, _length);

    try {
        const resp = await ajaxGet("GET", `${API_HOST}/find/levi?name=${_name}&levi-length=${_length}`);
        try {
            const answer = JSON.parse(resp);
            console.log(JSON.stringify(answer));

            // const searchTarget = document.getElementById("by-name");
            renderResults(answer)
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function searchByPairs() {
    const _name = document.querySelector("#levi-name").value.toLocaleLowerCase();
    // const _length = document.querySelector("#age-diff").value;
    const _length = document.querySelector("#levi-length").value;
    console.log('searchByName by symbol pairs! ', _name, _length);

    try {
        const resp = await ajaxGet("GET", `${API_HOST}/doubles/find?name=${_name}&age-diff=${_length}`);
        try {
            const answer = JSON.parse(resp);
            console.log(JSON.stringify(answer));

            // const searchTarget = document.getElementById("by-name");
            renderResults(answer)
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log("search error ", error.message)
    }
}
async function searchByNation() {
    const _nation = document.querySelector("#nation").value;
    console.log('searchByNation! ', _nation)

    try {
        const resp = await ajaxGet("GET", `${API_HOST}/exot?nation=${_nation}`);
        try {
            const answer = JSON.parse(resp);

            renderResults(answer)
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log("search error ", error.message);
    }
}

module.exports = {
    getAllDoubles: getAllDoubles,
    getNewDoubles: getNewDoubles,
    getFixedDoubles: getFixedDoubles,
    searchByName: searchByName,
    leviSearchByName: leviSearchByName,
    searchByPairs: searchByPairs,
    searchByNation: searchByNation
}
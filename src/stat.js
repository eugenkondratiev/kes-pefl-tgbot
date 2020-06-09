;
//Promise = require("@babel/polyfill");

const b = require("@babel/polyfill");

// var Promise = require('promise-polyfill').default;

// const API_HOST = "http://127.0.0.1:3003";
const API_HOST = "http://95.158.47.15:3003";


const renderResults = require('./renders').renderResults;

const ajaxGet = require('./utils/ajaxwrap');

function getNationsBase() {
    ajaxGet("GET", API_HOST + "/ids")
        .then(ids => {
            const lists = JSON.parse(ids);
            const _base = lists.base;
            console.log(_base);
            // document.getElementById("current-stat").textContent = `Всего игроков: ${_base.all}, школьников: ${_base.school}, пенсионеров: ${_base.pens}`;
            document.getElementById("base-all").textContent = _base.all;
            document.getElementById("base-school").textContent = _base.school;
            document.getElementById("base-pens").textContent = _base.pens;

            const _nations = lists.nations.filter(a => a).sort((a, b) => a[1].localeCompare(b[1], 'ru', { sensitivity: 'base' }));
            const selectNation = document.getElementById("nation");
            _nations.forEach(element => {
                if (element) selectNation.appendChild(new Option(element[1], element[0]))
            });
        })
        .catch(errResponse => { console.log(errResponse) });
}

window.addEventListener('load', () => {
    getNationsBase();
    const { getAllDoubles, getNewDoubles, getFixedDoubles, searchByName, leviSearchByName, searchByPairs, searchByNation } = require('./searhers');

    function addCommonListener(_id, _eventType, cb) {
        document.querySelector(_id).addEventListener(_eventType, (e) => {
            e.preventDefault();
            cb()
                .then(resp => {
                    ;
                })
                .catch(err => console.log(err.message));
        });
    }

    addCommonListener("#player-name", 'change', searchByName);
    addCommonListener("#player-button", 'click', searchByName);
    addCommonListener("#levi-button", 'click', leviSearchByName);
    addCommonListener("#double-button", 'click', searchByPairs);
    addCommonListener("#nation", 'change', searchByNation);
    addCommonListener("#all-doubles-button", 'click', getAllDoubles);
    addCommonListener("#new-doubles-button", 'click', getNewDoubles);
    addCommonListener("#fixed-doubles-button", 'click', getFixedDoubles);


    document.querySelector("#latin-button").addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('search latin letters in names! ');

        try {
            const resp = await ajaxGet("GET", `${API_HOST}/find/latins`);
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
    });

});



;
// const API_HOST = "http://127.0.0.1:3003";
 const API_HOST = "http://95.158.47.15:3003";
const searchTarget = document.getElementById("search-result");


function getSimplePlayerRow(row, i) {

    row[0] = (row[7] == "")
        ? (i + 1 + ". " + row[0])
        : `<a href="http://pefl.ru/${row[7]}" target="_blank">${i + 1 + ". " + row[0]}</a>`; // имя со ссылкой для пенсов
    row[1] = row[10] + `<img src="https://mylene.net.ru/pefl/nations/img/flags/sm/${row[1]}.gif" width="20" title="${row[10]}">`
    row[5] = row[5] < 1 ? " свободный " : `<a href=${row[9]} target="_blank">${row[8]}</a>`; // клуб со ссылкой если есть 
    row[6] = row[6] == -1 ? " " : `(${row[11]} )`; // ФФ если не свободный
    // row.unshift(i + 1 + ". ");
    const shortRow = row.slice(0, 7);
    shortRow.push("<br>");
    return shortRow.join(" ");
}

function renderResults(answer) {
    if (answer.fail) {
        searchTarget.textContent = answer.fail;
        return
    }
    searchTarget.innerHTML = answer.map(getSimplePlayerRow).join("\n\r");
}

function renderDoubles(answer) {
    if (answer.fail) {
        searchTarget.textContent = answer.fail;
        return
    }
    let renderetOutput = "<p>Поиск без учета позиций и нации. Разница в возрасте <=5 лет от первого в группе игрока.<p>" + 
    "<p>Состояние базы игроков и символьных пар для поиска на 03.03.2020.<p>" +
    "<p>Более молодые игроки, а значит большая вероятность потенциальных клонов  - внизу списка.<p><br>";
    answer.forEach((conincedence, i) => {
        renderetOutput += "<br>";
        renderetOutput +=  i + 1 + ". " + conincedence[0][0]  + "<br>";

        renderetOutput += conincedence.map(getSimplePlayerRow).join("\n\r");
    })
    searchTarget.innerHTML = renderetOutput;

}

function getNationsBase() {
    ajaxGet("GET", API_HOST + "/ids")
        .then(ids => {
            const lists = JSON.parse(ids);
            const _base = lists.base;
            console.log(_base);
            document.getElementById("current-stat").textContent = `Текущее количество игроков: ${_base.all}, школьников: ${_base.school}, пенсионеров: ${_base.pens}`;
            const _nations = lists.nations.filter(a => a).sort((a, b) => a[1].localeCompare(b[1], 'ru', { sensitivity: 'base' }));
            const selectNation = document.getElementById("nation");
            _nations.forEach(element => {
                if (element) selectNation.appendChild(new Option(element[1], element[0]))
            });
        })
        .catch(errResponse => { console.log(errResponse) });
}
function ajaxGet(method, requestString) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => { rej("xhr error") });
        xhr.addEventListener("abort", () => { rej("xhr aborted") });

        xhr.addEventListener("loadend", function () {
            res(this.responseText);

            // res(xhr.responseText);

        });

        xhr.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                console.log(`Received ${event.loaded} of ${event.total} bytes`);
            } else {
                console.log(`Received ${event.loaded} bytes totally`); // no Content-Length
            }

        });
        xhr.open(method, requestString);

        xhr.send();
    });

}
window.addEventListener('load', () => {
    getNationsBase();
    async function getAllDoubles() {
        console.log('get All doubles! ');

        try {
            const resp = await ajaxGet("GET", `${API_HOST}/doubles`);
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
    async function searchByName() {
        const _name = document.querySelector("#player-name").value.toLocaleLowerCase();
        console.log('searchByName! ', _name);

        try {
            const resp = await ajaxGet("GET", `${API_HOST}/find?name=${_name}`);
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
            const resp = await ajaxGet("GET", `${API_HOST}/levi-find?name=${_name}&levi-length=${_length}`);
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
            const resp = await ajaxGet("GET", `${API_HOST}/doubles-find?name=${_name}&age-diff=${_length}`);
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

    function addCommonLstener(_id, _eventType, cb) {
        document.querySelector(_id).addEventListener(_eventType, (e) => {
            e.preventDefault();
            cb()
                .then(resp => {
                    ;
                })
                .catch(err => console.log(err.message));
        });
    }

    addCommonLstener("#player-name", 'change', searchByName);
    addCommonLstener("#player-button", 'click', searchByName);
    addCommonLstener("#levi-button", 'click', leviSearchByName);
    addCommonLstener("#double-button", 'click', searchByPairs);
    addCommonLstener("#nation", 'change', searchByNation);
    addCommonLstener("#all-doubles-button", 'click', getAllDoubles);


    document.querySelector("#latin-button").addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('search latin letters in names! ');

        try {
            const resp = await ajaxGet("GET", `${API_HOST}/latins`);
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



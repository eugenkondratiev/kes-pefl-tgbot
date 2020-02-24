;
const API_HOST = "http://95.158.47.15:3003";
const searchTarget = document.getElementById("search-result");

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
        .catch(errResponse => {console.log(errResponse)});
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

    async function searchByName() {
        const _name = document.querySelector("#player-name").value;
        console.log('searchByName! ', _name);

        try {
            const resp = await ajaxGet("GET", `${API_HOST}/find?name=${_name}`);
            try {
                const answer = JSON.parse(resp);
                console.log(JSON.stringify(answer));

                // const searchTarget = document.getElementById("by-name");
                if (answer.fail) {
                    searchTarget.textContent = answer.fail;
                    return
                }
                searchTarget.innerHTML = answer.map((row, i) => {
                    row.unshift(i+1+". ");
                    row.push("<br>");
                    return row.join("  -   ");
                })
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
 
                if (answer.fail) {
                    searchTarget.textContent = answer.fail;
                    return
                }
                searchTarget.innerHTML = answer.map((row, i) => {
                    row.unshift(i+1+". ");
                    row.push("<br>");
                    return row.join("    -   ");
                })
             } catch (error) {
                console.log(error.message);
            }
        } catch (error) {
            console.log("search error ", error.message);
        }
    }

    document.querySelector("#player-name").addEventListener('change', (e) => {
        e.preventDefault();
        searchByName()
            .then(resp => {
                ;
            })
            .catch(err => console.log(err.message));
    });
    document.querySelector("#player-button").addEventListener('click', (e) => {
        e.preventDefault();
        searchByName()
            .then(resp => {
                ;
            })
            .catch(err => console.log(err.message));
    });
    document.querySelector("#latin-button").addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('search latin letters in names! ');

        try {
            const resp = await ajaxGet("GET", `${API_HOST}/latins`);
            try {
                const answer = JSON.parse(resp);
                console.log(JSON.stringify(answer));

                // const searchTarget = document.getElementById("by-name");
                if (answer.fail) {
                    searchTarget.textContent = answer.fail;
                    return
                }
                searchTarget.innerHTML = answer.map((row, i) => {
                    row.unshift(i+1+". ");
                    row.push("<br>");
                    return row.join("  -   ");
                })
            } catch (error) {
                console.log(error.message);
            }
        } catch (error) {
            console.log("search error ", error.message)
        }
    });
    // document.querySelector("#nation-button").addEventListener('click', (e) => {
    //     e.preventDefault();
    //     searchByNation()
    //         .then(resp => {
    //             ;
    //         })
    //         .catch(err => console.log(err.message));
    // });
    document.querySelector("#nation").addEventListener('change', (e) => {
        e.preventDefault();
        searchByNation()
            .then(resp => {
                ;
            })
            .catch(err => console.log(err.message));

    });
});


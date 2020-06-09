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
    "<p>Состояние базы игроков и символьных пар для поиска на 28.04.2020.<p>" +
    "<p>Более молодые игроки, а значит большая вероятность потенциальных клонов  - внизу полного списка.<p><br>";
    answer.forEach((conincedence, i) => {
        renderetOutput += "<br>";
        renderetOutput +=  i + 1 + ". " + conincedence[0][0]  + "<br>";

        renderetOutput += conincedence.map(getSimplePlayerRow).join("\n\r");
    })
    searchTarget.innerHTML = renderetOutput;

}

module.exports = {
    renderResults : renderResults,
    renderDoubles : renderDoubles
}
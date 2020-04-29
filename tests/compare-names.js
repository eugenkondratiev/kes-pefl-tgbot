const comparePlayersSmart = require('../utils/smart-names-comparator');

const testsArray = [
    ["Жоао Карлос", "Жуан Карлос"],
    ["Жоао", "Жуан"],
    [ "Жуан", "Жоао"],
    ["Паку Флореш", "Пако Флорес"],
    ["МакКан", "МкКэн"],
    ["Бьёрн", "Бьерн"],
    ["Бьёрн", "Бьерн"],
    ["Ббббббьё", "Ббббббье"],
    ["Бруно", "'Пол О`Донохью'"],
    ["Бруну Лопеш", "Бруно ЛОпес"],
]

testsArray.forEach(el => {
    console.log(el, comparePlayersSmart(el[0], el[1]))
});

// console.log(testsArray[1], comparePlayersSmart(testsArray[1][0], testsArray[1][1]))
// console.log(testsArray[7], comparePlayersSmart(testsArray[7][0], testsArray[7][1]))



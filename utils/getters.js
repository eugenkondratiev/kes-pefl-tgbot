const getHtml = (selector) => document.querySelector(selector).innerHTML;
const getParameter = (href, par) => href.match(new RegExp("(\?<=\\&" + par + "=)[\\w\\d]{1,6}(\?=\\&)", 'g'))[0];
const getRoundName = (href) => href.match(/[A-ЯЁЪа-яёъ\w\s\/]+(?=\()/g)[0].trim();
const tCodes = {
    "v" : [0,"Чемпионат"],
    "cup": [1,"Суперубок"],
    "supercup": [2,"Суперкубок"],
    "ec": [3,"Международный"],
    "ectov": [4,"ТоварищескийТурнир"],
    "f": [5,"Товарищеский"],
    "t": [6,"ФФ"],

};

module.exports = {
    getHtml,
     getParameter,
      getRoundName, 
      tCodes};

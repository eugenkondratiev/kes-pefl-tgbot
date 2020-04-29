const findDoubles = require('../utils/smart-players-compare');

// const {pairs} = require('../utils/consts');

const fs = require('fs');

const start = Date.now();
const answer = findDoubles();
console.log("answer.length - ", answer.length);
console.log(" doubles calculation time - ", Date.now() - start);


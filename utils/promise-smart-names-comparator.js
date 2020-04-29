const {pairs} = require('./consts');

const BAD_SYMBOLS_REGEXP = /[^А-ЯЁа-яё\-\s\`\.]/g;
// const BAD_SYMBOLS_REGEXP = /[\']/g;
const pairsRegExp = pairs.map(pair => {
    const _firstRegExp = new RegExp(pair[0].toLocaleLowerCase(), "g"); 
    const _secondRegExp = new RegExp(pair[1].toLocaleLowerCase(), "g");
  
   return { first: pair[0].toLocaleLowerCase(), second: pair[1].toLocaleLowerCase(), firstRegExp:_firstRegExp, secondRegExp: _secondRegExp}
  });


  async function removeSimilarSymbols(pairToCompair,  _index) {
    let changes = 0;
      let index = _index;
      let a = pairToCompair[0];
      let b = pairToCompair[1];  
      // console.log(a, b);
      
      pairsRegExp.forEach(pair => {
        let isAnyChange = false;
      a = a.replace(pair.firstRegExp, (match, offset, string) => {
        if (b.indexOf(pair.second, offset) === offset) {
          if  (!isAnyChange) {
            index = offset + pair.first.length;
            isAnyChange = true;
          }
          changes++;
          return pair.second;
        } else {
         return pair.first;
        }
        
      });
  
      a = a.replace(pair.secondRegExp, (match, offset, string) => {
          if (b.indexOf(pair.first, offset) === offset) {
            if  (!isAnyChange) {
              index = offset + pair.second.length;
              isAnyChange = true;
            }
            changes++;
            return pair.first;
          } else {
           return pair.second;
          }
          
        });
      })
  
      return {data: [a, b], changes : changes, index: index};
    }

async function compairPossibleDoubles(_a, _b) {
    let a = _a.toLocaleLowerCase().replace(/[\'\`\-]/g, "");
    let b = _b.toLocaleLowerCase().replace(/[\'\`\-]/g, "");
    if (!a.localeCompare(b)) return true;
    let changes = 0; let _index = 0;
    do {
      try {
        const answer = await removeSimilarSymbols([a, b], _index);
        a = answer.data[0]; b = answer.data[1];
        _index = answer.index;
        changes = answer.changes; 
      } catch (error) {
        console.error;
      }
    } while (changes > 0);

    if (!a.localeCompare(b)) return true;

    return false;
}


module.exports = compairPossibleDoubles;

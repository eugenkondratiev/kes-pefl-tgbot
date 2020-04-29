const pairs = [
    ["мак", "мк"],
     ["йа", "жа"],
    ["жоао", "жуан"],
       ["ж", "дж"],
   ["о", "у"],
  ["ш", "с"],
  ["э", "е"],
    ["э", "а"],
  ["е", "ё"],
    ["х", "ж"],
    ["е", "а"],
   ];
  
  const pairsRegExp = pairs.map(pair => {
    const _firstRegExp = new RegExp(pair[0].toLocaleLowerCase(), "g"); 
    const _secondRegExp = new RegExp(pair[1].toLocaleLowerCase(), "g");
  
   return { first: pair[0].toLocaleLowerCase(), second: pair[1].toLocaleLowerCase(), firstRegExp:_firstRegExp, secondRegExp: _secondRegExp}
  });
  
  // console.log(pairsRegExp);
  
  
  function removeSimilarSymbols(pairToCompair,  _index) {
  let changes = 0;
    let index = _index;
    let a = pairToCompair[0].replace(/[\'\`\-]/g, "");
    let b = pairToCompair[1].replace(/[\'\`\-]/g, "");  
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
    
    // console.log([a, b]);
    
    })

    return {data: [a, b], changes : changes, index: index};
  }
  
  function compairPossibleDoubles(inputPair) {
    let a = inputPair[0];
    let b = inputPair[1];
    let changes = 0; let _index = 0;
    do {
    const answer = removeSimilarSymbols([a, b], _index);
      //console.log(answer);
      a = answer.data[0];    b = answer.data[1];
      _index = answer.index;
      changes = answer.changes;
    //   console.log(a, b, _index, changes);

    } while (changes > 0);
    
    //console.log(a, b);
    if (!a.localeCompare(b)) return true;
    //let currentIndex = 0;
    
    //if (currentIndex === (a.length - 1) && a.localeCompare(b) !== 0 )  return false
    return false;
  }
  const testPairs = [
    ["Шавеш Шавеш", 'Савес Савес'],
    ["Чо-Сон", 'Чосун'], 
    ["Бруно Бруно", 'Бруну Бруну'],
    [ 'Бруну Бруну', "Бруно Бруно"],
  /*
    ["Хуан", 'Жуан'],
    ["Педро", 'педру'],
      ["О'Рейли", 'Орейли'],
  ["О'Рэйлие", 'О`райлиё с'],
  */
  ]
  const start = Date.now();
  console.log(start);
   testPairs.forEach(el => {
     console.log(el, compairPossibleDoubles(el));
   })
  
  console.log((Date.now() - start));
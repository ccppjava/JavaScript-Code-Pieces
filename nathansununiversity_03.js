// http://nathansuniversity.com/pegs.html
// http://pegjs.majda.cz/

// page 1
start =
    char

char =
    [A-Z]

// page 2
start =
    countrycode

lowercase =
    [a-z]

countrycode =
    first:lowercase second:lowercase
        { return "" + first + second ;}

// page 3
start =
    word

word = 
    allLower
  / allUpper

allLower = 
    all:[a-z]+
        { return all.join("");}

allUpper = 
    all:[A-Z]+
        { return all.join("");}

// page 3
start =
    wordlist

wordlist =
    nword:word sword:spaceword*
        { if (sword && sword.length) {
              sword.unshift(nword)
              return sword;
          } else {
              return [nword];
          }
        }

word = 
    nword:[a-z]+
        { return nword.join(""); }

space = 
    " "
    
spaceword = 
    space nword:word
        { return nword; }
        
/* test code for page 3 */
var parse = wrapExceptions(PEG.buildParser(answer).parse);

assert_eq(parse(""), undefined,
    "don't parse empty string");
assert_eq(parse("dog"), ["dog"],
    "parse dog");
assert_eq(parse("black dog"), ["black", "dog"],
    "parse black dog");
assert_eq(parse("angry black dog"), ["angry", "black", "dog"],
    "parse angry black dog");
assert_eq(parse("Gray dog"), undefined,
    "don't parse Gray dog");

// page 4

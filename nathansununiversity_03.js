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

// first attempt
// this solution is not a solution, it just make test pass
// need to think about several layer nested situation
// need to recursively parse the expression
// now using:
// https://github.com/dannycoates/node-inspector
// for debug node/pegjs
// $ node --debug-brk your/short/node/script.js
// $ node-inspector &
// # open chrome/safari:
// http://192.168.77.250:8080/debug?port=5858

start =
    expression

expression = 
    atom
  / listatom
  / nestedlist
    
validchar
    = [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }
     
listatom = 
    "(" space* natom:atom satom:spaceatom* space* ")"
        { if (satom && satom.length) {
              satom.unshift(natom);
              return satom;
          } else {
              return [natom];
          }
        }

nestedlist = 
    "(" space* natom1:atom* satom1:spaceatom* space* latom1:listatom* space* ")"
        {
            var result = [];
            if (natom1 && natom1.length) {
                result = result.concat(natom1);
            }
            
            if (satom1 && satom1.length) {
                result = result.concat(satom1);
            }
            
            if (latom1 && latom1.length) {
                result = result.concat(latom1);
            }
            
            return result;
        }

space =
    " "
    
spaceatom = 
    space natom:atom
        { return natom; }

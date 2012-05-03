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


// Page 7
// a very ... chicky implementation, guess it is not the original purpose
// of author, will re-visit when have time
// hint of page:
// I added a new rule comma at the top then modified the start and primary rules. 
start =
    additive
    
symbol = 
    "+"
  / ","

additive =
    left:multiplicative symbol:symbol right:additive
        { return {tag: symbol, left:left, right:right}; }
  / multiplicative

multiplicative =
    left:primary "*" right:multiplicative
        { return {tag: "*", left:left, right:right}; }
  / primary

primary =
    integer
  / "(" additive:additive ")"
      { return additive; }

integer =
    digits:[0-9]+
        { return parseInt(digits.join(""), 10); }

// test for above on the page
var parse = wrapExceptions(PEG.buildParser(answer).parse);

assert_eq(parse("1+2"),
    {tag:"+", left:1, right:2},
    "parse 1+2");
assert_eq(parse("1+2*3"),
    {tag:"+", left:1, right:{tag:"*", left:2, right:3}},
    "parse 1+2*3");
assert_eq(parse("1,2"),
    {tag:",", left:1, right:2},
    "parse 1,2");
assert_eq(parse("1,2+3"),
    {tag:",", left:1, right:{tag:"+", left:2, right:3}},
    "parse 1,2+3");
assert_eq(parse("1*2,3"),
    {tag:",", left:{tag:"*", left:1, right:2}, right:3},
    "parse 1*2,3");



// Page 8, howto write simple test case in node.js
var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('my.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );

// One trick that might be helpful is that the PEG parsers 
// you generate can be started from rules other than start.
assert.deepEqual(parse("a4[100]", "note"),
    {tag:"note", pitch:"a4", dur:100});

// TODO: Homework

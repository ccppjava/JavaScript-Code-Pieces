// http://nathansuniversity.com/music.html

var prelude = function(expr) {
    // Your code here
    return { tag: 'seq',
            left: { tag: 'note', pitch: 'd4', dur: 500 },
            right: expr
           };
};

// TESTS

var melody1 = { tag: 'note', pitch: 'c4', dur: 250 };
var melody2 = 
    { tag: 'seq',
      left: { tag: 'note', pitch: 'd4', dur: 500 },
      right: { tag: 'note', pitch: 'c4', dur: 250 } };
var melody3 = 
    { tag: 'seq',
      left: { tag: 'note', pitch: 'd4', dur: 500 },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'd4', dur: 500 },
         right: { tag: 'note', pitch: 'c4', dur: 250 } } };

jshint(answer);
eval(answer);

assert_eq(prelude(melody1), melody2,
       'Single note input prelude test');
assert_eq(prelude(melody2), melody3,
       'Double note input prelude test');


/********************************************/
var reverse = function(expr) {
    // Your code here
    if (!expr || expr.tag != 'seq') {
        return expr;
    } else {
        return {
            tag: 'seq',
            left: arguments.callee(expr.right),
            right: arguments.callee(expr.left)
        };
    }
};

// TESTS

var melody1 = { tag: 'note', pitch: 'a4', dur: 125 };
var melody2 = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };
var melody3 = 
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'd4', dur: 500 },
         right: { tag: 'note', pitch: 'c4', dur: 500 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'b4', dur: 250 },
         right: { tag: 'note', pitch: 'a4', dur: 250 } } };

jshint(answer);
eval(answer);

assert_eq(reverse(melody1), melody1,
       'One note test');
assert_eq(reverse(melody2), melody3,
       'Four note test');
assert_eq(reverse(melody3), melody2,
       'Four note test backwards');



/************************************************/

var endTime = function (time, expr) {
    // your code here
    var sum = (function(expr) {
        if (!expr) {
            log(1);
            return 0;
        } else if (expr.tag === 'note') {
            log(2);
            return expr.dur;
        } else {            
            log(3);
            return arguments.callee(expr.left) + arguments.callee(expr.right);
        }
    })(expr);
    
    return sum + time;
};


// or 

var endTime = function (time, expr) {
    // your code here
    (function(expr) {
        if (expr.tag === 'note') {
            time += expr.dur;
        } else {
            arguments.callee(expr.left);
            arguments.callee(expr.right);
        }
    })(expr);
    return time;
};



/************************************************/



// maybe some helper functions

var compile = function (musexpr) {
    // your code hereelse 
    var time = 0;
    var result = [];
    (function(expr) {
        if (expr.tag === 'note') {
            expr.start = time;
            time += expr.dur;
            result.push(expr);
        } else {
            arguments.callee(expr.left);
            arguments.callee(expr.right);
        }
    })(musexpr);
    
    return result;
};


/************************************************/


var playMUS = function(expr) {
    playNOTE(compile(expr));
};


/************************************************/
// END TIME WITH PAR

// this is all you
var endTime = function endTime(time, expr) {
    // your code here
    (function(expr) {
        if (expr.tag === 'note') {
            log(time + "~1");
            time += expr.dur;
            log(time + "*1");
        } else if (expr.tag === 'par') {
            log(time + "~2");
            var endLeft = endTime(0, expr.left);
            var endRight = endTime(0, expr.right);
            time += endLeft > endRight ? endLeft : endRight;
            log(time + "*2");
        } else {
            log(time + "~3");
            arguments.callee(expr.left);
            arguments.callee(expr.right);
            log(time + "*3");
        }
    })(expr);
    
    return time;
};

var compile = function (expr) {
    log(endTime(0, expr));
}; 



/****************************************/

// I do not like following ugly solution
// this is all you
var result = [];
var endTime = function endTime(time, expr, ref) {
    // your code here
    (function(expr) {
        if (expr.tag === 'note') {
            log(time + "~1");
            expr.start = ref;
            result.push(expr);
            
            time += expr.dur;
            log(time + "*1");
        } else if (expr.tag === 'par') {
            log(time + "~2");
            var endLeft = endTime(0, expr.left, time);
            var endRight = endTime(0, expr.right, time);
            time += endLeft > endRight ? endLeft : endRight;
            log(time + "*2");
        } else {
            log(time + "~3");
            arguments.callee(expr.left);
            arguments.callee(expr.right);
            log(time + "*3");
        }
    })(expr);
    
    return time;
};

var compile = function (expr) {
    
    log(endTime(0, expr, 0));
    
    console.dir(result);
    return result;
};



// or more concise, same insane solution of function inside function inside funtion
// this is just functional style programming ?!


var compile = function (expr) {
    
    var result = [];

    (function endTime(time, expr, ref) {
        // your code here
        (function(expr) {
            if (expr.tag === 'note') {
                expr.start = ref;
                result.push(expr);
                
                time += expr.dur;
            } else if (expr.tag === 'par') {
                var endLeft = endTime(0, expr.left, time);
                var endRight = endTime(0, expr.right, time);
                time += endLeft > endRight ? endLeft : endRight;
            } else {
                arguments.callee(expr.left);
                arguments.callee(expr.right);
            }
        })(expr);
        
        return time;
    })(0, expr, 0);
        
    return result;
};

